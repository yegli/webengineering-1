//Q1
function quiz1() {
  const p1 = Promise.resolve(42);
  //console.log(p1)
  p1.then(v => console.log(1, v));
}

// quiz1();

// Output?
// A: Promise { 42 }
// B: 42
// C: Error / Warning

// //Q2
function quiz2() {
  const p1 = Promise.reject(42);
  p1.then(v => console.log(2, v));
}

// quiz2();

// Output?
// A: Promise { 42 }
// B: 42
// C: Error / Warning

//Q3
async function quiz3() {
  const p1 = Promise.resolve(42);
  const v = await p1;
  console.log(3, v);
}

// quiz3();

// Output?
// A: Promise { 42 }
// B: 42
// C: Error / Warning

//Q4
async function quiz4() {
  try {
    const p1 = Promise.reject(42);
    const v = await p1;
    console.log(4, 'Value', v);
  } catch (e) {
    console.log(4, 'Error', e);
  }
}

// quiz4();

// Output?
// A: Error 42
// B: Value 42
// C: Error / Warning

async function quiz5() {
  try {
    const p1 = new Promise((resolve, reject) => setTimeout(() => resolve(42)));
    const v = await p1;
    console.log(5, 'Value', v);
  } catch (e) {
    console.log(5, 'Error', e);
  }
}

// quiz5();

// Output?
// A: Error 42
// B: Value 42
// C: Error / Warning

async function quiz6() {
  const p1 = new Promise((resolve, reject) => setTimeout(() => resolve(42), 1100));
  console.log(1, p1);
  setTimeout(() => console.log(2, p1), 1000);
  setTimeout(() => console.log(3, p1), 2000);
}

// quiz6();
// Output?@@@@@@@@@@@@@@@
// A: Error 42
// B: Value 42
// C: Error / Warning
