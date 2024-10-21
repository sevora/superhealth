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
BS	- Blood glucose levels is in terms of a molar concentration
BodyTemp - Body Temperature
HeartRate	-  resting heart rate
RiskLevel - Risk Level (1=high risk, 0=low risk)

`obesity_likelihood.csv`
Gender - 0 female 1 male
Age	
Height	
Weight	
family_history_with_overweight - categorical if the individual has a family member who is overweight or obese (yes or no).
FAV - categorical yes or no eats high-calorie food 
FCVC - categorical frequency of eating vegetables always sometimes never
NCP	- 
CAEC - categorical	
SMOKE - categorical
CH2O - consumption of water daily
SCC	- categorical
FAF	- 
TUE	- 
CALC - categorical
MTRANS	- categorical
NObeyesdad - categorical

`diabetes_likelihood.csv`
Diabetes_012	
HighBP	
HighChol	
CholCheck	
BMI	Smoker	
Stroke	
HeartDiseaseorAttack	
PhysActivity	
Fruits	
Veggies	
HvyAlcoholConsump
AnyHealthcare
NoDocbcCost	
GenHlth
MentHlth	
PhysHlth	
DiffWalk	
Sex	0 female, 1 male