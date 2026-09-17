"""
SwapTalent - Django Views & DRF ViewSets
Includes TalentListingViewSet, SwapRequestViewSet, and NOWPayments escrow integration.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import TalentListing, SwapRequest, NowPaymentTransaction, UserProfile
from .serializers import (
    TalentListingSerializer,
    TalentListingCreateSerializer,
    SwapRequestSerializer,
    SwapRequestCreateSerializer,
    NowPaymentTransactionSerializer,
)
from .nowpayments_service import NowPaymentsService


class TalentListingViewSet(viewsets.ModelViewSet):
    queryset = TalentListing.objects.select_related("teacher__user").all()

    def get_serializer_class(self):
        if self.action in ["create", "update", "partial_update"]:
            return TalentListingCreateSerializer
        return TalentListingSerializer

    def perform_create(self, serializer):
        # In production with Django Auth: serializer.save(teacher=self.request.user.swap_profile)
        # For demo/initialization, assign to first profile or active user
        profile = UserProfile.objects.first()
        serializer.save(teacher=profile)

    @action(detail=False, methods=["get"])
    def categories(self, request):
        return Response(
            [
                "Programming & Tech",
                "Languages",
                "Design & Creative",
                "Music & Audio",
                "Business & Finance",
                "Fitness & Wellness",
                "Academics & Science",
                "Crafts & DIY",
            ]
        )


class SwapRequestViewSet(viewsets.ModelViewSet):
    queryset = SwapRequest.objects.select_related(
        "requester__user", "recipient__user", "talent_listing"
    ).all()

    def get_serializer_class(self):
        if self.action == "create":
            return SwapRequestCreateSerializer
        return SwapRequestSerializer

    @action(detail=True, methods=["post"], url_path="confirm-delivery")
    def confirm_delivery(self, request, pk=None):
        """
        Marks that a participant has delivered their teaching session.
        When both peers confirm, NOWPayments escrow is automatically released/refunded!
        """
        swap = self.get_object()
        user_role = request.data.get("role", "requester")  # 'requester' or 'recipient'

        if user_role == "requester":
            swap.requester_delivered = True
        elif user_role == "recipient":
            swap.recipient_delivered = True

        completed = swap.check_and_complete_swap()
        swap.save()

        return Response(
            {
                "status": "success",
                "swap_status": swap.status,
                "requester_delivered": swap.requester_delivered,
                "recipient_delivered": swap.recipient_delivered,
                "escrow_released": swap.escrow_released,
                "message": (
                    "Both parties confirmed! Escrow funds released."
                    if completed
                    else "Delivery recorded. Awaiting peer confirmation."
                ),
            }
        )

    @action(detail=True, methods=["post"], url_path="release-escrow")
    def release_escrow(self, request, pk=None):
        """Force release/refund of NOWPayments escrow upon dispute settlement or mutual agreement."""
        swap = self.get_object()
        swap.status = "completed"
        swap.escrow_released = True
        swap.save()
        return Response(
            {"status": "success", "message": "Escrow released back to participants."}
        )


class NowPaymentsInvoiceView(APIView):
    """Creates a NOWPayments deposit invoice for securing a peer-to-peer talent swap."""

    def post(self, request):
        swap_id = request.data.get("swap_id")
        pay_currency = request.data.get("pay_currency", "usdttrc20").lower()
        swap = get_object_or_404(SwapRequest, id=swap_id)

        service = NowPaymentsService()
        price_amount = float(swap.escrow_deposit_usd or 15.00)
        order_description = f"SwapTalent Escrow: Swap #{swap.id} between {swap.requester.user.username} & {swap.recipient.user.username}"

        # Call NOWPayments API
        result = service.create_invoice(
            price_amount=price_amount,
            order_id=f"SWAP-{swap.id}-{int(timezone.now().timestamp())}",
            order_description=order_description,
            pay_currency=pay_currency,
        )

        payment_id = result.get("payment_id", f"sim_{int(timezone.now().timestamp())}")
        pay_address = result.get("pay_address", "TPYq87g6qK3xL9v6gR3jX78m9qK1e")
        pay_amount = result.get("pay_amount", price_amount)

        # Save record in database
        tx = NowPaymentTransaction.objects.create(
            swap=swap,
            payment_id=str(payment_id),
            order_id=result.get("order_id", f"SWAP-{swap.id}"),
            order_description=order_description,
            price_amount=price_amount,
            price_currency="usd",
            pay_amount=pay_amount,
            pay_currency=pay_currency,
            pay_address=pay_address,
            payment_status=result.get("payment_status", "waiting"),
        )

        return Response(
            NowPaymentTransactionSerializer(tx).data, status=status.HTTP_201_CREATED
        )


class NowPaymentsIPNWebhookView(APIView):
    """
    Receives NOWPayments IPN callbacks, validates HMAC-SHA512 signature,
    and updates Swap escrow status to LOCKED_IN_ESCROW upon payment completion.
    """

    def post(self, request):
        service = NowPaymentsService()
        sig = request.headers.get("x-nowpayments-sig", "")

        if not service.verify_ipn_signature(request.body, sig):
            return Response(
                {"error": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST
            )

        data = request.data
        payment_id = data.get("payment_id")
        payment_status = data.get("payment_status")

        tx = NowPaymentTransaction.objects.filter(payment_id=str(payment_id)).first()
        if tx:
            tx.payment_status = payment_status
            tx.save()

            if payment_status in ["finished", "confirmed"]:
                tx.swap.status = "locked_in_escrow"
                tx.swap.save()

        return Response({"status": "received"})
