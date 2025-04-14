from django.contrib import admin
from expenses.models import User, Expense, Income, Budget
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# Register your models here.
class UserAdmin(BaseUserAdmin):

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ["id","email", "name","role", "is_admin"]
    list_filter = ["is_admin"]
    fieldsets = [
        ('UserCredentials', {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["name",'role',]}),
        ("Permissions", {"fields": ["is_admin"]}),
    ]
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            {
                "classes": ["wide"],
                "fields": ["email", "name","role", "password1", "password2"],
            },
        ),
    ]
    search_fields = ["email"]
    ordering = ["email",'id']
    filter_horizontal = []

admin.site.register(User, UserAdmin)
admin.site.register(Expense)
admin.site.register(Income)
admin.site.register(Budget)


