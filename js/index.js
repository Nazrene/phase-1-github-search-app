const githubForm = document.getElementById('github-form');
const searchInput = document.getElementById('search');
const userList = document.getElementById('user-list');
const reposList = document.getElementById('repos-list');

async function fetchUserData(username) {
  try {
    
    const response = await fetch(`https://api.github.com/search/users?q=${username}`);
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return [];
  }
}

async function fetchUserRepos(username) {
  try {
    
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user repos:', error);
    return [];
  }
}

function displayUser(user) {
  const userItem = document.createElement('li');
  userItem.innerHTML = `
    <img src="${user.avatar_url}" alt="${user.login}">
    <a href="${user.html_url}" target="_blank">${user.login}</a>
  `;
  userItem.addEventListener('click', async () => {
    const userRepos = await fetchUserRepos(user.login);
    displayUserRepos(userRepos);
  });
  userList.appendChild(userItem);
}

function displayUserRepos(repos) {
  reposList.innerHTML = ''; 
  if (repos.length === 0) {
    reposList.textContent = 'No repositories found.';
    return;
  }
  const reposFragment = document.createDocumentFragment();
  for (const repo of repos) {
    const repoItem = document.createElement('li');
    repoItem.innerHTML = `
      <a href="${repo.html_url}" target="_blank">${repo.name}</a>
    `;
    reposFragment.appendChild(repoItem);
  }
  reposList.appendChild(reposFragment);
}

githubForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    userList.innerHTML = ''; 
    const users = await fetchUserData(searchTerm);
    if (users.length > 0) {
      users.forEach(displayUser);
    } else {
      userList.textContent = 'No users found.';
    }
    searchInput.value = ''; 
  }
});
