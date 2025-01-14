import { getCurrentUser } from "../util/auth.js";


// 사이드바의 프로필 영역 처리
async function renderSideBarProfile() {

  // 로그인한 유저 정보 가져와야 함.
  const { username, profileImageUrl } = await getCurrentUser();

  const $profileItem = document.querySelector('.menu-item[href="/profile"]');
  // 프로필 사진 렌더링
  const $profileImg = $profileItem.querySelector('.profile-image img');
  $profileImg.src = profileImageUrl || '/images/default-profile.svg';
  $profileImg.alt = `${username}님의 프로필 사진`;

  // 프로필 링크 걸어야 함
  $profileItem.setAttribute('href', `/${username}`);
}

function initSideBar() {
  renderSideBarProfile();
}

export default initSideBar;