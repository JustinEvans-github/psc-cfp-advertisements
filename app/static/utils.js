export function calculateMedian(arr) {
    // Check if arr is an array
    if (!Array.isArray(arr)) {
        throw new Error('calculateMedian expects an array as an argument');
    }

    // Step 1: Sort the array
    arr.sort(function(a, b) {
        return a - b;
    });

    // Step 2: Determine if the array has an odd or even number of elements
    var length = arr.length;
    var middle = Math.floor(length / 2);

    // Step 3 and 4: Calculate the median based on array length
    if (length % 2 === 0) {
        // Even number of elements
        return (arr[middle - 1] + arr[middle]) / 2;
    } else {
        // Odd number of elements
        return arr[middle];
    }
}

export function findKeyOfMaxValue(obj) {
    let maxKey = null;
    let maxValue = Number.NEGATIVE_INFINITY;

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];

            if (value > maxValue) {
                maxValue = value;
                maxKey = key;
            }
        }
    }

    return maxKey;
}