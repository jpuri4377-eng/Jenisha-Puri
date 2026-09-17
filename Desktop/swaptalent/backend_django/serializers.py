"""
SwapTalent - Django REST Framework Serializers
Serializes UserProfile, TalentListing, SwapRequest, and NowPaymentTransaction.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, TalentListing, SwapRequest, NowPaymentTransaction

class UserSummarySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id', 'username', 'email', 'title', 'bio', 
            'avatar_url', 'location', 'rating', 'review_count', 
            'completed_swaps', 'badges', 'crypto_wallet_address'
        ]

class TalentListingSerializer(serializers.ModelSerializer):
    teacher = UserSummarySerializer(read_only=True)

    class Meta:
        model = TalentListing
        fields = [
            'id', 'teacher', 'title', 'category', 'description', 
            'topics_covered', 'teach_skills', 'wanted_skills', 
            'proficiency_level', 'session_format', 'session_duration_mins', 
            'experience_years', 'availability', 'escrow_deposit_usd', 
            'student_prerequisites', 'portfolio_url', 'created_at', 'updated_at'
        ]

class TalentListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TalentListing
        fields = [
            'title', 'category', 'description', 'topics_covered', 
            'teach_skills', 'wanted_skills', 'proficiency_level', 
            'session_format', 'session_duration_mins', 'experience_years', 
            'availability', 'escrow_deposit_usd', 'student_prerequisites', 'portfolio_url'
        ]

class NowPaymentTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NowPaymentTransaction
        fields = '__all__'

class SwapRequestSerializer(serializers.ModelSerializer):
    requester = UserSummarySerializer(read_only=True)
    recipient = UserSummarySerializer(read_only=True)
    talent_listing = TalentListingSerializer(read_only=True)
    payments = NowPaymentTransactionSerializer(many=True, read_only=True)

    class Meta:
        model = SwapRequest
        fields = [
            'id', 'requester', 'recipient', 'talent_listing', 
            'requester_offer_title', 'requester_offer_description', 
            'status', 'session_date_proposal', 'meeting_link', 
            'escrow_deposit_usd', 'requester_delivered', 
            'recipient_delivered', 'escrow_released', 
            'payments', 'created_at', 'updated_at'
        ]

class SwapRequestCreateSerializer(serializers.ModelSerializer):
    talent_listing_id = serializers.IntegerField(write_only=True)
    recipient_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = SwapRequest
        fields = [
            'talent_listing_id', 'recipient_id', 'requester_offer_title', 
            'requester_offer_description', 'session_date_proposal', 'escrow_deposit_usd'
        ]
