#!/bin/bash
source .venv/bin/activate

# 1. Add 8 more talents to your database automatically
python -c "
import os, django; os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings'); django.setup()
from backend_django.models import TalentListing, UserProfile
from django.contrib.auth.models import User
users = [('sujan','Sujan Rai','Kathmandu','Guitar'), ('priya','Priya Gurung','Pokhara','Yoga'), ('rajesh','Rajesh KC','Lalitpur','Marketing'), ('nisha','Nisha Shrestha','Bhaktapur','Pottery')]
for u,n,l,b in users:
    user,_ = User.objects.get_or_create(username=u, defaults={'email':f'{u}@test.com'}); user.set_password('test123'); user.save()
    UserProfile.objects.get_or_create(user=user, defaults={'title':n,'bio':b,'location':l,'rating':4.5})
talents = [
('sujan','Acoustic Guitar','Music & Audio','Learn chords',['Guitar'],['Vocals'],'Beginner','1-on-1 Live Video',45,3,'Weekends',1500,False),
('sujan','Music Production','Music & Audio','Beat making',['FL Studio'],['Design'],'Intermediate','Pair Programming',60,5,'Evenings',2500,False),
('priya','Morning Yoga','Fitness & Wellness','Guided yoga',['Yoga'],['Cooking'],'Beginner','Interactive Workshop',30,8,'Mornings',0,True),
('priya','Stress Management','Fitness & Wellness','Relaxation',['Mindfulness'],['Languages'],'Beginner','1-on-1 Live Video',45,6,'Flexible',1200,False),
('rajesh','Social Media Marketing','Business & Finance','Grow on Instagram',['SEO'],['Photography'],'Intermediate','Pair Programming',60,4,'Weekdays',2000,False),
('rajesh','Google Ads','Business & Finance','Run campaigns',['Google Ads'],['Web Dev'],'Advanced','1-on-1 Live Video',90,5,'Evenings',3000,False),
('nisha','Nepali Pottery','Crafts & DIY','Ancient techniques',['Pottery'],['Nepali'],'Beginner','Interactive Workshop',120,10,'Weekends',800,False),
('nisha','Thangka Painting','Design & Creative','Sacred art',['Painting'],['English'],'Beginner','1-on-1 Live Video',90,12,'Mornings',1800,False)
]
for u,t,c,d,ts,ws,l,f,dur,exp,av,p,v in talents:
    prof = UserProfile.objects.get(user__username=u)
    TalentListing.objects.update_or_create(title=t, defaults={'description':d,'teacher':prof,'category':c,'teach_skills':ts,'wanted_skills':ws,'proficiency_level':l,'session_format':f,'session_duration_mins':dur,'experience_years':exp,'availability':av,'escrow_deposit_usd':p,'is_volunteer':v})
    print(f\"{'[FREE]' if v else '[PAID]'} {t}\")
print(f'\nTotal Talents: {TalentListing.objects.count()}')
"

# 2. Start all 3 servers at once
echo "Starting Django..." && python manage.py runserver &
sleep 2
echo "Starting React..." && npm run dev &
sleep 3
echo "Starting Ngrok..." && ngrok http 3000
