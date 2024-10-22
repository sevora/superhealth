import { HealthSurveyStore } from '../hooks/health-survey-store';

/**
 * When these inputs are fed into a model, the output array is in order of:
 * num_0 (absence) and num_1 (presence)
 */
export function convertToHeartDiseaseModelInput(values: HealthSurveyStore) {
    return [
        values.age,
        values.restingBloodPressure,
        values.cholesterol,
        values.maximumHeartRate,

        ...(values.sex === "male" ? [0, 1] : [1, 0]),

        ...(
            values.chestPainType === "typical angina" ? 
            [1, 0, 0, 0] :
            values.chestPainType === "atypical angina" ?
            [0, 1, 0, 0] :
            values.chestPainType === "non-anginal" ?
            [0, 0, 1, 0] :
            // implicit values.chestPainType === "asymptomatic"
            [0, 0, 0, 1]
        ),

        ...(values.bloodGlucoseLevel > 120 ? [0, 1] : [1 , 0]),

        ...(values.hasExercisedInducedAngena ? [0, 1] : [1, 0])
    ];
}

/**
 *  When fed to a model the output array is in order of:
 *  RiskLevel_high risk,  RiskLevel_low risk,  RiskLevel_mid risk
 */
export function convertToMaternalHealthRiskModelInput(values: HealthSurveyStore) {
    return [
        values.age,
        values.systolicBloodPressure,
        values.diastolicBloodPressure,
        values.bloodGlucoseLevel/18, // to convert mg/dL to mmol/L
        values.bodyTemperature,
        values.restingHeartRate
    ];
}

/**
 *  When fed into model will yield values in order
 * 'NObeyesdad_Insufficient_Weight', 'NObeyesdad_Normal_Weight',
 * 'NObeyesdad_Obesity_Type_I', 'NObeyesdad_Obesity_Type_II',
 * 'NObeyesdad_Obesity_Type_III', 'NObeyesdad_Overweight_Level_I',
 * 'NObeyesdad_Overweight_Level_II'
 */
export function convertToObesityLikelihoodModelInput(values: HealthSurveyStore) {
    return [
        values.age,
        ...(values.sex === "male" ? [0, 1] : [1, 0]),
        ...(values.hasFamilyHistoryOverweight ? [0, 1] : [1,0]),
        ...(values.frequentHighCalorieFood ? [0, 1] : [1,0]),
        ...(values.frequentEatBetweenMeals ? [0, 1, 0, 0] : [0, 0, 1, 0]),
        ...(values.frequentSmoke ? [0, 1] : [1, 0]),
        ...(values.hasMonitorCalories ? [0, 1] : [1, 0]),
        ...(values.frequentDrinkAlcohol ? [0, 1, 0, 0] : [0, 0, 1, 0]),
        ...(
            values.usualTransportation === "car" ? 
            [1, 0, 0, 0, 0] :
            values.usualTransportation === "bicycle" ?
            [0, 1, 0, 0, 0] :
            values.usualTransportation === "motorcycle" ?
            [0, 0, 1, 0, 0] :
            values.usualTransportation === "public" ?
            [0, 0, 0, 1, 0] :
            [0, 0, 0, 0, 1]
        )
    ];
}

/**
 * Output of the model
 * Diabetes_012_0  Diabetes_012_1  Diabetes_012_2
 * which is no diabetes, prediabetes, and diabetes
 */
export function convertToDiabetesLikelihoodModelInput(values: HealthSurveyStore) {

    return [
        values.weight / Math.max(0.1, Math.pow(values.height, 2)),

        values.generalHealthEvaluation,

        values.mentalHealthMonthDecline,

        values.physicalHealthMonthDecline,

        ...(values.sex === "male" ? [0, 1] : [1, 0]),
        
        ...((values.systolicBloodPressure >= 130 || values.diastolicBloodPressure >= 80) ? [0, 1] : [1, 0]),

        ...(values.cholesterol >= 100 ? [0, 1] : [1, 0]),

        0, 1, // cholcheck, has had cholesterol checked default to yes

        ...(values.frequentSmoke ? [0, 1] : [1, 0]),

        ...(values.hasHadStroke ? [0, 1] : [1, 0]),

        ...(values.hasHeartDisease ? [0, 1] : [1, 0]),

        ...(values.frequentPhysicalActivity ? [0, 1] : [1, 0]),

        ...(values.frequentEatFruits ? [0, 1] : [1, 0]),

        ...(values.frequentEatVegetables ? [0, 1] : [1, 0]),
        
        ...(values.frequentDrinkAlcohol ? [0, 1] : [1, 0]),

        ...(values.hasHealthcare ? [0, 1] : [1, 0]),

        1, 0, //NoDocbcCost

        ...(values.hasDifficultyClimbing ? [0, 1] : [1, 0]),
    ];
}