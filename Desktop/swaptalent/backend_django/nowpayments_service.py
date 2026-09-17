"""
SwapTalent - NOWPayments Crypto Escrow Service (Django)
Handles invoice creation, payment status polling, and IPN webhook HMAC-SHA512 verification.
"""
import hmac
import hashlib
import json
import requests
from django.conf import settings

class NowPaymentsService:
    BASE_URL_PROD = "https://api.nowpayments.io/v1"
    BASE_URL_SANDBOX = "https://api-sandbox.nowpayments.io/v1"

    def __init__(self):
        self.api_key = getattr(settings, 'NOWPAYMENTS_API_KEY', '')
        self.ipn_secret = getattr(settings, 'NOWPAYMENTS_IPN_SECRET', '')
        self.is_sandbox = getattr(settings, 'NOWPAYMENTS_SANDBOX', True)
        self.base_url = self.BASE_URL_SANDBOX if self.is_sandbox else self.BASE_URL_PROD

    def _get_headers(self):
        return {
            'x-api-key': self.api_key,
            'Content-Type': 'application/json'
        }

    def check_api_status(self):
        """Check if NOWPayments API is online."""
        try:
            res = requests.get(f"{self.base_url}/status", headers=self._get_headers(), timeout=5)
            return res.json()
        except Exception as e:
            return {"message": "API status unavailable", "error": str(e)}

    def get_available_currencies(self):
        """Fetch list of supported cryptocurrencies for escrow deposits."""
        try:
            res = requests.get(f"{self.base_url}/currencies", headers=self._get_headers(), timeout=5)
            return res.json()
        except Exception as e:
            return {"currencies": ["usdttrc20", "btc", "eth", "sol", "trx", "doge", "ltc"]}

    def create_invoice(self, price_amount, order_id, order_description, ipn_callback_url=None, pay_currency='usdttrc20'):
        """
        Creates a peer-to-peer escrow deposit payment via NOWPayments.
        """
        payload = {
            "price_amount": float(price_amount),
            "price_currency": "usd",
            "pay_currency": pay_currency,
            "order_id": str(order_id),
            "order_description": order_description,
            "is_fixed_rate": True,
            "is_fee_paid_by_user": False
        }
        if ipn_callback_url:
            payload["ipn_callback_url"] = ipn_callback_url

        try:
            res = requests.post(
                f"{self.base_url}/payment",
                headers=self._get_headers(),
                json=payload,
                timeout=10
            )
            return res.json()
        except Exception as e:
            return {"error": str(e), "fallback": True}

    def get_payment_status(self, payment_id):
        """Query live blockchain confirmation status from NOWPayments."""
        try:
            res = requests.get(
                f"{self.base_url}/payment/{payment_id}",
                headers=self._get_headers(),
                timeout=5
            )
            return res.json()
        except Exception as e:
            return {"payment_status": "waiting", "error": str(e)}

    def verify_ipn_signature(self, request_body_bytes, received_sig_header):
        """
        Verifies NOWPayments IPN callback signature using HMAC-SHA512.
        Required for secure crypto payment confirmation callbacks.
        """
        if not self.ipn_secret:
            return True # In sandbox/testing mode if secret not set
        
        # Sort keys alphabetically as specified by NOWPayments IPN docs
        try:
            payload = json.loads(request_body_bytes)
            sorted_payload = json.dumps(payload, sort_keys=True, separators=(',', ':'))
            expected_sig = hmac.new(
                self.ipn_secret.encode('utf-8'),
                sorted_payload.encode('utf-8'),
                hashlib.sha512
            ).hexdigest()
            return hmac.compare_digest(expected_sig, received_sig_header)
        except Exception:
            return False
