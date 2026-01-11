import {
    generateLeaderboard,
    evaluateRound,
    updateHistory,
    updatePlayerScore,
    printSystemHand,
} from '../utils/utils.js';

export class OfflineGameService {
    static DELAY_MS = 1000;

    #playerState = {
        Markus: { user: 'Markus', win: 3, lost: 6 },
        Michael: { user: 'Michael', win: 4, lost: 5 },
        Lisa: { user: 'Lisa', win: 4, lost: 5 },
    };

    #resultLookup = {
        scissors: { scissors: 0, rock: 1, paper: -1, spock: 1, lizard: -1 },
        rock: { scissors: -1, rock: 0, paper: 1, spock: 1, lizard: -1 },
        paper: { scissors: 1, rock: -1, paper: 0, spock: -1, lizard: 1 },
        lizard: { scissors: 1, rock: 1, paper: -1, spock: -1, lizard: 0 },
        spock: { scissors: -1, rock: -1, paper: 1, spock: 0, lizard: 1 },
    };

    async getRankings() {
        return generateLeaderboard(Object.values(this.#playerState));
    }

    async evaluate(playerName, playerHand) {
        const randomIndex = Math.floor(Math.random() * Object.keys(this.#resultLookup).length);
        const systemHand = Object.keys(this.#resultLookup)[randomIndex];
        const result = evaluateRound(playerHand, systemHand, this.#resultLookup);

        printSystemHand(systemHand);
        updateHistory(result, playerHand, systemHand);
        updatePlayerScore(this.#playerState, playerName, result);

        return result;
    }
}
