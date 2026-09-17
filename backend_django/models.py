"""
SwapTalent - Django Models
Defines UserProfile, TalentListing, SwapRequest, NowPaymentTransaction, and Review.
"""

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class UserProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="swap_profile"
    )
    title = models.CharField(max_length=120, default="Passionate Swapper")
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(
        blank=True,
        default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    )
    location = models.CharField(max_length=100, default="Remote")
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    review_count = models.PositiveIntegerField(default=0)
    completed_swaps = models.PositiveIntegerField(default=0)
    crypto_wallet_address = models.CharField(
        max_length=100,
        blank=True,
        help_text="User's payout address for refunded escrow",
    )
    badges = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.title})"


class TalentListing(models.Model):
    CATEGORY_CHOICES = [
        ("Programming & Tech", "Programming & Tech"),
        ("Languages", "Languages"),
        ("Design & Creative", "Design & Creative"),
        ("Music & Audio", "Music & Audio"),
        ("Business & Finance", "Business & Finance"),
        ("Fitness & Wellness", "Fitness & Wellness"),
        ("Academics & Science", "Academics & Science"),
        ("Crafts & DIY", "Crafts & DIY"),
    ]

    FORMAT_CHOICES = [
        ("1-on-1 Live Video", "1-on-1 Live Video"),
        ("Pair Programming / Live Collab", "Pair Programming / Live Collab"),
        ("Async Review & Feedback", "Async Review & Feedback"),
        ("Interactive Workshop", "Interactive Workshop"),
    ]

    LEVEL_CHOICES = [
        ("Beginner", "Beginner"),
        ("Intermediate", "Intermediate"),
        ("Advanced", "Advanced"),
        ("Expert", "Expert"),
    ]

    teacher = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="talents"
    )
    title = models.CharField(
        max_length=200,
        help_text="What you want to teach (e.g., Python & Django Backend Architecture)",
    )
    category = models.CharField(
        max_length=50, choices=CATEGORY_CHOICES, default="Programming & Tech"
    )
    description = models.TextField(
        help_text="Detailed description of what you will teach"
    )
    topics_covered = models.JSONField(
        default=list, help_text="List of topics or curriculum syllabus"
    )
    teach_skills = models.JSONField(
        default=list,
        help_text="Skills taught e.g., ['Django', 'REST APIs', 'PostgreSQL']",
    )
    wanted_skills = models.JSONField(
        default=list,
        help_text="Skills wanted in exchange e.g., ['React', 'TailwindCSS']",
    )
    proficiency_level = models.CharField(
        max_length=20, choices=LEVEL_CHOICES, default="Advanced"
    )
    session_format = models.CharField(
        max_length=40, choices=FORMAT_CHOICES, default="1-on-1 Live Video"
    )
    session_duration_mins = models.PositiveIntegerField(
        default=60, help_text="Length of each session in minutes"
    )
    experience_years = models.PositiveIntegerField(default=3)
    availability = models.CharField(max_length=150, default="Evenings & Weekends UTC")
    escrow_deposit_usd = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=15.00,
        help_text="Refundable commitment deposit in USD processed via NOWPayments crypto escrow",
    )
    student_prerequisites = models.TextField(
        blank=True, default="Basic curiosity and laptop with browser"
    )
    portfolio_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} by {self.teacher.user.username}"


class SwapRequest(models.Model):
    STATUS_CHOICES = [
        ("pending_acceptance", "Pending Acceptance"),
        ("escrow_deposit_required", "Escrow Deposit Required"),
        ("locked_in_escrow", "Locked in Escrow (NOWPayments)"),
        ("in_session", "In Session"),
        ("delivered_pending_peer", "Delivered Pending Peer Confirmation"),
        ("completed", "Completed (Escrow Released)"),
        ("disputed", "Disputed"),
        ("cancelled", "Cancelled"),
    ]

    requester = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="sent_swap_requests"
    )
    recipient = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="received_swap_requests"
    )
    talent_listing = models.ForeignKey(
        TalentListing, on_delete=models.CASCADE, related_name="swaps"
    )
    requester_offer_title = models.CharField(
        max_length=200, help_text="What skill the requester will teach in return"
    )
    requester_offer_description = models.TextField(blank=True)
    status = models.CharField(
        max_length=30, choices=STATUS_CHOICES, default="escrow_deposit_required"
    )
    session_date_proposal = models.CharField(max_length=100, blank=True)
    meeting_link = models.URLField(
        blank=True, default="https://meet.google.com/swap-talent-room"
    )
    escrow_deposit_usd = models.DecimalField(
        max_digits=6, decimal_places=2, default=15.00
    )

    # Peer confirmation tracking for escrow release
    requester_delivered = models.BooleanField(
        default=False, help_text="Requester confirmed their session was taught"
    )
    recipient_delivered = models.BooleanField(
        default=False, help_text="Recipient confirmed their session was taught"
    )
    escrow_released = models.BooleanField(
        default=False, help_text="NOWPayments escrow refunded upon dual confirmation"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def check_and_complete_swap(self):
        """Automatically releases escrow and completes swap when both peers confirm delivery."""
        if (
            self.requester_delivered
            and self.recipient_delivered
            and not self.escrow_released
        ):
            self.status = "completed"
            self.escrow_released = True
            self.save()
            # Increment completed swaps on both profiles
            self.requester.completed_swaps += 1
            self.requester.save()
            self.recipient.completed_swaps += 1
            self.recipient.save()
            return True
        return False


class NowPaymentTransaction(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ("waiting", "Waiting for Payment"),
        ("confirming", "Confirming on Blockchain"),
        ("confirmed", "Confirmed"),
        ("sending", "Sending Funds"),
        ("finished", "Finished / In Escrow Vault"),
        ("failed", "Failed"),
        ("refunded", "Refunded to Swapper"),
        ("expired", "Expired"),
    ]

    swap = models.ForeignKey(
        SwapRequest, on_delete=models.CASCADE, related_name="payments"
    )
    payment_id = models.CharField(max_length=100, unique=True, db_index=True)
    order_id = models.CharField(max_length=100)
    order_description = models.TextField(blank=True)
    price_amount = models.DecimalField(max_digits=8, decimal_places=2)
    price_currency = models.CharField(max_length=10, default="usd")
    pay_amount = models.DecimalField(max_digits=18, decimal_places=8)
    pay_currency = models.CharField(max_length=15, default="usdttrc20")
    pay_address = models.CharField(max_length=120)
    payment_status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS_CHOICES, default="waiting"
    )
    network = models.CharField(max_length=30, blank=True)
    tx_hash = models.CharField(max_length=150, blank=True)
    is_sandbox = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"NOWPayment {self.payment_id} [{self.payment_status}] for Swap #{self.swap.id}"
