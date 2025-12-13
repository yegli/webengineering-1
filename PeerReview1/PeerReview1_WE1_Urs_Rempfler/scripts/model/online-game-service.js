import { Utils } from '../utils/utils.js';

export class OnlineGameService {
    async getRankings() {
        // TODO Server API CALL
        await Utils.wait(2000);
        Promise.resolve([]);
    }

    // TODO
    async evaluate(playerName, playerHand) {
        console.log(playerName, playerHand);
        // TODO Server API CALL
        return -1;
    }
}
