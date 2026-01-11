function counter(start){
    return (
    {
        incr : () =>  ++start,
        decr : () =>  --start,
        value : () => start
    });
}

const c1 = counter(2);
console.log("3:", c1.incr());
console.log("4:", c1.incr());
console.log("5:", c1.incr());
console.log("5:", c1.value());
console.log("4:", c1.decr());


const c2 = counter(-10);
console.log("-9:", c2.incr());
console.log("-8:", c2.incr());
console.log("-7:", c2.incr());
console.log("-7:", c2.value());
console.log("-8:", c2.decr());
