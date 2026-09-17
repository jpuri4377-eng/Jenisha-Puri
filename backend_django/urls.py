"""
SwapTalent - Django URL Configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TalentListingViewSet, 
    SwapRequestViewSet, 
    NowPaymentsInvoiceView, 
    NowPaymentsIPNWebhookView
)

router = DefaultRouter()
router.register(r'talents', TalentListingViewSet, basename='talent')
router.register(r'swaps', SwapRequestViewSet, basename='swap')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/payments/nowpayments/create-invoice/', NowPaymentsInvoiceView.as_view(), name='nowpayments-invoice'),
    path('api/payments/nowpayments/ipn/', NowPaymentsIPNWebhookView.as_view(), name='nowpayments-ipn'),
]
