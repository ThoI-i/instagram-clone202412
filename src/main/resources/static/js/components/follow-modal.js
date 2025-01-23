import { fetchWithAuth } from "../util/api.js";
import { getCurrentUser } from "../util/auth.js";
import { getPageUsername } from "./profile-page.js";
import { toggleFollow } from "../util/api.js";


const $modal = document.querySelector('.follow-modal');
const $closeButton = $modal.querySelector('.modal-close');
const $backdrop = $modal.querySelector('.modal-backdrop');

// 사용자 항목 HTML 생성 함수
function createUserItem(user, currentUsername) {
  return `
        <div class="user-item">
            <div class="user-profile">
                <img src="${user.profileImageUrl || '/images/default-profile.svg'}" 
                     alt="${user.username}의 프로필">
            </div>
            <div class="user-info">
                <a href="/${user.username}" class="username">${user.username}</a>
                <div class="name">${user.name}</div>
            </div>
            ${ user.username !== currentUsername ?
            `<button class="follow-button ${user.following ? 'following' : ''}"
                    data-username="${user.username}">
                ${user.following ? '팔로잉' : '팔로우'}
            </button>` : ''
            }
        </div>
    `;
}

// 팔로우 버튼 UI 업데이트 함수
function updateFollowButton($button, isFollowing) {
  // 버튼 스타일과 텍스트 변경
  $button.classList.toggle('following', isFollowing);
  $button.textContent = isFollowing ? '팔로잉' : '팔로우';

  // 팔로잉 상태일 때만 호버 이벤트 추가
  if (isFollowing) {
    $button.onmouseover = () => {
      $button.textContent = '언팔로우';
      $button.classList.add('unfollow-hover');
    };
    $button.onmouseout = () => {
      $button.textContent = '팔로잉';
      $button.classList.remove('unfollow-hover');
    };
  } else {
    $button.onmouseover = null;
    $button.onmouseout = null;
  }
}

// 팔로잉 카운트 업데이트 함수
function updateFollowingCount(change) {
  const $followingCount = document.querySelector('.following-count');
  if ($followingCount) {
    const currentCount = $followingCount.textContent;
    $followingCount.textContent = +currentCount + change;
  }
}

// 팔로우 목록 렌더링
async function renderFollowList(type) {

  // 로그인한 사람 정보
  const currentUser = await getCurrentUser();

  // 로그인한 사람 이름
  const loggedInUsername = currentUser.username;

  // 페이지 주인 이름
  const pageUsername = getPageUsername();

  // 서버에 목록 요청하기
  const response = await fetchWithAuth(`/api/follows/${pageUsername}/${type}`);

  const followList = await response.json();
  
  // 화면에 렌더링
  const $modalBody = $modal.querySelector('.modal-body');
  $modalBody.innerHTML = followList.map(follow => createUserItem(follow, currentUser.username)).join('');
  

  // 각 팔로우 버튼에 이벤트 추가
  $modalBody.querySelectorAll('.follow-button').forEach($button => {

    // 초기 버튼 상태 설정
    updateFollowButton($button, $button.classList.contains('following'));

    // 버튼을 누르면 팔로우 토글
    $button.addEventListener('click', async () => { 
      const { following } = await toggleFollow($button.dataset.username);
      
      // 현재 보고있는 페이지가 내 프로필페이지인지 타인 프로필페이지인지에 따라 처리가 달라짐
      const isMyProfile = loggedInUsername === pageUsername;

      // 팔로워 목록에서 토글한건지, 팔로잉 목록에서 토글한건지
      if (type === 'followings') {
        // 버튼 상태를 반대로 변경
        updateFollowButton($button, following);
        if (isMyProfile) {
          // 팔로잉 목록에서 해당 유저를 제거
          $button.closest('.user-item').remove();
          updateFollowingCount(-1);
        }
      } else {  // 팔로워 목록에서
        // 버튼 상태를 반대로 변경
        updateFollowButton($button, following);
        if (isMyProfile) {   // 팔로잉 수를 제어
          updateFollowingCount(following ? 1 : -1);
        }
      }
    });
  });
}

// 모달 열기
function openFollowModal(type) {

  // 타이틀 변경
  $modal.querySelector('.modal-title').textContent = type === 'followers' ? '팔로워' : '팔로잉';

  // 목록 렌더링
  renderFollowList(type);

  $modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// 모달 닫기
function closeFollowModal() {
  $modal.style.display = 'none';
  document.body.style.overflow = '';
}

function initFollowModal() {
  
  // 프로필페이지에서 '팔로우' '팔로워' 버튼 클릭 이벤트
  [...document.querySelector('.profile-stats').children].forEach(($li, i) => {
    if (i === 0) return;
    $li.style.cursor = 'pointer';
    $li.addEventListener('click', () => { 
      const type = i === 1 ? 'followers' : 'followings';
      openFollowModal(type);
    });
  });

  // 모달 닫기 이벤트 바인딩
  $closeButton.addEventListener('click', closeFollowModal);
  $backdrop.addEventListener('click', closeFollowModal);


}

export default initFollowModal;