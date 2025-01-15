import { fetchWithAuth } from '../util/api.js';
import initCreateFeedModal from './create-feed-modal.js';
import initMoreMenu from './more-menu.js';
import initSideBar from './side-bar.js';
import { getCurrentUser } from '../util/auth.js';

// 이 페이지의 사용자 이름 추출
function getPageUsername() {
  // URL에서 가져와야 함
  const url = window.location.pathname;
  return url.substring(1);
}

// 현재 페이지에 들어온 사람이 본인인지 확인
async function isUserMatched() {
  const pageUsername = getPageUsername();
  const loggedInUser = await getCurrentUser();
  return pageUsername === loggedInUser.username;
}

// 프로필 헤더 렌더링하기
async function renderProfileHeader({ feedCount, name, username, profileImageUrl }) {
  // 프로필 이미지 업데이트
  document.querySelector('.profile-image-container .profile-image img').src =
    profileImageUrl ?? '/images/default-profile.svg';

  // 사용자명 업데이트
  document.querySelector('.profile-actions .username').textContent = username;

  // 실명 업데이트
  document.querySelector('.profile-bio .full-name').textContent = name;

  // 게시물 수 업데이트
  document.querySelector(
    '.profile-stats li:first-child .stats-number'
  ).textContent = feedCount;

  // 본인의 페이지인지 타인의 페이지인지에 따라 다른 버튼을 렌더링(동적 렌더링)
  const match = await isUserMatched();

  // 버튼 영역 렌더링
  const $actionButtonsContainer = document.querySelector('.action-buttons');
  $actionButtonsContainer.innerHTML = '';

  if (match) {
    // 본인 프로필인 경우
    $actionButtonsContainer.innerHTML = `
                <button class="profile-edit-button">프로필 편집</button>
                <button class="settings-button">
                    <i class="fa-solid fa-gear"></i>
                </button>
            `;
  } else {
    // 타인 프로필인 경우
    $actionButtonsContainer.innerHTML = `
                <button class="follow-button">팔로우</button>
                <button class="message-button">메시지 보내기</button>
            `;
  }
}

// 프로필 페이지 상단부 렌더링 (사용자이름, 프로필사진, 피드 개수, 팔로워 수 등)
async function initProfileHeader() {

  // 해당 페이지 사용자 이름 추출하기
  const username = getPageUsername();

  // 서버에서 프로필 헤더 정보 요청하기
  const response = await fetchWithAuth(`/api/profiles/${username}`);
  const profileHeader = await response.json();

  // 렌더링 진행
  renderProfileHeader(profileHeader);
}


document.addEventListener('DOMContentLoaded', () => {
  
  //===== 인덱스페이지와 공통 처리 ==== //
  initCreateFeedModal(); // 피드생성 관련 js
  initMoreMenu(); // 더보기 버튼 클릭 관련
  initSideBar(); // 사이드바 관련

  //===== 프로필 페이지 개별 처리 ===== //
  initProfileHeader(); // 프로필 페이지 헤더 관련
});