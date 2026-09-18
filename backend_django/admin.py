from django.contrib import admin
from .models import UserProfile, TalentListing, SwapRequest, NowPaymentTransaction
from django.contrib import admin
from .models import UserProfile, TalentListing, SwapRequest, NowPaymentTransaction

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'title', 'location', 'rating', 'completed_swaps')
    search_fields = ('user__username', 'title', 'location')

@admin.register(TalentListing)
class TalentListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'teacher', 'category', 'proficiency_level', 'escrow_deposit_usd', 'is_volunteer', 'created_at')
    list_filter = ('category', 'proficiency_level', 'is_volunteer')
    search_fields = ('title', 'description', 'teacher__user__username')

@admin.register(SwapRequest)
class SwapRequestAdmin(admin.ModelAdmin):
    list_display = ('id', 'requester', 'recipient', 'talent_listing', 'status', 'created_at')
    list_filter = ('status',)

@admin.register(NowPaymentTransaction)
class NowPaymentTransactionAdmin(admin.ModelAdmin):
    list_display = ('payment_id', 'swap', 'payment_status', 'price_amount', 'pay_currency')
    list_filter = ('payment_status', 'pay_currency')  
