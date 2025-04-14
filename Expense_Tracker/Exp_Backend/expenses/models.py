from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser
# Create your models here.

#Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, password2=None):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError("Users must have an email address")
        
        user = self.model(
            email=self.normalize_email(email),
            name=name,
            
        )
        user.is_active = True
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            name=name,
        )
        user.is_admin = True
        user.is_active=True
        user.save(using=self._db)
        return user

#Custom User
class User(AbstractBaseUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('user', 'User'),
        ]
    email = models.EmailField(
        verbose_name="Email",
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    is_active = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin
    

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('Food', 'Food'),
        ('Transport', 'Transport'),
        ('Shopping', 'Shopping'),
        ('Entertainment', 'Entertainment'),
        ('Bills', 'Bills'),
        ('Others', 'Others'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when created
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp when modified

    def __str__(self):
        return f"{self.user.name} - {self.amount} - {self.category}"
    
class Income(models.Model):
    SOURCE_CHOICES = [
        ('Earned', 'Earned'),
        ('Passive', 'Passive'),
        ('Portfolio', 'Portfolio'),
        ('Others', 'Others'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    source = models.CharField(max_length=50, choices=SOURCE_CHOICES)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when created
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp when modified

    def __str__(self):
        return f"{self.user.name} - {self.amount} - {self.source}"

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount_limit = models.DecimalField(max_digits=10, decimal_places=2)
    start_date = models.DateField()  # Budget starts from this date
    end_date = models.DateField()  # Budget ends at this date
    created_at = models.DateTimeField(auto_now_add=True)  # Timestamp when created
    updated_at = models.DateTimeField(auto_now=True)  # Timestamp when modified
    notified = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.name} - {self.amount_limit} from {self.start_date} to {self.end_date}"
