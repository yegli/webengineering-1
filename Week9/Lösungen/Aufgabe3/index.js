const projectList = document.querySelector('#project-list');
const commitList = document.querySelector('#commit-list');
const updateBtn = document.querySelector('#btn-update');
const tokenTxt = document.querySelector('#txt-token');

const API_BASE_URL = 'https://gitlab.ost.ch/api/v4';

const appState = {
    token: '',
    selectedProject: -1,
    projects: [],
    commits: [],
};

function buildCommitUrl(projectId, token) {
    return `${API_BASE_URL}/projects/${projectId}/repository/commits?access_token=${token}`;
}

function buildProjectUrl(token) {
    return `${API_BASE_URL}/projects?owned=true&simple=true&access_token=${token}`;
}


function projectHTMLString(project, index) {
    return `<li class="project" tabindex="0" data-index=${index}>${project.name}</li>`;
}

function renderProjectList(projects) {
    projectList.innerHTML = projects.map(projectHTMLString).join('');
}

function updateProjectView() {
    renderProjectList(appState.projects);
}


function commitHTMLString(commit, index) {
    return `<li class="commit" data-index=${index}>${commit.short_id}: ${commit.title} <span class="author">by ${commit.author_name}</span></li>`;
}

function renderCommitList(commits) {
    commitList.innerHTML = commits.map(commitHTMLString).join('');
}

function updateCommitView() {
    renderCommitList(appState.commits);
}

async function getCommitsForProject() {
    const projectId = appState.projects[appState.selectedProject].id;
    const response = await fetch(buildCommitUrl(projectId, appState.token));

    if (!response.ok) {
        alert(response.statusText);
        return;
    }

    appState.commits = await response.json();
    updateCommitView();
}

async function getProjects() {
    const response = await fetch(buildProjectUrl(appState.token));

    if (!response.ok) {
        alert(response.statusText);
        return;
    }
    appState.projects = await response.json();
    updateProjectView();
    updateCommitView();
}


updateBtn.addEventListener('click', async event => {
    event.preventDefault();
    appState.commits = [];
    appState.projects = [];
    appState.token = tokenTxt.value;
    await getProjects();
});

projectList.addEventListener('focusin', async e => {
    if (e.target.matches('li')) { // update view not possible
        appState.selectedProject = parseInt(e.target.dataset.index, 10);
        await getCommitsForProject();
    }
});
