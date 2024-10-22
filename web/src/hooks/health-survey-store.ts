import { create } from 'zustand';

export interface HealthSurveyStore {
    /**
     * in years
     */
    age: number,

    /**
     * In meters
     */
    height: number,

    /**
     * in kilograms
     */
    weight: number,

    sex: "male" | "female",
    
    /**
     * (in mmHg)
     * 
     * High blood pressure if greater than or equal to 130.
     */
    systolicBloodPressure: number,
    
    /**
     * or restingBloodPressure (in mmHg)
     * 
     * High blood pressure if greater than or equal to 80
     */
    diastolicBloodPressure: number,

    /**
     * (in mmHg)
     */
    restingBloodPressure: number,

    /**
     * in bpm
     */
    restingHeartRate: number,

    /**
     * in bpm, this refers to maximum achieved
     */
    maximumHeartRate: number,

    /**
     * This is the LDL, units in mg/dL
     * more than 100 mg/dL is high cholesterol
     */
    cholesterol: number,

    hasExercisedInducedAngena: boolean,
    
    chestPainType: "typical angina" | "atypical angina" | "non-anginal" | "asymptomatic",

    /**
     * This is in mg/dL, unit equivalence (1mg/dL = 1/18 mmol/L) 
     * fastingBloodSugar is true if (>120mg/dL)
     */
    bloodGlucoseLevel: number,
    
    /**
     * in fahrenheit degrees
     */
    bodyTemperature: number,  

    hasFamilyHistoryOverweight: boolean,

    /**
     * This is abbreviated as FAVC
     */
    frequentHighCalorieFood: boolean,

    /**
     * This is abbreviated as SCC
     */
    hasMonitorCalories: boolean,

    /**
     * This is abbreviated as CAEC,
     * True means always, false means sometimes
     */
    frequentEatBetweenMeals: boolean,

    frequentSmoke: boolean,

    /**
     * Abbreviated as CALC,
     * If true consider as "always", if false consider as "sometimes"
     */
    frequentDrinkAlcohol: boolean,

    usualTransportation: "public" | "walking" | "car" | "motorcycle" | "bicycle",

    hasHadStroke: boolean,

    hasHeartDisease: boolean,

    frequentPhysicalActivity: boolean,

    frequentEatFruits: boolean,

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

    update: (values: Partial<HealthSurveyStore>) => void;
}

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

    update(values) {
        set(values);
    },
}));

export default useHealthSurveyStore;