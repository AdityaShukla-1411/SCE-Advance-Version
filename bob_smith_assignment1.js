// Student: Bob Smith - Assignment 1 (Similar to Alice's)
function sortArray(array) {
  let length = array.length;
  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        let temporary = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temporary;
      }
    }
  }
  return array;
}

function execute() {
  const nums = [64, 34, 25, 12, 22, 11, 90];
  console.log("Before sorting:", nums);
  const result = sortArray(nums);
  console.log("After sorting:", result);
}

execute();
