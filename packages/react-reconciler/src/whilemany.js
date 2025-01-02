
// return 语句本身的功能特性决定的，它用于结束函数的执行并返回相应的值,
// continue 是对循环体的控制，return是对函数的控制，当函数遇到return立即结束，不管还有多少次while未执行
function nestedWhileExample() {
    let outerCount = 0;
    // 外层outerCount只执行一次，outerCount = 0，
    while (outerCount < 3) {
        // 内部执行第三次，innerCount = 2的时候，遇到return，则整个函数停止执行
        let innerCount = 0;
        while (innerCount < 5) {
            if (innerCount === 2) {
                return innerCount; // 当 innerCount 等于 2 时，整个函数会立即终止并返回该值
            }
            innerCount++;
        }

        outerCount++;
    }
    return -1; // 这行代码永远不会执行，因为内层 while 循环中的 return 会提前终止函数
}

const result = nestedWhileExample();
console.log(result); 