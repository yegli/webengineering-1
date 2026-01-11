import {Clock} from './clock.mjs'
const clock = new Clock();
clock.timer(1, () => console.log("piip"))