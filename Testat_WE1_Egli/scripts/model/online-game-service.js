import { printSystemHand, updateHistory } from '../utils/utils.js';

export class OnlineGameService {
    #playerState = {};

    async getRankings() {
        const response = await fetch('https://stone.sifs0005.infs.ch/statistics');
        const data = await response.json();

        this.#playerState = Object.values(data).map(player => ({
            user: player.user,
            win: player.win,
            lost: player.lost,
        }));

        return this.#playerState;
    }

    async evaluate(playerName, playerHand) {
        const capitalizedHand = playerHand.charAt(0).toUpperCase() + playerHand.slice(1).toLowerCase();

        const response = await fetch(`https://stone.sifs0005.infs.ch/play?playerName=${playerName}&playerHand=${capitalizedHand}&mode=spock`);
        const result = await response.json();

        const systemHand = result.choice;
        const playerWin = result.win;

        const roundResult = playerWin ? -1 : 1;

        printSystemHand(systemHand);
        updateHistory(roundResult, capitalizedHand, systemHand);

        return roundResult;
    }
}
