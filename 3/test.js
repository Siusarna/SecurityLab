const arr = [5, 3, 8, 1, 6, 4, 10];

const filterRangeInPlace = (arr, a ,b) => {
    const copyOfArray = [...arr];
    let countOfRemovedItems = 0;
    copyOfArray.forEach((el, index) => {
        if (el >= a && el <= b) {
            arr.splice(index - countOfRemovedItems, 1);
            countOfRemovedItems++;
        }
    })
}

filterRangeInPlace(arr, 1, 5);
console.log(arr)