from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from expenses.serializers import UserRegistrationSerialier, UserLoginSerializer, BudgetSerializer, ExpenseSerializer, IncomeSerializer
from django.contrib.auth import authenticate
from expenses.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import Expense, Income, Budget
from rest_framework.decorators import api_view, permission_classes
from .pagination import CustomPagination
from rest_framework.filters import SearchFilter, OrderingFilter
from .filters import ExpenseFilter, IncomeFilter
from rest_framework.decorators import action
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import MultiPartParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
import pandas as pd
from .utils import check_and_notify_budget
from .tasks import send_otp
from django.core.cache import cache
import random

#Generate token manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
# Create your views here.
class UserRegistrationView(APIView):
    def post(self, request, format=None):
        serializer = UserRegistrationSerialier(data=request.data)
        if (serializer.is_valid(raise_exception=True)):
            user = serializer.save()
            token = get_tokens_for_user(user)
            return Response({'token':token,'msg':'Registration Done'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserLoginView(APIView):
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            user = authenticate(request, username=email, password=password)
            if user is not None:
                token = get_tokens_for_user(user)
                return Response({'token':token,'msg':'logged in Succussfully!!'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ExpenseView(viewsets.ModelViewSet):
    queryset= Expense.objects.all()
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ExpenseFilter
    ordering_fields = ['amount', 'title']
    parser_classes = [JSONParser, MultiPartParser]
    
    #Add Bulk Expense using Excel file
    @action(detail=False, methods=['POST'], url_path='upload-file', url_name='upload-file')
    def upload_file (self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        if not file.name.endswith('.xlsx'):
            return Response({"error": "invalid File Format, upload a Excel file with .xlsx extension."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            df = pd.read_excel(file)
            for col in df.columns: 
                print(col)
            required_columns = ['title', 'amount', 'category', 'description']
            
            if not all (col in df.columns for col in required_columns):
                return Response({"error": "File must contain {required_columns} columns"}, status=status.HTTP_400_BAD_REQUEST)
            expenses=[
                Expense(
                    user = request.user,
                    title= row['title'],
                    amount= row['amount'],
                    category= row['category'],
                    description= row.get('description', ''),
                )
                for _, row in df.iterrows()
            ]
            Expense.objects.bulk_create(expenses)
            check_and_notify_budget(request.user)
            return Response({'Added Expense successfully!!'},status=status.HTTP_200_OK)
        except Exception as err:
            return Response({'Error:{err}'}, status = status.HTTP_500_INTERNAL_SERVER_ERROR)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        check_and_notify_budget(self.request.user)
    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by(self.request.query_params.get('ordering', '-id'))
    

class IncomeView(viewsets.ModelViewSet):
    queryset= Income.objects.all()
    serializer_class = IncomeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = IncomeFilter
    ordering_fields = ['amount', 'title']

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    def get_queryset(self):
        return Income.objects.filter(user=self.request.user).order_by(self.request.query_params.get('ordering', '-id'))
    
class BudgetView(viewsets.ModelViewSet):
    queryset= Budget.objects.all()
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
    
#Budget Alert for UI
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_budget_alert(request):
    user = request.user
    budgets = Budget.objects.filter(user=user)
    serializer = BudgetSerializer(budgets, many=True)
    return Response(serializer.data)

#Send Email verification OTP
@csrf_exempt
@api_view(['POST'])
def send_otp_view(request):
    try:
        otp = random.randint(100000,999999)
        email = request.data.get("email")
        cache.set(f"otp_{email}", otp, timeout=600) #10 mins
        send_otp.delay(email, otp)
        return Response({"message":"Otp Sent Successfully!!"})
    except Exception as err:
        return Response({err}, status=status.HTTP_400_BAD_REQUEST)
    
#Verify Email OTP
@api_view(['POST'])
def verify_otp(request):
    email = request.data.get("email")
    user_otp = request.data.get("otp")
    cached_otp = cache.get(f"otp_{email}")
    if cached_otp and str(cached_otp)== str(user_otp) :
        cache.delete(f"otp_{email}")
        return Response({"verified":True},status=status.HTTP_200_OK)
    else:
        return Response({"error": "Inavlid OTP or OTP expired"}, status=status.HTTP_400_BAD_REQUEST)