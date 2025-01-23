
import { getPageUsername, isUserMatched } from './profile-page.js';
import { toggleFollow } from '../util/api.js';


// 팔로우 상태에 따른 버튼 렌더링 변경
function updateFollowButton($button, isFollowing) {

  $button.className = isFollowing ? 'following-button' : 'follow-button';
  $button.innerHTML = isFollowing ? `팔로잉 <i class="fa-solid fa-chevron-down"></i>` : '팔로우';

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

// 초기 팔로우 버튼 이벤트 처리
async function initFollowButton() {
  // 내 페이지에서는 팔로우 처리를 진행하지 않음
  if (await isUserMatched()) return;

  // 팔로우 토글 기능
  // 팔로우 버튼에 이벤트 처리
  let $followButton = document.querySelector('.follow-button');
  if (!$followButton) {
    $followButton = document.querySelector('.following-button');
  }

  $followButton.addEventListener('click', async (e) => {
    const pageUsername = getPageUsername();

    const { following: isFollowing, followerCount } = await toggleFollow(pageUsername);

    // 해당 페이지 유저의 팔로워 수 갱신
    document.querySelector('.follower-count').textContent = followerCount;

    // 버튼 상태 업데이트
    updateFollowButton($followButton, isFollowing);
  });
}

// 팔로우 관련 종합 처리 (팔로우 버튼 토글, 팔로우 모달 등)
export default async function initFollow() {
  // console.log('init follow!');

  await initFollowButton();
}