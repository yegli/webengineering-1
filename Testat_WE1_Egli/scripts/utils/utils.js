export function evaluateRound(playerHand, systemHand, resultLookup) {
    return resultLookup[playerHand][systemHand];
}

export function generateLeaderboard(players) {
    players.sort((a, b) => b.win - a.win);

    const flatRankings = [];
    for (let i = 0; i < players.length; ) {
        const currentWins = players[i].win;

        const group = players.slice(i).filter(player => player.win === currentWins);

        for (const player of group) {
            flatRankings.push({ user: player.user, win: player.win });
        }

        i += group.length;
    }
    return flatRankings;
}

export function updateHistory(result, playerHand, systemHand) {
    const table = document.getElementById('results-table');
    const row = table.insertRow(1);
    const resultCell = row.insertCell(0);
    const playerCell = row.insertCell(1);
    const systemCell = row.insertCell(2);

    let resultText;
    if (result === -1) resultText = '✓';
    else if (result === 0) resultText = '=';
    else resultText = '✖';

    resultCell.innerText = resultText;
    playerCell.innerText = playerHand;
    systemCell.innerText = systemHand;
}

export function updatePlayerScore(playerState, playerName, result) {
    if (!playerState[playerName]) {
        playerState[playerName] = { user: playerName, win: 0, lost: 0 };
    }
    if (result === -1) playerState[playerName].win++;
    else if (result === 1) playerState[playerName].lost++;
}

export function printSystemHand(systemHand) {
    const computerOutputText = document.getElementById('computer-output-text');
    computerOutputText.innerText = systemHand;
}
