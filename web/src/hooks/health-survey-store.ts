import { create } from 'zustand';

export interface HealthSurveyStore {
    /**
     * The age (in Earth years) of the user.
     */
    age: number,

    /**
     * The height (in meters) of the user.
     */
    height: number,

    /**
     * The weight (in kilograms) in Earth.
     */
    weight: number,

    /**
     * The biological sex whether male or female.
     */
    sex: "male" | "female",
    
    /**
     * The blood pressure (in mmHg) when heart pumps blood.
     * High blood pressure if greater than or equal to 130.
     */
    systolicBloodPressure: number,
    
    /**
     * The blood pressure (in mmHg) when heart rests between beats.
     * High blood pressure if greater than or equal to 80
     */
    diastolicBloodPressure: number,

    /**
     * Resting blood pressure (in mmHg) thought to be the same
     * as diastolic but we separate it just in case.
     */
    restingBloodPressure: number,

    /**
     * This is the resting heart rate (in bpm).
     */
    restingHeartRate: number,

    /**
     * This refers to maximum heart rate (in bpm) achieved throughout lifetime.
     */
    maximumHeartRate: number,

    /**
     * This is the LDL, units in mg/dL
     * more than 100 mg/dL is high cholesterol
     */
    cholesterol: number,

    /**
     * Whether they have had their cholesterol 
     * checked in the past 5 years
     */
    hasCholesterolChecked: boolean,

    /**
     * Tells whether there is exercised induced angina.
     */
    hasExercisedInducedAngena: boolean,
    
    /**
     * Details what kind of chest pain that 
     * is experienced.
     */
    chestPainType: "typical angina" | "atypical angina" | "non-anginal" | "asymptomatic",

    /**
     * Blood glucose level (in mg/dL), unit equivalence (1mg/dL = 1/18 mmol/L) 
     * fastingBloodSugar is true if (>120mg/dL)
     */
    bloodGlucoseLevel: number,
    
    /**
     * Recent body temperature (in fahrenheit degrees) taken.
     */
    bodyTemperature: number,  

    /**
     * Whether there is a history of being overweight
     * running in the family.
     */
    hasFamilyHistoryOverweight: boolean,

    /**
     * In the models, this is abbreviated as FAVC.
     * Whether frequents eating high calorie food.
     */
    frequentHighCalorieFood: boolean,

    /**
     * In the models, this is abbreviated as SCC.
     * Whether one monitors their calories.
     */
    hasMonitorCalories: boolean,

    /**
     * In the models, this is abbreviated as CAEC.
     * Whether frequently eating between meals.
     * True means always, false means sometimes.
     */
    frequentEatBetweenMeals: boolean,

    /**
     * In the models, this is abbreviated as SMOKE.
     * Whether frequently smokes or not.
     */
    frequentSmoke: boolean,

    /**
     * In the models, this is abbreviated as CALC.
     * Whether frequently drinking alcohol.
     * True means always, false means sometimes.
     */
    frequentDrinkAlcohol: boolean,

    /**
     * This is the usual transportation taken
     * from a set of given choices.
     */
    usualTransportation: "public" | "walking" | "car" | "motorcycle" | "bicycle",

    /**
     * Whether there has been an experience 
     * of stroke or not.
     */
    hasHadStroke: boolean,

    /**
     * Whether there is a heart 
     * disease or not.
     */
    hasHeartDisease: boolean,

    /**
     * Whether one frequently (daily/almost daily) 
     * does physical activity.
     */
    frequentPhysicalActivity: boolean,

    /**
     * Whether one eats fruits frequently
     * (daily to almost daily) eating.
     */
    frequentEatFruits: boolean,

    
    /**
     * Whether one eats fruits frequently
     * (daily to almost daily) eating.
     */
    frequentEatVegetables: boolean,

    /**
     * Have any kind of health care coverage, including health insurance, prepaid plans such as HMO, etc.
     * Consider NoDocbcCost as always no
     */
    hasHealthcare: boolean,

    /**
     * From 1-5 general scale of health.
     */
    generalHealthEvaluation: number,

    /**
     * Out of 30 how many days in a month have
     * your mental health not been good.
     */
    mentalHealthMonthDecline: number,

    /**
     * Out of 30 how many days in a month have
     * your physical health not been good.
     */
    physicalHealthMonthDecline: number,

    /**
     * Has difficulty walking or climbing stairs.
     */
    hasDifficultyClimbing: boolean,

    /**
     * Use this to update the store.
     */
    update: (values: Partial<HealthSurveyStore>) => void;
}

/**
 * As you can see the store is initialized with 
 * default values.
 */
const useHealthSurveyStore = create<HealthSurveyStore>()(set => ({
    age: 18,
    weight: 58,
    height: 1.69,
    sex: "male",
    systolicBloodPressure: 100,
    diastolicBloodPressure: 70,
    restingBloodPressure: 80,
    restingHeartRate: 80,
    maximumHeartRate: 120,
    cholesterol: 70,
    hasCholesterolChecked: true,
    hasExercisedInducedAngena: false,
    chestPainType: "asymptomatic",
    bloodGlucoseLevel: 100,
    bodyTemperature: 97,
    hasFamilyHistoryOverweight: false,
    frequentHighCalorieFood: false,
    hasMonitorCalories: false,
    frequentEatBetweenMeals: false,
    frequentSmoke: false,
    frequentDrinkAlcohol: false,
    usualTransportation: "walking",
    hasHadStroke: false,
    hasHeartDisease: false,
    frequentPhysicalActivity: false,
    frequentEatFruits: false,
    frequentEatVegetables: false,
    hasHealthcare: false,
    generalHealthEvaluation: 3,
    mentalHealthMonthDecline: 0,
    physicalHealthMonthDecline: 0,
    hasDifficultyClimbing: false,
    update(values) { set(values) },
}));

export default useHealthSurveyStore;