
/**
 * From an array of numbers, we want to get the index
 * of the highest value.
 */
export function indexOfMax(array: number[]) {
    if (array.length === 0) {
        return -1;
    }

    let max = array[0];
    let maxIndex = 0;

    for (var index = 1; index < array.length; index++) {
        if (array[index] > max) {
            maxIndex = index;
            max = array[index];
        }
    }

    return maxIndex;
}