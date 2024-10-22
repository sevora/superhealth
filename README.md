# Superhealth
This project uses venv to organize dependencies on Python3.

## Git Bash
source venv/Scripts/activate

## Datasets
`heart_disease.csv` 
age - age in years
sex - sex (1 = male; 0 = female)
cp - chest pain type
        -- Value 1: typical angina
        -- Value 2: atypical angina
        -- Value 3: non-anginal pain
        -- Value 4: asymptomatic
trestbps - resting blood pressure (in mm Hg on admission to the hospital)
chol - serum cholestoral in mg/dl
fbs - (fasting blood sugar > 120 mg/dl)  (1 = true; 0 = false)
thalach - maximum heart rate achieved
exang - exercise induced angina (1 = yes; 0 = no)
num - diagnosis of heart disease (angiographic disease status)
        -- Value 0: < 50% diameter narrowing
        -- Value 1: > 50% diameter narrowing
        (in any major vessel: attributes 59 through 68 are vessels)

`maternal_health_risk.csv`
Age	- age of user
SystolicBP	- Upper value of Blood Pressure in mmHg
DiastolicBP - Lower value of Blood Pressure in mmHg
BS	- Blood glucose levels is in terms of a molar concentration (mmol/L) (1 mmol/L = 18mg/dL) 
BodyTemp - Body Temperature
HeartRate	-  resting heart rate
RiskLevel - Risk Level (1=high risk, 0=low risk)

`obesity_likelihood.csv`
Gender - Male or Female 
Age - in years
family_history_with_overweight - categorical if the individual has a family member who is overweight or obese (yes or no)
FAVC - categorical yes or no eats high calorie food frequently
CAEC - categorical frequency Do you eat any food between meals?
SMOKE - categorical yes or no smokes  
SCC - categorical yes or no Do you monitor the calories you eat daily?
CALC - categorical frequency How often do you drink alcohol?
MTRANS - categorical transportation
NObeyesdad - Risk level categorical

`diabetes_likelihood.csv`
Diabetes_012
Sex = 0 female, 1 male
HighBP = 0 = no high BP 1 = high BP
HighChol = 0 = no high cholesterol 1 = high cholesterol	
CholCheck = 0 = no cholesterol check in 5 years 1 = yes cholesterol check in 5 years
BMI = bmi
Smoker = have ever smoked 100 cigarettes 0 = no 1 = yes
Stroke = (Ever told) you had a stroke. 0 = no 1 = yes
HeartDiseaseorAttack = coronary heart disease (CHD) or myocardial infarction (MI) 0 = no 1 = yes
PhysActivity = physical activity in past 30 days - not including job 0 = no 1 = yes
Fruits = Consume Fruit 1 or more times per day 0 = no 1 = yes
Veggies	= Consume Vegetables 1 or more times per day 0 = no 1 = yes
HvyAlcoholConsump = Heavy drinkers (adult men having more than 14 drinks per week and adult women having more than 7 drinks per week) 0 = no 1 = yes
AnyHealthcare = Have any kind of health care coverage, including health insurance, prepaid plans such as HMO, etc. 0 = no 1 = yes
NoDocbcCost = Was there a time in the past 12 months when you needed to see a doctor but could not because of cost? 0 = no 1 = yes
GenHlth = Would you say that in general your health is: scale 1-5 1 = excellent 2 = very good 3 = good 4 = fair 5 = poor
MentHlth = Now thinking about your mental health, which includes stress, depression, and problems with emotions, for how many days during the past 30 days was your mental health not good? scale 1-30 days
PhysHlth = Now thinking about your physical health, which includes physical illness and injury, for how many days during the past 30 days was your physical health not good? scale 1-30 days
DiffWalk = Do you have serious difficulty walking or climbing stairs? 0 = no 1 = yes