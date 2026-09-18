# SwapTalent 🇳🇵
**Peer-to-Peer Skill Exchange Platform for Nepali Students**

SwapTalent is a full-stack web application that connects students and lifelong learners to exchange skills securely. Built with React, Django, and NOWPayments escrow integration.

## 🚀 Key Features
- **Smart Student Mode**: Personalized skill recommendations based on education level (Grade 1 → PhD)
- **15+ Diverse Categories**: From Programming & Tech to Cooking, Gaming, and Life Skills
- **NPR Currency Support**: Transparent pricing in Nepali Rupees with crypto escrow protection
- **Volunteer Mode**: Free community sessions for verified students
- **Full-Stack Architecture**: React + TypeScript frontend, Django REST API backend, SQLite database

## ️ Tech Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Django 4.x, Django REST Framework, SQLite
- **Payments**: NOWPayments API (Crypto Escrow)
- **Deployment**: Ngrok tunneling for local demo

## ‍💻 Run Locally

### Backend (Django)
```bash
cd backend_django
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 
