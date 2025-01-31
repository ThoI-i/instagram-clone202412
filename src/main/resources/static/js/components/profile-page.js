import { fetchWithAuth } from '../util/api.js';

import { getCurrentUser } from '../util/auth.js';
import initFollow from './follow.js';
import initFollowModal from './follow-modal.js';
import initCommon from './common.js';


const $profileImageContainer = document.querySelector(
  '.profile-image-container'
);

// 이 페이지의 사용자 이름 추출
export function getPageUsername() {
  // URL에서 가져와야 함
  const url = window.location.pathname;
  return url.substring(1);
}

// 현재 페이지에 들어온 사람이 본인인지 확인
export async function isUserMatched() {
  const pageUsername = getPageUsername();
  const loggedInUser = await getCurrentUser();
  return pageUsername === loggedInUser.username;
}

// 프로필 헤더 렌더링하기
async function renderProfileHeader({
  feedCount,
  name,
  username,
  profileImageUrl,
  followStatus,
}) {
  const {
    following: isFollowing,
    followerCount,
    followingCount,
  } = followStatus;

  // 프로필 이미지 업데이트
  document.querySelector('.profile-image-container .profile-image img').src =
    profileImageUrl ?? '/images/default-profile.svg';

  // 사용자명 업데이트
  document.querySelector('.profile-actions .username').textContent = username;

  // 실명 업데이트
  document.querySelector('.profile-bio .full-name').textContent = name;

  // 게시물 수 업데이트
  document.querySelector('.profile-stats .feed-count').textContent = feedCount;

  // 팔로워 / 팔로잉 카운트 업데이트
  document.querySelector('.profile-stats .follower-count').textContent =
    followerCount;
  document.querySelector('.profile-stats .following-count').textContent =
    followingCount;

  // 본인의 페이지인지 타인의 페이지인지에 따라 다른 버튼을 렌더링
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
                ${
                  isFollowing
                    ? `<button class="following-button">
                        팔로잉
                        <i class="fa-solid fa-chevron-down"></i>
                      </button>`
                    : `<button class="follow-button">팔로우</button>`
                }
                
                <button class="message-button">메시지 보내기</button>
            `;
    
    const $button = document.querySelector('.following-button');
    if (isFollowing) {
      // 마우스 오버 시 언팔로우로 텍스트 변경
      $button.onmouseover = () => {
        $button.innerHTML = '언팔로우';
        $button.classList.add('unfollow-hover');
      };

      $button.onmouseout = () => {
        $button.innerHTML = '팔로잉 <i class="fa-solid fa-chevron-down"></i>';
        $button.classList.remove('unfollow-hover');
      };
    } else {
      $button.onmouseover = null;
      $button.onmouseout = null;
    }
    
  }
}

// 프로필 페이지 상단부 렌더링 (사용자이름, 프로필사진, 피드 개수, 팔로워 수 등)
async function initProfileHeader() {
  // 해당 페이지 사용자 이름 추출하기
  const username = getPageUsername();

  // 서버에서 프로필 헤더 정보 요청하기
  const response = await fetchWithAuth(`/api/profiles/${username}`);
  const profileHeader = await response.json();

  // console.log('profile header data: ', profileHeader);

  // 렌더링 진행
  renderProfileHeader(profileHeader);
}

function renderProfileFeeds(feedList) {
  const $gridContainer = document.querySelector('.posts-grid');

  // 그리드 아이템 HTML 생성
  $gridContainer.innerHTML = feedList
    .map(
      (feed) => `
            <div class="grid-item" data-post-id="${feed.id}">
                <img src="${feed.mainThumbnail}" alt="게시물 이미지">
                <div class="grid-item-overlay">
                    <div class="grid-item-stats">
                        <span>
                            <i class="fa-solid fa-heart"></i> 
                            <span class="grid-likes-count">${feed.likeCount}</span>
                        </span>
                        <span>
                            <i class="fa-solid fa-comment"></i>
                            <span class="grid-comments-count">${feed.commentCount}</span>
                        </span>
                    </div>
                </div>
            </div>
        `
    )
    .join('');
}

// 프로필 페이지 피드 목록 렌더링 (메인 썸네일, 좋아요 수, 댓글 수 등)
async function initProfileFeeds() {
  const username = getPageUsername();
  const response = await fetchWithAuth(`/api/profiles/${username}/posts`);

  if (!response.ok) {
    alert('프로필 피드를 불러오는 데 실패했습니다.');
    return;
  }

  const feedList = await response.json();

  // 피드 렌더링 업데이트
  renderProfileFeeds(feedList);
}

// 서버로 프로필 사진 전송
async function handleProfileImage(e) {
  // console.log('file selected!!', e.target);

  if (!e.target.files.length) return;

  const uploadProfileImage = e.target.files[0];

  // 파일 유효성 검사
  if (!uploadProfileImage.type.startsWith('image/')) {
    alert('이미지 파일만 업로드 가능합니다.');
    return;
  }

  if (uploadProfileImage.size > 10 * 1024 * 1024) {
    // 2MB
    alert('파일 크기는 10MB 이하여야 합니다.');
    return;
  }

  // 폼데이터 생성해서 이미지 담기
  const formData = new FormData();
  formData.append('profileImage', uploadProfileImage);

  // 서버에 프사 전송하기
  const response = await fetchWithAuth(`/api/profiles/profile-image`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) {
    alert('프로필 사진 업데이트 실패!');
    return;
  }

  const { imageUrl } = await response.json();
  const $img = $profileImageContainer.querySelector('img');
  $img.src = imageUrl;
}

// 프로필 사진 업데이트 처리
async function initChangeProfileImage() {
  const $fileInput = document.querySelector('input[name=profileImage]');
  // 0. 본인 페이지가 아니면 나가세요
  const match = await isUserMatched();

  if (!match) {
    $profileImageContainer.querySelector('.profile-image').style.cursor =
      'default';
    $fileInput.disabled = true;
    return;
  }

  // 1. 사용자는 자신의 프로필 사진 박스를 클릭한다.

  // 2. 이걸 클릭하면 파일 선택창이 떠야함.
  $profileImageContainer.addEventListener('click', () => {
    $fileInput.click();
  });
  // 3. 파일 선택 완료시 서버로 프로필 이미지 전송
  $fileInput.addEventListener('change', handleProfileImage);
}

document.addEventListener('DOMContentLoaded', async () => {
  //===== 인덱스페이지와 공통 처리 ==== //
  initCommon();

  //===== 프로필 페이지 개별 처리 ===== //
  await initProfileHeader(); // 프로필 페이지 헤더 관련
  await initProfileFeeds(); // 프로필 페이지 피드 관련
  await initChangeProfileImage(); // 프사 변경 관련
  initFollow(); // 팔로우 처리 관련
  initFollowModal(); // 팔로우 목록 처리
});