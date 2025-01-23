
import CarouselManager from "../ui/CarouselManager.js";
import PostLikeManager from "../ui/PostLikeManager.js";
import { fetchWithAuth } from "../util/api.js";
import { createComment } from "./comment.js";
import { openModal as openDetailModal } from "./feed-detail-modal.js";

// 피드가 들어갈 전체영역
const $feedContainer = document.querySelector('.feed-container');

// 피드를 서버로부터 불러오는 함수
async function fetchFeeds() {

  // 서버 요청시 토큰을 헤더에 포함해서 요청해야 함
  const response = await fetchWithAuth('/api/posts');
  if (!response.ok) alert('피드 목록을 불러오는데 실패했습니다.');
  return await response.json();
}

// 해시태그만 추출해서 링크로 감싸기
export function convertHashtagsToLinks(content) {
  // #으로 시작하고 공백이나 줄바꿈으로 끝나는 문자열 찾기
  return content.replace(
    /#[\w가-힣]+/g,
    (match) => `<a href="#" class="hashtag">${match}</a>`
  );
}


// 피드의 날짜를 조작
export function formatDate(dateString) {
  // 날짜문자열을 날짜객체로 변환
  const date = new Date(dateString);

  // 현재시간을 구함
  const now = new Date();

  // 두 시간 사이 값을 구함
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return '방금 전';
  if (diff < 60 * 60) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 60 * 60 * 24) return `${Math.floor(diff / (60 * 60))}시간 전`;
  if (diff < 60 * 60 * 24 * 7) return `${Math.floor(diff / (60 * 60 * 24))}일 전`;

  return new Intl.DateTimeFormat(
    'ko-KR', 
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  ).format(date);
  
}

// 텍스트 길이에 따른 더보기 처리 함수
function truncateContent(writer, content, maxLength = 20) {
  // 1. 먼저 텍스트 길이 체크
  if (content.length <= maxLength) {
    return `
      <a href="/${writer}" class="post-username">${writer}</a>
      <span class="post-caption">${convertHashtagsToLinks(content)}</span>
    `;
  }

  // 2. 긴 텍스트의 경우 처리
  const truncatedContent = content.substring(0, maxLength);

  return `
    <a href="/${writer}" class="post-username">${writer}</a>
    <span class="post-caption post-caption-truncated">
      <span class="truncated-text">${convertHashtagsToLinks(truncatedContent)}...</span>
      <span class="full-text" style="display: none;">${convertHashtagsToLinks(content)}</span>
    </span>
    <button class="more-button">더 보기</button>
  `;
}


// 한개의 피드를 렌더링하는 함수
function createFeedItem({ feed_id: feedId, username, profileImageUrl, content, images, createdAt, likeStatus, commentCount }) {


  const { liked, likeCount } = likeStatus;

  // const makeImageTags = (images) => { 
  //   let imgTag = '';
  //   for (const img of images) {
  //     imgTag += `<img src="${img.imageUrl}">`;
  //   }
  //   return imgTag;
  // };

  return `
    <article class="post" data-post-id="${feedId}">
      <div class="post-header">
        <div class="post-user-info">
          <div class="post-profile-image">
            <img src="${
              profileImageUrl || '/images/default-profile.svg'
            }" alt="프로필 이미지">
          </div>
          <div class="post-user-details">
            <a href="/${username}" class="post-username">
                <!--      작성자 이름 배치      -->
                ${username}
            </a>
          </div>
        </div>
        <button class="post-options-btn">
          <i class="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      <div class="post-images">
        <div class="carousel-container">
          <div class="carousel-track">
            <!--     이미지 목록 배치      -->
            ${images
              .map(
                (image) => `
                <img src="${image.imageUrl}" alt="feed image${image.imageOrder}">
              `
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
                <!--        인디케이터 렌더링        -->
                ${images
                  .map(
                    (_, i) => `
                  <span class="indicator ${i === 0 ? 'active' : ''}"></span>
                `
                  )
                  .join('')}
            </div>
          `
              : ''
          }
        </div>
      </div>
      
      <div class="post-actions">
        <div class="post-buttons">
          <div class="post-buttons-left">
            <button class="action-button like-button ${liked ? 'liked' : ''}">
              <i class="${liked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
            </button>
            <button class="action-button comment-button">
              <i class="fa-regular fa-comment"></i>
            </button>
            <button class="action-button share-button">
              <i class="fa-regular fa-paper-plane"></i>
            </button>
          </div>
          <button class="action-button save-button">
            <i class="fa-regular fa-bookmark"></i>
          </button>
        </div>
        <div class="post-likes">
          좋아요 <span class="likes-count">${likeCount}</span>개
        </div>
      </div>
      

      <div class="post-content">
        <div class="post-text">
            <!--     피드 내용     -->
            ${truncateContent(username, content)}
        </div>
        <div class="post-time">
            <!--      피드 생성 시간      -->
            ${formatDate(createdAt)}
        </div>
      </div>
      
      <div class="post-comments">

          <!-- 댓글이 있을 때만 버튼 표시 -->
          ${
            commentCount > 0
              ? `
            <!-- 댓글 미리보기 -->
            <div class="comments-preview">
              <button class="view-comments-button">
                댓글 ${commentCount}개 모두 보기
              </button>
            </div>`
              : ''
          }

        <form class="comment-form">
          <input type="text" placeholder="댓글 달기..." class="comment-input">
          <button type="submit" class="comment-submit-btn" disabled>게시</button>
        </form>
      </div>
    </article>
  `;
}

// 이미지 캐러셀 부여하기
function initCarousel($feed) {
  // 각 피드의 이미지 슬라이드에 각각 캐러셀 객체를 적용
  // 1. 특정 피드의 캐러셀 컨테이너를 가져옴
  const $carousel = $feed.querySelector('.carousel-container');

  // 2. 캐러셀매니저를 걸어줌
  // 이미지가 단 한개인 슬라이드에서는 이전, 다음버튼이 없어서 에러가 나는 상황
  const $images = $carousel.querySelectorAll('.carousel-track img');

  // 이미지가 2개 이상인 슬라이드만 캐러셀 생성
  if ($images.length >= 2) {
    const carouselManager = new CarouselManager($carousel);
    // 3. 초기 이미지파일 리스트를 보내줘야 함
    // - 현재 렌더링이 모두 되어있는 상황: 이벤트만 걸어주면 되는 상황
    carouselManager.initWithImgTag($images);
  }
}


// 더보기 버튼 이벤트
function initMoreButton($feed) {
  // 더보기 버튼 이벤트 부여
  const $moreButton = $feed.querySelector('.more-button');

  if ($moreButton) {
    $moreButton.addEventListener('click', (e) => {
      e.preventDefault();
      const $captionDiv = $moreButton.closest('.post-text');
      const $truncatedSpan = $captionDiv.querySelector('.truncated-text');
      const $fullSpan = $captionDiv.querySelector('.full-text');

      if ($truncatedSpan && $fullSpan) {
        $truncatedSpan.style.display = 'none';
        $fullSpan.style.display = 'inline';
      }
      $moreButton.style.display = 'none';
    });
  }

}

function initLikeAndComment($feed) {
  // 모든 피드에 좋아요 기능 부여하기
  new PostLikeManager($feed);
  // 모든 피드에 댓글 생성 이벤트 활성화
  createComment($feed.querySelector('.comment-form'));
  // 댓글 말풍선버튼을 누르거나 댓글 n개보기를 누를 시 상세보기 모달이 열리게 하기
  const postId = $feed.dataset.postId;
  $feed
    .querySelector('.comment-button')
    .addEventListener('click', () => openDetailModal(postId));
  $feed
    .querySelector('.view-comments-button')
    ?.addEventListener('click', () => openDetailModal(postId));
}

// 피드가 렌더링 된 이후 처리해야할 것들 (캐러셀, 좋아요, 댓글 기능 등)
function applyNewFeedProcess(feedList) {

  // 새로운 게시물들에게 기능 부여
  feedList.forEach(({feed_id: feedId}) => { 
    const $feed = document.querySelector(`.post[data-post-id="${feedId}"`)
    initCarousel($feed); // 이미지슬라이드 기능
    initMoreButton($feed); // 더보기 버튼 처리
    initLikeAndComment($feed); // 좋아요, 댓글 기능 처리
  }); 
}

// 피드 렌더링 함수
async function renderFeed() {
  // 피드 데이터를 서버로부터 불러오기
  const { feedList } = await fetchFeeds();
  console.log(feedList);

  // feed html 생성
  $feedContainer.innerHTML = feedList.map((feed) => createFeedItem(feed)).join('');

  applyNewFeedProcess(feedList);
  
}

// 외부에 노출시킬 피드관련 함수
function initFeed() {
  renderFeed();
}

export default initFeed;