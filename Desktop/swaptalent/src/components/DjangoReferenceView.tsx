import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Terminal, 
  Server, 
  Database,
  Layers,
  Code
} from 'lucide-react';

export const DjangoReferenceView: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'models' | 'serializers' | 'views' | 'nowpayments' | 'urls' | 'quickstart'>('models');
  const [copied, setCopied] = useState(false);

  const fileContents = {
    models: `"""
SwapTalent - Django Models (backend_django/models.py)
"""
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='swap_profile')
    title = models.CharField(max_length=120, default='Passionate Swapper')
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)
    location = models.CharField(max_length=100, default='Remote')
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    completed_swaps = models.PositiveIntegerField(default=0)
    crypto_wallet_address = models.CharField(max_length=100, blank=True)
    badges = models.JSONField(default=list, blank=True)

class TalentListing(models.Model):
    teacher = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='talents')
    title = models.CharField(max_length=200, help_text="What you want to teach")
    category = models.CharField(max_length=50, default='Programming & Tech')
    description = models.TextField()
    topics_covered = models.JSONField(default=list)
    teach_skills = models.JSONField(default=list)
    wanted_skills = models.JSONField(default=list)
    proficiency_level = models.CharField(max_length=20, default='Advanced')
    session_format = models.CharField(max_length=40, default='1-on-1 Live Video')
    session_duration_mins = models.PositiveIntegerField(default=60)
    experience_years = models.PositiveIntegerField(default=3)
    availability = models.CharField(max_length=150)
    escrow_deposit_usd = models.DecimalField(max_digits=6, decimal_places=2, default=15.00)
    student_prerequisites = models.TextField(blank=True)
    portfolio_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class SwapRequest(models.Model):
    requester = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='sent_swaps')
    recipient = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='received_swaps')
    talent_listing = models.ForeignKey(TalentListing, on_delete=models.CASCADE)
    requester_offer_title = models.CharField(max_length=200)
    requester_offer_description = models.TextField(blank=True)
    status = models.CharField(max_length=30, default='escrow_deposit_required')
    session_date_proposal = models.CharField(max_length=100)
    escrow_deposit_usd = models.DecimalField(max_digits=6, decimal_places=2, default=15.00)
    requester_delivered = models.BooleanField(default=False)
    recipient_delivered = models.BooleanField(default=False)
    escrow_released = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class NowPaymentTransaction(models.Model):
    swap = models.ForeignKey(SwapRequest, on_delete=models.CASCADE, related_name='payments')
    payment_id = models.CharField(max_length=100, unique=True)
    order_id = models.CharField(max_length=100)
    price_amount = models.DecimalField(max_digits=8, decimal_places=2)
    pay_amount = models.DecimalField(max_digits=18, decimal_places=8)
    pay_currency = models.CharField(max_length=15, default='usdttrc20')
    pay_address = models.CharField(max_length=120)
    payment_status = models.CharField(max_length=20, default='waiting')
    network = models.CharField(max_length=30, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)`,

    serializers: `"""
SwapTalent - DRF Serializers (backend_django/serializers.py)
"""
from rest_framework import serializers
from .models import UserProfile, TalentListing, SwapRequest, NowPaymentTransaction

class UserSummarySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = UserProfile
        fields = ['id', 'username', 'title', 'bio', 'avatar_url', 'rating', 'completed_swaps']

class TalentListingSerializer(serializers.ModelSerializer):
    teacher = UserSummarySerializer(read_only=True)
    class Meta:
        model = TalentListing
        fields = '__all__'

class SwapRequestSerializer(serializers.ModelSerializer):
    requester = UserSummarySerializer(read_only=True)
    recipient = UserSummarySerializer(read_only=True)
    talent_listing = TalentListingSerializer(read_only=True)
    class Meta:
        model = SwapRequest
        fields = '__all__'`,

    views: `"""
SwapTalent - DRF ViewSets & Escrow Release (backend_django/views.py)
"""
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import TalentListing, SwapRequest, NowPaymentTransaction
from .serializers import TalentListingSerializer, SwapRequestSerializer
from .nowpayments_service import NowPaymentsService

class TalentListingViewSet(viewsets.ModelViewSet):
    queryset = TalentListing.objects.select_related('teacher__user').all()
    serializer_class = TalentListingSerializer

class SwapRequestViewSet(viewsets.ModelViewSet):
    queryset = SwapRequest.objects.all()
    serializer_class = SwapRequestSerializer

    @action(detail=True, methods=['post'], url_path='confirm-delivery')
    def confirm_delivery(self, request, pk=None):
        swap = self.get_object()
        role = request.data.get('role', 'requester')
        if role == 'requester':
            swap.requester_delivered = True
        else:
            swap.recipient_delivered = True
        
        # Automatic release when both peers confirm
        if swap.requester_delivered and swap.recipient_delivered:
            swap.status = 'completed'
            swap.escrow_released = True
        swap.save()
        return Response({"status": "updated", "swap_status": swap.status})`,

    nowpayments: `"""
NOWPayments Client with HMAC-SHA512 Verification (backend_django/nowpayments_service.py)
"""
import hmac
import hashlib
import json
import requests
from django.conf import settings

class NowPaymentsService:
    BASE_URL = "https://api-sandbox.nowpayments.io/v1"

    def __init__(self):
        self.api_key = getattr(settings, 'NOWPAYMENTS_API_KEY', '')
        self.ipn_secret = getattr(settings, 'NOWPAYMENTS_IPN_SECRET', '')

    def create_invoice(self, price_amount, order_id, order_description, pay_currency='usdttrc20'):
        headers = {'x-api-key': self.api_key, 'Content-Type': 'application/json'}
        payload = {
            "price_amount": float(price_amount),
            "price_currency": "usd",
            "pay_currency": pay_currency,
            "order_id": order_id,
            "order_description": order_description,
            "is_fixed_rate": True
        }
        return requests.post(f"{self.BASE_URL}/payment", headers=headers, json=payload).json()

    def verify_ipn_signature(self, request_body_bytes, signature):
        if not self.ipn_secret:
            return True
        payload = json.loads(request_body_bytes)
        sorted_payload = json.dumps(payload, sort_keys=True, separators=(',', ':'))
        expected = hmac.new(self.ipn_secret.encode('utf-8'), sorted_payload.encode('utf-8'), hashlib.sha512).hexdigest()
        return hmac.compare_digest(expected, signature)`,

    urls: `"""
Django URL Routing (backend_django/urls.py)
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TalentListingViewSet, SwapRequestViewSet, NowPaymentsInvoiceView, NowPaymentsIPNWebhookView

router = DefaultRouter()
router.register(r'talents', TalentListingViewSet, basename='talent')
router.register(r'swaps', SwapRequestViewSet, basename='swap')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/payments/nowpayments/create-invoice/', NowPaymentsInvoiceView.as_view()),
    path('api/payments/nowpayments/ipn/', NowPaymentsIPNWebhookView.as_view()),
]`,

    quickstart: `# SwapTalent Django Backend Quickstart

# 1. Install Django & dependencies
pip install django djangorestframework django-cors-headers requests

# 2. Add 'backend_django' and 'rest_framework' in settings.py:
INSTALLED_APPS = [
    ...
    'rest_framework',
    'corsheaders',
    'backend_django',
]

# 3. Add NOWPayments credentials in settings.py or .env:
NOWPAYMENTS_API_KEY = "YOUR_API_KEY"
NOWPAYMENTS_IPN_SECRET = "YOUR_IPN_SECRET"
NOWPAYMENTS_SANDBOX = True

# 4. Migrate database:
python manage.py makemigrations
python manage.py migrate

# 5. Run development server:
python manage.py runserver 8000`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fileContents[activeFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCode className="w-5 h-5 text-emerald-600" />
            Django Backend Specification
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full Python & Django REST Framework architecture matching the live SwapTalent endpoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5" /> Django 5.x / DRF Ready
          </span>
        </div>
      </div>

      {/* Code Viewer Container */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
        {/* Tab Navigation */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between overflow-x-auto gap-2">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setActiveFile('models')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeFile === 'models' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              models.py
            </button>
            <button
              onClick={() => setActiveFile('serializers')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeFile === 'serializers' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              serializers.py
            </button>
            <button
              onClick={() => setActiveFile('views')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeFile === 'views' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              views.py
            </button>
            <button
              onClick={() => setActiveFile('nowpayments')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeFile === 'nowpayments' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              nowpayments_service.py
            </button>
            <button
              onClick={() => setActiveFile('urls')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeFile === 'urls' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              urls.py
            </button>
            <button
              onClick={() => setActiveFile('quickstart')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                activeFile === 'quickstart' ? 'bg-emerald-900/60 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Django Quickstart
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Code'}
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-5 text-xs text-emerald-400 font-mono overflow-x-auto max-h-[500px] leading-relaxed">
          <code>{fileContents[activeFile]}</code>
        </pre>
      </div>
    </div>
  );
};
