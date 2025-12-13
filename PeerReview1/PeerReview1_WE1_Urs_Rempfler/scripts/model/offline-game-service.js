export class OfflineGameService {
    static DELAY_MS = 1000;

    constructor() {
        this.possibleHands = Object.keys(this.#resultLookup);
    }

    // same data structure as server
    #playerState = {
        Markus: {
            user: 'Markus',
            win: 3,
            lost: 6,
        },
        Michael: {
            user: 'Michael',
            win: 4,
            lost: 5,
        },
        Lisa: {
            user: 'Lisa',
            win: 4,
            lost: 5,
        },
    };

    // Can be used to check if the selected hand wins/loses
    // TODO : complete structure, DONE
    #resultLookup = {
        scissors: {
            scissors: 0,
            rock: -1,
            paper: 1,
            well: -1,
            match: 1,
        },
        rock: {
            scissors: 1,
            rock: 0,
            paper: -1,
            well: -1,
            match: 1,
        },
        paper: {
            scissors: -1,
            rock: 1,
            paper: 0,
            well: 1,
            match: -1,
        },
        well: {
            scissors: 1,
            rock: 1,
            paper: -1,
            well: 0,
            match: -1,
        },
        match: {
            scissors: -1,
            rock: -1,
            paper: 1,
            well: 1,
            match: 0,
        }
    };

    async getRankings() {
        const sortedPlayers = Object.values(this.#playerState).sort((a, b) => b.win - a.win);

        const rankingList = [];
        let currentRank = 1;
        let currentWins = null;
        let currentPlayers = [];
        
        sortedPlayers.forEach(player => {
            if (currentWins === null || player.win !== currentWins) {
                if (currentPlayers.length > 0) {
                    rankingList.push({ rank: currentRank, wins: currentWins, players: currentPlayers });
                    currentRank++;
                }
                currentWins = player.win;
                currentPlayers = [player.user];
            } else {
                currentPlayers.push(player.user);
            }
        });

        if (currentPlayers.length > 0) {
            rankingList.push({ rank: currentRank, wins: currentWins, players: currentPlayers });
        }

        return rankingList;
    }

    updateRanking(playerName, gameEval) {
        const player = this.#playerState[playerName];
        if (player == null) {
            const newPlayer = {
                user: playerName,
                win: 0,
                lost: 0,
            }
            if (gameEval === 1) {
                newPlayer.win++;
            }
            if (gameEval === -1) {
                newPlayer.lost++;
            }
            this.#playerState[playerName] = newPlayer;
        } else {
            if (gameEval === 1) {
                player.win++;
            }
            if (gameEval === -1) {
                player.lost++;
            }
        }
    }

    // TODO
    async evaluate(playerName, playerHand) {
        const random = Math.floor(Math.random() * 5);
        const enemyHand = this.possibleHands[random];
        const gameResult = (this.#resultLookup[playerHand])[enemyHand];
        this.updateRanking(playerName, gameResult);

        return { gameResult, playerHand, enemyHand };
    }
}