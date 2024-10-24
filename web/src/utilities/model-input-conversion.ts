import { HealthSurveyStore } from '../hooks/health-survey-store';

/**
 * These are a collection of functions in order to quickly convert the store values into 
 * the tensors needed for each model in this project. The ordering of the values are important
 * and can be found inside the model's corresponding notebooks.
 */

/**
 * This function converts values from the user into an array whose values are compatible
 * with that of the trained model for heart disease prediction.
 */
export function convertToHeartDiseaseModelInput(values: HealthSurveyStore) {
    return [
        values.age,
        values.restingBloodPressure,
        values.cholesterol,
        values.maximumHeartRate,
        ...(values.sex === "male" ? [0, 1] : [1, 0]),
        ...(values.chestPainType === "typical angina" ? [1, 0, 0, 0] :
            values.chestPainType === "atypical angina" ? [0, 1, 0, 0] :
            values.chestPainType === "non-anginal" ? [0, 0, 1, 0] :
            [0, 0, 0, 1]),
        ...(values.bloodGlucoseLevel > 120 ? [0, 1] : [1 , 0]),
        ...(values.hasExercisedInducedAngena ? [0, 1] : [1, 0])
    ];
}

/**
 * This function converts values from the user into an array whose values are compatible
 * with that of the trained model for maternal health risk.
 */
export function convertToMaternalHealthRiskModelInput(values: HealthSurveyStore) {
    return [
        values.age,
        values.systolicBloodPressure,
        values.diastolicBloodPressure,
        values.bloodGlucoseLevel/18, // we need to convert mg/dL to mmol/L
        values.bodyTemperature,
        values.restingHeartRate
    ];
}

/**
 * This function converts values from the user into an array whose values are compatible
 * with that of the trained model for obesity likelihood.
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
        ...(values.usualTransportation === "car" ? [1, 0, 0, 0, 0] :
            values.usualTransportation === "bicycle" ? [0, 1, 0, 0, 0] :
            values.usualTransportation === "motorcycle" ? [0, 0, 1, 0, 0] :
            values.usualTransportation === "public" ? [0, 0, 0, 1, 0] :
            [0, 0, 0, 0, 1]
        )
    ];
}

/**
 * This function converts values from the user into an array whose values are compatible
 * with that of the trained model for diabetes likelihoo prediction.
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
        ...(values.hasCholesterolChecked ? [0, 1] : [1, 0]),
        ...(values.frequentSmoke ? [0, 1] : [1, 0]),
        ...(values.hasHadStroke ? [0, 1] : [1, 0]),
        ...(values.hasHeartDisease ? [0, 1] : [1, 0]),
        ...(values.frequentPhysicalActivity ? [0, 1] : [1, 0]),
        ...(values.frequentEatFruits ? [0, 1] : [1, 0]),
        ...(values.frequentEatVegetables ? [0, 1] : [1, 0]),
        ...(values.frequentDrinkAlcohol ? [0, 1] : [1, 0]),
        ...(values.hasHealthcare ? [0, 1] : [1, 0]),
        1, 0, // this is for the parameter that asks if you'd been denied healthcare
        ...(values.hasDifficultyClimbing ? [0, 1] : [1, 0]),
    ];
}