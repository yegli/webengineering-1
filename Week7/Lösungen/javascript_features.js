function combine(...args){
    return args.reduce((a,b) => a = [...a,...b],[]);
    // return args.flat() // einfacher! :-)
}

console.log(combine([1,2,3], [4,5,6], [7,6,9])) // -> [1, 2, 3, 4, 5, 6, 7, 6, 9]

function merge(current, update){
    return {...current, ...update}
}

console.log(merge({fn: "A", ln: "B", code: 1234}, {code: 999})) // -> {fn: 'A', ln: 'B', code: 999}
