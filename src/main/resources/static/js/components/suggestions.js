
import { getCurrentUser } from "../util/auth.js";

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

function initSuggestions() {
  renderMe();
}

export default initSuggestions;