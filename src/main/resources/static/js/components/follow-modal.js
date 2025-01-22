
import { fetchWithAuth } from "../util/api.js";
import { getCurrentUser } from "../util/auth.js";
import { getPageUsername } from "./profile-page.js";


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

// 팔로우 목록 렌더링
async function renderFollowList(type) {

  // 로그인한 사람 이름
  const currentUser = await getCurrentUser();

  // 서버에 목록 요청하기
  const response = await fetchWithAuth(`/api/follows/${getPageUsername()}/${type}`);

  const followList = await response.json();
  
  // 화면에 렌더링
  const $modalBody = $modal.querySelector('.modal-body');
  $modalBody.innerHTML = followList.map(follow => createUserItem(follow, currentUser.username)).join('');
  

  // 각 팔로우 버튼에 이벤트 추가
  $modalBody.querySelectorAll('.follow-button').forEach($button => {


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
