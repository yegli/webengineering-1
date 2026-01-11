export class Clock {
    timer(seconds, action){
        setTimeout(action, seconds * 1000);
        
        console.log(`timer goes off in: ${seconds} seconds`);    
    }
}
