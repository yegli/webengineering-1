function counter(start){
    return function(){
       return start++;
    }
}

const c1 = counter(2);
console.log(c1());
console.log(c1());
console.log(c1());

const c2 = counter(-10);
console.log(c2());
console.log(c2());
console.log(c2());
