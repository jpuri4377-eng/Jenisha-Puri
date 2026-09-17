# SwapTalent - Django Backend Architecture

This directory contains the production-ready **Django + Django REST Framework (DRF)** backend codebase for **SwapTalent**, featuring:

1. **Models (`models.py`)**:
   - `UserProfile`: Handles user reputations, completed swap stats, crypto payout wallets, and badges.
   - `TalentListing`: Post what you want to teach, skills offered, skills wanted in exchange, session format, and NOWPayments commitment deposit.
   - `SwapRequest`: Peer-to-peer swap proposal lifecycle with mutual delivery confirmation and automatic escrow release.
   - `NowPaymentTransaction`: Tracks NOWPayments invoices, crypto payment addresses, and blockchain statuses (`waiting` -> `confirming` -> `finished`).

2. **Serializers (`serializers.py`)**:
   - DRF ModelSerializers for seamless JSON input/output validation.

3. **Views & Endpoints (`views.py` & `urls.py`)**:
   - `/api/talents/`: CRUD operations for teaching listings.
   - `/api/swaps/`: Proposal management, mutual delivery confirmations, and escrow release.
   - `/api/payments/nowpayments/create-invoice/`: Generates crypto invoices via NOWPayments.
   - `/api/payments/nowpayments/ipn/`: Secure IPN webhook listener validating HMAC-SHA512 signatures.

4. **NOWPayments Integration (`nowpayments_service.py`)**:
   - Supports USDT (TRC20/ERC20), BTC, ETH, SOL, MATIC, and other coins.
   - HMAC-SHA512 verification to securely confirm blockchain transactions.

## Quickstart (Django Local Setup)

```bash
# 1. Install dependencies
pip install django djangorestframework django-cors-headers requests

# 2. Add to INSTALLED_APPS in settings.py:
# 'rest_framework',
# 'corsheaders',
# 'backend_django',

# 3. Configure environment variables in .env:
# NOWPAYMENTS_API_KEY="your-nowpayments-api-key"
# NOWPAYMENTS_IPN_SECRET="your-ipn-secret"
# NOWPAYMENTS_SANDBOX=True

# 4. Migrate and run
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 8000
```
