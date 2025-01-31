
import { fetchWithAuth } from '../util/api.js';
import { convertHashtagsToLinks, formatDate } from './feed.js';
import CarouselManager from '../ui/CarouselManager.js';
import PostLikeManager from '../ui/PostLikeManager.js';
import { createComment } from './comment.js';



const $modal = document.querySelector('.post-detail-modal');
const $backdrop = $modal.querySelector('.modal-backdrop');
const $closeButton = $modal.querySelector('.modal-close-button');
const $gridContainer = document.querySelector('.posts-grid');


// 댓글 하나의 HTML 생성
export function createCommentHTML(comment) {
  return `
    <div class="comment-item">
      <div class="post-profile-image">
        <img src="${comment.userProfileImage ?? '/images/default-profile.svg'}" 
             alt="프로필 이미지">
      </div>
      <div class="comment-content">
        <div>
          <a href="/${comment.username}" class="post-username">
            ${comment.username}
          </a>
          <span class="comment-text">${convertHashtagsToLinks(comment.content)}</span>
        </div>
        <div class="post-time">${formatDate(comment.createdAt)}</div>
      </div>
    </div>
  `;
}


// 댓글 목록 렌더링
function renderComments(comments) {
  const $commentsList = $modal.querySelector('.comments-list');

  if (comments.length > 0) {
    $commentsList.innerHTML = comments.map(createCommentHTML).join('');
  } else {
    $commentsList.innerHTML = `
    <div class="no-comments-container">
      <div class="no-comments">
        아직 댓글이 없습니다.
      </div>
      <div class="no-comments__additional">
        댓글을 남겨보세요.
      </div>
    </div>
    `;
  }
}


// 모달에 피드내용 렌더링
function renderModalContent({ postId, content, createdAt, user, images, likeStatus, comments }) {

  // 모달이 렌더링될 때 현재 피드의 id를 모달태그에 발라놓음
  $modal.dataset.postId = postId;

  const { username, profileImageUrl } = user;
  const { liked, likeCount } = likeStatus;

  $modal.querySelectorAll('.post-username').forEach(($username) => {
    $username.textContent = username;
    $username.href = `/${username}`;
  });

  $modal.querySelectorAll('.post-profile-image img').forEach(($image) => {
    $image.src = profileImageUrl ?? '/images/default-profile.svg';
    $image.alt = `${username}님의 프로필 사진`;
  });

  $modal.querySelector('.post-caption').innerHTML =
    convertHashtagsToLinks(content);
  $modal.querySelector('.post-time').textContent = formatDate(createdAt);

  // 이미지 캐러셀 렌더링
  const $carouselContainer = $modal.querySelector('.modal-carousel-container');

  $carouselContainer.innerHTML = `
                            <div class="carousel-container">
                              <div class="carousel-track">
                                ${images
                                  .map(
                                    (image) =>
                                      `<img src="${image.imageUrl}" alt="피드 이미지 ${image.imageOrder}">`
                                  )
                                  .join('')}
                              </div>
                              ${
                                images.length > 1
                                  ? `
                                      <button class="carousel-prev">
                                        <i class="fa-solid fa-chevron-left"></i>
                                      </button>
                                      <button class="carousel-next">
                                        <i class="fa-solid fa-chevron-right"></i>
                                      </button>
                                      <div class="carousel-indicators">
                                        ${images
                                          .map(
                                            (_, index) =>
                                              `<span class="indicator ${
                                                index === 0 ? 'active' : ''
                                              }"></span>`
                                          )
                                          .join('')}
                                      </div>
                              `
                                  : ''
                              }
                           </div>`;
  
  // 캐러셀 만들기
  if (images.length > 1) {
    const carousel
      = new CarouselManager($carouselContainer);
    
    carousel.initWithImgTag([...$carouselContainer.querySelectorAll('img')]);
  }

  // 좋아요 렌더링 및 토글 처리
  const $likeButton = $modal.querySelector('.like-button');
  const $heartIcon = $modal.querySelector('.like-button i');
  const $likeCount = $modal.querySelector('.likes-count');

  $likeButton.classList.toggle('liked', liked);
  $heartIcon.className = liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  $likeCount.textContent = likeCount;

  // 토글 처리
  new PostLikeManager($modal);

  // 댓글 목록 렌더링
  renderComments(comments);

  // 댓글 form 이벤트 처리
  createComment($modal.querySelector('.comment-form'));
  
}

function findAdjacentPostIds(currentId) {

  // 현재 피드 아이디를 기준으로 양 옆의 피드 id를 구해야됨
  const $currentGrid = document.querySelector(`.grid-item[data-post-id="${currentId}"]`);
  const $prevGrid = $currentGrid?.previousElementSibling;
  const $nextGrid = $currentGrid?.nextElementSibling;

  const prevId = $prevGrid?.dataset.postId;
  const nextId = $nextGrid?.dataset.postId;

  return {
    prevId: prevId ? prevId : null,
    nextId: nextId ? nextId : null,
  };
  
}

// 이전, 다음 피드 버튼 업데이트(조건부 렌더링, 서버에 새로운 피드 재요청) 처리
function updateFeedNavigation(currentId) {
  const $prevButton = $modal.querySelector('.modal-prev-button');
  const $nextButton = $modal.querySelector('.modal-next-button');

  // 현재 열려있는 피드 기준으로 이전, 다음피드가 있는지 체크하고
  // 존재한다면 해당 피드들의 id를 가져오도록 한다.
  const { prevId, nextId } = findAdjacentPostIds(currentId);

  // 조건부 렌더링 처리 (현재 렌더링되어 있는 피드가 첫피드인지 마지막피드인지)
  if (prevId) { // 이전 버튼 처리
    $prevButton.style.visibility = 'visible';
    $prevButton.style.zIndex = '2';
    $prevButton.onclick = () => openModal(prevId);
  } else {
    $prevButton.style.visibility = 'hidden';
    $prevButton.style.zIndex = '-100';
  }

  if (nextId) {
    // 다음 버튼 처리
    $nextButton.style.visibility = 'visible';
    $nextButton.style.zIndex = '2';
    $nextButton.onclick = () => openModal(nextId);
  } else {
    $nextButton.style.visibility = 'hidden';
    $nextButton.style.zIndex = '-100';
  }
}

// 모달 열기
export async function openModal(postId) {

  console.log('postId: ', postId);
  
  
  // 서버에 데이터 요청
  const response = await fetchWithAuth(`/api/posts/${postId}`);

  if (!response.ok) {
    alert('피드 게시물 정보를 불러오는데 실패했습니다.');
    return;
  }

  const feedData = await response.json();
  console.log(feedData);

  // 화면에 렌더링
  renderModalContent(feedData);

  // 이전, 다음 피드 렌더링 처리
  updateFeedNavigation(postId);
  

  // 모달 디스플레이 변경
  $modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

// 모달 닫기
function closeModal() {

  // 모달 디스플레이 변경
  $modal.style.display = 'none';
  document.body.style.overflow = '';
}

// 키보드 네비게이션
function handleKeyPress(e) {
  // 모달이 열려있지 않으면 나가라
  if ($modal.style.display === 'none') return;

  const currentPostId = $modal.dataset.postId;

  const {prevId, nextId} = findAdjacentPostIds(currentPostId);

  if (prevId && e.key === 'ArrowLeft') {
    openModal(prevId);
  } else if (nextId && e.key === 'ArrowRight') {
    openModal(nextId);
  } else if (e.key === 'Escape') {
    closeModal();
  }
}

function initFeedDetailModal() {
  // 피드 썸네일 클릭시 모달이 열리도록 처리
  // 나중에 이 모달은 index페이지에서도 재활용되는데
  // index페이지에는 gridContainer가 없다.
  if ($gridContainer) {
    $gridContainer.addEventListener('click', async (e) => {
      const $gridItem = e.target.closest('.grid-item');
      // console.log($gridItem);
      const postId = $gridItem.dataset.postId;

      await openModal(postId);
    });
  }

  // 모달 닫기 이벤트
  $backdrop.addEventListener('click', closeModal);
  $closeButton.addEventListener('click', closeModal);

  // 키보드 이벤트 리스너 등록
  document.addEventListener('keydown', handleKeyPress);
}

export default initFeedDetailModal;