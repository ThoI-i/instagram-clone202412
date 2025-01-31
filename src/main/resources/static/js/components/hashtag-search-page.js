import { fetchWithAuth } from "../util/api.js";
import initCommon from "./common.js";

// 무한스크롤 관련 변수
let currentPage = 1;
let hasNextPage = true;
let isLoading = false;
let tagName = '';

const $gridContainer = document.querySelector('.posts-grid');

// 피드 목록 렌더링
function renderFeeds(feedList) {

  feedList.forEach(feed => { 
    
    const $gridItem = document.createElement('div');
    $gridItem.classList.add('grid-item');
    $gridItem.dataset.postId = `${feed.id}`;

    $gridItem.innerHTML = `
      <img src="${feed.mainThumbnail}" alt="게시물">
      <div class="grid-item-overlay">
        <div class="grid-item-stats">
          <span>
            <i class="fa-solid fa-heart"></i>
            ${feed.likeCount}
          </span>
          <span>
            <i class="fa-solid fa-comment"></i>
            ${feed.commentCount}
          </span>
        </div>
      </div>
    `;

    $gridContainer.append($gridItem);
  });


}

// 서버에 해시태그 피드목록을 요청
async function loadFeeds() {

  if (!hasNextPage || isLoading) return;

  isLoading = true;
  const loadingSpinner = document.querySelector('.spinner');
  loadingSpinner.style.display = 'flex';

  await new Promise(r => setTimeout(r, 700));

  const response = await fetchWithAuth(`/api/hashtags/${tagName}/posts?page=${currentPage}&size=9`);

  const { feedList, hasNext } = await response.json();

  renderFeeds(feedList);

  hasNextPage = hasNext;
  currentPage++;
  isLoading = false;
  loadingSpinner.style.display = 'none';
}

function initInfiniteScroll() {

  const observer = new IntersectionObserver((entries) => { 

    if (entries[0].isIntersecting && hasNextPage && !isLoading) {
      console.log('하단부 로딩바가 감지됨!');
      loadFeeds();
    }
  });

  // 옵저버 감시
  observer.observe(document.querySelector('.grid-loader'));
}

// 초기화 함수
function initHashtagFeed() {
  // URL에서 ? (query string) Javascript로 읽는법
  const param = new URLSearchParams(window.location.search);

  tagName = param.get('q');

  // 해시태그명 렌더링
  document.querySelector('.hashtag-info h1').textContent = `#${tagName}`;

  // 초기 피드데이터 로드
  loadFeeds();

  // 무한 스크롤 이벤트 바인딩
  initInfiniteScroll();
}

document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  initHashtagFeed(); // 해시태그 피드 처리
});