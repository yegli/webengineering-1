function clock(seconds, action){
    setTimeout(action, seconds * 1000);
    console.log(`timer goes off in: ${seconds} seconds`);
}

clock(3, () => console.log("Hallo World"));
