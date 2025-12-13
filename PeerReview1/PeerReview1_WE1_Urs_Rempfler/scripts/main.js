import { gameService } from './model/game-service.js';

const rankingPage = document.querySelector('#rankingpage-section');
const switchOnlineOffline = document.querySelector('#switch-online-offline');
const loadingSpinner = document.querySelector('#loading-spinner');
const rankingContainer = document.querySelector('#ranking-container');
const rankingList = document.querySelector('#ranking-list');
const loginForm = document.querySelector('#login-form')
const loginFormUsername = document.querySelector('#username');

const gamePage = document.querySelector('#gamepage-section');
const expectedUserActionMessage = document.querySelector('#expected-user-action-message');
const playButtonsContainer = document.querySelector('#playbuttons-container');
const playButtons = document.querySelectorAll('.play-button');
const counterMessage = document.querySelector('#counter-message');
const enemyResult = document.querySelector('#enemy-result');
const historyTable = document.querySelector('#history-table');
const returnToRankingPageButton = document.querySelector('#return-ranking-page');

let loggedInUser;


/* START RANKING PAGE */
async function loadRankingList() {
    const rankings = await gameService.getRankings();
    if (rankings == null || rankings.length <= 0) {
        rankingList.innerHTML = ``;
    } else {
        let top10;
        if (rankings.length > 10) {
            top10 = rankings.slice(0, 10);
        } else {
            top10 = rankings;
        }
        const listContent = top10.map((e) =>
            `<li>
                <p class="rankinglist-rank">${e.rank}. Rang mit ${e.wins} Siegen</p>
                <p class="rankinglist-players">${e.players.join(", ")}</p>
            </li>`
        ).join("");
        rankingList.innerHTML = listContent; 
    }
}

function showLoadingSpinner() {
    loadingSpinner.classList.remove("invisible");
    rankingContainer.classList.add("invisible");
    loadingSpinner.classList.add("visible");
    rankingContainer.classList.remove("visible");
}

function showRankingList() {
    loadingSpinner.classList.add("invisible");
    rankingContainer.classList.remove("invisible");
    loadingSpinner.classList.remove("visible");
    rankingContainer.classList.add("visible");
}

async function renderRankingList() {
    showLoadingSpinner();
    await loadRankingList();
    showRankingList();   
}

async function showRankingPage() {
    rankingPage.classList.remove("invisible");
    gamePage.classList.add("invisible");
    rankingPage.classList.add("visible");
    gamePage.classList.remove("visible");
    await renderRankingList();
}

function renderGamePage() {
    expectedUserActionMessage.innerHTML = `${loggedInUser}, wähle deine Hand!`;
    counterMessage.innerHTML = `VS`;
    historyTable.innerHTML = `<tr id="history-table-header"><th>Resultat</th><th>Spieler</th><th>Gegner</th></tr>`;
}

function showGamepage() {
    renderGamePage();
    rankingPage.classList.add("invisible");
    gamePage.classList.remove("invisible");
    rankingPage.classList.remove("visible");
    gamePage.classList.add("visible");
}

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = loginFormUsername.value;
    if (username === '' || gameService.isOnline) {
        return;
    }

    loggedInUser = username;
    showGamepage();
});
/* END RANKING PAGE */

/* START PLAY PAGE */
const playElementTranslations = {
    scissors: 'Schere',
    rock: 'Stein',
    paper: 'Papier',
    well: 'Brunnen',
    match: 'Streichholz',
    Schere: 'scissors',
    Stein: 'rock',
    Papier: 'paper',
    Brunnen: 'well',
    Streichholz: 'match',
}

function enablePlayButtons() {
    for (let i = 0; i < playButtons.length; i++) {
        playButtons[i].disabled = false;
    }
    returnToRankingPageButton.disabled = false;
}

function disablePlayButtons() {
    for (let i = 0; i < playButtons.length; i++) {
        playButtons[i].disabled = true;
    }
    returnToRankingPageButton.disabled = true;
}

function showEnemyResult(evalResult) {
    enemyResult.innerHTML = playElementTranslations[evalResult.enemyHand];
}

function updateResultHistory(evalResult) {
    const historyTableHeader = document.querySelector('#history-table-header');
    let resultSymbol;
    switch (evalResult.gameResult) {
        case 1:
            resultSymbol = '&#x2714';
            break;
        case 0:
            resultSymbol = '&#x2796';
            break;
        case -1:
            resultSymbol = '&#x2716';
            break;
        default:
            break;
    }
    historyTableHeader.insertAdjacentHTML('afterend', `<tr><td>${resultSymbol}</td><td>${playElementTranslations[evalResult.playerHand]}</td><td>${playElementTranslations[evalResult.enemyHand]}</td></tr>`);
}

async function countDown(waitSeconds) {
    /* eslint-disable no-await-in-loop */
    for (let remainingSeconds = waitSeconds; remainingSeconds > 0 ; remainingSeconds--) {
        counterMessage.innerHTML = `Nächste Runde in ${remainingSeconds}`;
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 1000)});
    }
    /* eslint-enable no-await-in-loop */
}

function togglePlayButtonStyle(eventTarget, evalResult) {
    switch (evalResult) {
        case 1:
            eventTarget.classList.toggle("playbutton-win");
            break;
        case 0:
            eventTarget.classList.toggle("playbutton-equal");
            break;
        case -1:
            eventTarget.classList.toggle("playbutton-lost");
            break;
        default:
            break;
    }
}

function resetPlayField() {
    enablePlayButtons();
    counterMessage.innerHTML = `VS`;
    enemyResult.innerHTML = "?";
}

async function processPlayButtonClick(eventTarget) {
    if (!eventTarget.classList.contains("play-button")) {
        return;
    }
    disablePlayButtons();
    const evalResult = await gameService.evaluate(loggedInUser, eventTarget.value);
    showEnemyResult(evalResult);
    updateResultHistory(evalResult);
    togglePlayButtonStyle(eventTarget, evalResult.gameResult);
    await countDown(2);
    togglePlayButtonStyle(eventTarget, evalResult.gameResult);
    resetPlayField();
}

function enableOnlineGameMode() {
    gameService.isOnline = true;
    switchOnlineOffline.innerHTML = `Wechsle zu lokal`;
}

function enableOfflineGameMode() {
    gameService.isOnline = false;
    switchOnlineOffline.innerHTML = `Wechsle zu Server`;
}

async function switchGameMode() {
    if (gameService.isOnline) {
        enableOfflineGameMode();
    } else {
        enableOnlineGameMode();
    }
    switchOnlineOffline.disabled = true;
    await renderRankingList();
    switchOnlineOffline.disabled = false;
}

playButtonsContainer.addEventListener('click', async (event) => {
    event.preventDefault();
    await processPlayButtonClick(event.target);
});

returnToRankingPageButton.addEventListener('click', (event) => {
    event.preventDefault();
    showRankingPage();
});

switchOnlineOffline.addEventListener('click', (event) => {
    event.preventDefault();
    switchGameMode();
});
/* END PLAY PAGE */

function onStartup() {
    enableOfflineGameMode();
    showRankingPage();
}

onStartup();