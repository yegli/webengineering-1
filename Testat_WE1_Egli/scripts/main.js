import { gameService } from './model/game-service.js';

const startButton = document.getElementById('start-button');
const nameInput = document.getElementById('name-input');
const leaderBoardPage = document.getElementById('leader-board-page');
const gamePage = document.getElementById('game-page');
const gamePageGreeting = document.getElementById('game-page-greeting');
const leaderboardList = document.getElementById('leader-board-list');
const returnButton = document.getElementById('return-button');
const modeButton = document.getElementById('mode-button');

async function startCountdown() {
    const countdownOutput = document.getElementById('countdown-text');
    const moveButtons = document.querySelectorAll('.moves');

    moveButtons.forEach(button => {
        button.disabled = true;
    });

    for (let i = 1; i >= 0; i--) {
        countdownOutput.textContent = i;
        // always makes a fuss about await in loop haven't found a smart solution to this
        await new Promise(resolve => setTimeout(resolve, 1000)); // eslint-disable-line
    }

    moveButtons.forEach(button => {
        button.disabled = false;
    });


    const computerOutputText = document.getElementById('computer-output-text');
    computerOutputText.innerText = '';

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
    if (result === -1) {
        resultText = '✓';
    } else if (result === 0) {
        resultText = '=';
    } else {
        resultText = '✖';
    }

    resultCell.innerText = resultText;
    playerCell.innerText = playerHand;
    systemCell.innerText = systemHand;
}

export function renderLeaderboard(rankings) {
    leaderboardList.innerHTML = ''; // Clear the leaderboard

    rankings.sort((a, b) => b.win - a.win); // Sort by wins

    let rank = 1;
    let displayedCount = 0;

    for (let i = 0; i < rankings.length; i++) {
        if (displayedCount >= 10) break; // Limit to top 10

        const currentWins = rankings[i].win;
        const playersWithSameWins = [];

        while (i < rankings.length && rankings[i].win === currentWins) {
            playersWithSameWins.push(rankings[i].user);
            i++;
        }
        i--;

        const listItem = document.createElement("li");
        const h4 = document.createElement("h4");
        h4.textContent = `${rank} Rang mit ${currentWins} Siegen`;
        listItem.appendChild(h4);

        const p = document.createElement("p");
        p.textContent = playersWithSameWins.join(", ");
        listItem.appendChild(p);

        leaderboardList.appendChild(listItem);

        rank++;
        displayedCount += playersWithSameWins.length;
    }
}


async function updateLeaderboard() {
    try {
        const rawRankings = await gameService.getRankings();
        const rankings = Object.values(rawRankings).sort((a, b) => b.win - a.win);

        renderLeaderboard(rankings);
    } catch (error) {

        leaderboardList.innerHTML = '<li>Error loading leaderboard</li>';
    }
}

document.querySelectorAll('.moves').forEach(button => {
    button.addEventListener('click', async () => {
        const playerHand = button.getAttribute('data-hand');
        const playerName = document.getElementById('name-input').value;

        await gameService.evaluate(playerName, playerHand);

        await startCountdown();
        await updateLeaderboard();
    });
});
await updateLeaderboard();


// ---------- EventListeners ---------- //

nameInput.addEventListener('input', () => {
    if (nameInput.value.trim().length > 0) {
        startButton.removeAttribute('disabled');
    } else {
        startButton.setAttribute('disabled', 'true');
    }
});

startButton.addEventListener('click', async () => {
    const username = nameInput.value.trim();

    const rankings = await gameService.getRankings();
    const updatedRankings = generateLeaderboard(rankings);
    renderLeaderboard(updatedRankings, leaderboardList);

    leaderBoardPage.style.display = 'none';
    gamePage.style.display = 'block';
    gamePageGreeting.innerText = `${username}! Wähle deine Hand!`;
});

returnButton.addEventListener('click', () => {
    gamePage.style.display = 'none';
    leaderBoardPage.style.display = 'block';
    updateLeaderboard();
});

modeButton.addEventListener('click', () => {
    gameService.isOnline = !gameService.isOnline;
    modeButton.textContent = gameService.isOnline ? 'Switch to Offline Mode' : 'Switch to Online Mode';
    updateLeaderboard();
});

document.addEventListener('DOMContentLoaded', () => {
    modeButton.textContent = gameService.isOnline ? 'Switch to Offline Mode' : 'Switch to Online Mode';
});


