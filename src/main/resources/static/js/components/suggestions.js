
import { fetchWithAuth } from "../util/api.js";
import { getCurrentUser } from "../util/auth.js";
import { toggleFollow } from "../util/api.js";

const $suggestions = document.querySelector('.suggestions-list');

// 인덱스 페이지 우측 상단 로그인 유저 프로필 렌더링
async function renderMe() {
  // 서버에서 로그인한 사용자 정보 요청하기
  const currentUser = await getCurrentUser();

  // console.log('logged in user: ', userInfo);
  if (currentUser) {
    const $user = document.querySelector('.current-user');
    // 프로필 이미지 업데이트
    const $profileImg = $user.querySelector('.user-profile .profile-image img');
    if ($profileImg) {
      $profileImg.src = currentUser.profileImageUrl ?? '/images/default-profile.svg';
      $profileImg.alt = `${currentUser.username}의 프로필 이미지`;
      // 프로필 페이지 링크
      $profileImg.closest('.profile-image').setAttribute('href', `/${currentUser.username}`)
    }

    // 사용자명과 실제 이름 업데이트
    const $username = $user.querySelector('.username');
    const $name = $user.querySelector('.name');

    $username.textContent = currentUser.username;
    $username.setAttribute('href', `/${currentUser.username}`)

    $name.textContent = currentUser.name;

  }
}



function createSuggestionHTML(member) {
  return `
    <div class="suggestion-item" data-username="${member.username}">
      <div class="user-profile">
        <a href="/${member.username}" class="profile-image">
          <img src="${member.profileImageUrl ?? '/images/default-profile.svg'}" 
               alt="프로필 이미지">
        </a>
        <div class="profile-info">
          <a href="/${member.username}" class="username">${member.username}</a>
          <span class="follow-info">${member.suggestionReason}</span>
        </div>
        <button class="follow-button">팔로우</button>
      </div>
    </div>
  `;
}

// 서버에 추천 사용자목록 요청하기
async function refreshSuggestions() {

  const response = await fetchWithAuth(`/api/suggestions`);
  const data = await response.json();

  // console.log(data);
  $suggestions.innerHTML = data.map(user => createSuggestionHTML(user)).join('');
}

async function initSuggestUser() {
  // 초기 추천 목록 로드
  await refreshSuggestions();

  // 추천 목록 팔로우 버튼 이벤트 위임
  $suggestions.addEventListener('click', async (e) => {
    console.log('toggle follow!');
    
    const $followButton = e.target.closest('.follow-button');

    const $item = $followButton.closest('.suggestion-item');

    const username = $item.dataset.username;
    const { following } = await toggleFollow(username);

    if (following) {
      // 전체 추천 목록 새로고침
      await refreshSuggestions();
    }
  });
}


async function initSuggestions() {
  await renderMe();
  await initSuggestUser(); // 추천사용자 목록 부분
}

export default initSuggestions;