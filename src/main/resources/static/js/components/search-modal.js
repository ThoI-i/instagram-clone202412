import { debounce } from "../util/debounce.js";
import { fetchWithAuth } from '../util/api.js';

// 최근 검색어 기록
const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;  // 최대 5개까지


const $modal = document.querySelector('.search-modal');
const $backdrop = document.querySelector('.search-modal-backdrop');
const $closeBtn = $modal.querySelector('.modal-close');
const $searchInput = $modal.querySelector('.search-input');
const $clearBtn = $modal.querySelector('.clear-button');

const $skeletonLoading = $modal.querySelector('.skeleton-loading');
const $resultList = $modal.querySelector('.search-result-list');
const $recentSearch = $modal.querySelector('.recent-searches');


// 최근 검색어 개별삭제
function removeRecentSearch(username) { 
  const searches = getRecentSearches();
  const filtered = searches.filter(item => item.username !== username);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
}

// 최근 검색어 전체삭제
function clearRecentSearches() {
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}

// 최근 검색어 목록 렌더링
function renderRecentSearches() {
  const searches = getRecentSearches();

  if (searches.length === 0) {
    $recentSearch.innerHTML = `
            <div class="results-header">
                <h3>최근 검색 항목</h3>
            </div>
            <div class="no-results">
                최근 검색 내역 없음
            </div>
        `;
    return;
  }

  $recentSearch.innerHTML = `
        <div class="results-header">
            <h3>최근 검색 항목</h3>
            <button type="button" class="clear-all-button">모두 지우기</button>
        </div>
        <div class="recent-searches-list">
            ${searches
              .map(
                (item) => `
                <div class="search-result-item">
                    <div class="user-profile">
                        <img src="${
                          item.profileImageUrl || '/images/default-profile.svg'
                        }" 
                             alt="${item.username}의 프로필">
                    </div>
                    <div class="user-info">
                        <div class="username">${item.username}</div>
                        <div class="name">${item.name}</div>
                    </div>
                    <button type="button" class="remove-search" data-username="${
                      item.username
                    }">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `
              )
              .join('')}
        </div>
    `;

  // 모두 지우기
  const $clearAllBtn = $recentSearch.querySelector('.clear-all-button');
  $clearAllBtn.addEventListener('click', () => {
    clearRecentSearches();
    renderRecentSearches();
  });

  // 개별 삭제 버튼
  $recentSearch.querySelectorAll('.remove-search').forEach(($btn) => {
    $btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const username = $btn.dataset.username;
      removeRecentSearch(username);
      renderRecentSearches();
    });
  });

  // 검색 결과 클릭 시 프로필 페이지로 이동
  $recentSearch.querySelectorAll('.search-result-item').forEach(($item) => {
    $item.addEventListener('click', () => {
      const username = $item.querySelector('.username').textContent;
      window.location.href = `/${username}`;
    });
  });
}




// 로컬스토리지에 저장된 최근 검색결과 배열을 불러오기
function getRecentSearches() {
  const savedSearches = localStorage.getItem(RECENT_SEARCHES_KEY);
  return savedSearches ? JSON.parse(savedSearches) : [];
}

// 사용자가 클릭한 검색결과 유저정보를 JSON으로 로컬스토리지에 저장
function addRecentSearch(user) {

  // 기존에 로컬스토리지에 저장된 배열을 불러오기
  const searches = getRecentSearches();

  // 이미 저장된 항목이면 제거하고 새로 추가
  const filtered = searches.filter(item => item.username !== user.username);

  // 새항목을 배열의 맨 앞에 추가
  filtered.unshift({
    username: user.username,
    name: user.name,
    profileImageUrl: user.profileImageUrl,
    timestamp: new Date().toISOString(),
  });

  // 최대 개수를 유지
  if (filtered.length > MAX_RECENT_SEARCHES) {
    // 제일 오래된 검색기록을 제거
    filtered.pop();
  }

  // 로컬스토리지에 저장
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
}


// 최근 검색 결과 창 띄우기
function showRecentSearches() {
  $recentSearch.style.display = 'block';
  $resultList.style.display = 'none';
}

// 검색창 모달 닫기
function closeModal() {
  $modal.style.display = 'none';
  $backdrop.style.display = 'none';
  document.body.style.overflow = '';

  $searchInput.value = ''; // 검색어 지우기
  showRecentSearches();
}

// 검색창 모달 열기
function openModal() {
  $modal.style.display = 'block';
  $backdrop.style.display = 'block';
  document.body.style.overflow = 'hidden';

  $searchInput.focus();
}

// 스켈레톤 띄우기
function showSkeletonLoading() {
  $recentSearch.style.display = 'none';
  $skeletonLoading.style.display = 'block';
}

// 스켈레톤 없애기
function hideSkeletonLoading() {
  $skeletonLoading.style.display = 'none';
  $resultList.style.display = 'block';
}



// 검색결과 HTML생성
function createResultItem(user) {
  return `
        <div class="search-result-item" data-username="${user.username}">
            <div class="user-profile">
                <img src="${user.profileImageUrl || '/images/default-profile.svg'}" 
                     alt="${user.username}의 프로필">
            </div>
            <div class="user-info">
                <div class="username">${user.username}</div>
                <div class="name">${user.name}</div>
                ${user.commonFollowers.length ? `
                    <div class="mutual-follows">
                        ${user.commonFollowers[0]}님${user.commonFollowers.length > 1 ?
    ` 외 ${user.commonFollowers.length - 1}명` : ''}이 팔로우합니다
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}


// 검색결과 렌더링하기
function renderResults(results) {
  if (!results.length) {
    $resultList.innerHTML = `
            <div class="no-results">
                검색 결과가 없습니다.
            </div>
        `;
    return;
  }

  $resultList.innerHTML = results.map(createResultItem).join('');


  // console.log(results);

  // 검색 결과 클릭시 해당 프로필로 이동
  $resultList.querySelectorAll('.search-result-item').forEach($item => {
    $item.addEventListener('click', () => {
      const username = $item.dataset.username;

      // 사용자계정명으로 배열에서 해당 사용자객체 찾기
      const foundUser = results.find(user => user.username === username);

      // 클릭한 유저정보를 로컬스토리지 최근 검색어에 추가
      addRecentSearch(foundUser);

      window.location.href = `/${username}`;
    });
  });

}


// 해시태그 검색결과 렌더링
function renderHashtagResults(hashtags) {
  if (!hashtags.length) {
    $resultList.innerHTML = `<div class="no-results">검색 결과가 없습니다.</div>`;
    return;
  }

  $resultList.innerHTML = hashtags
    .map(
      (tag) => `
    <div class="search-result-item hashtag-item" data-tag="${tag.hashtag}">
      <div class="hashtag-symbol">#</div>
      <div class="hashtag-info">
        <div class="hashtag-name">${tag.hashtag}</div>
        <div class="post-count">게시물 ${tag.feedCount}개</div>
      </div>
    </div>
  `
    )
    .join('');

  // 해시태그 클릭 이벤트
  $resultList.querySelectorAll('.hashtag-item').forEach(item => {
    item.addEventListener('click', () => {
      const tag = item.dataset.tag;
      window.location.href = `/explore/search/keyword/?q=${tag}`;
    });
  });
}




// 검색 처리 수행
async function search(inputValue) {

  // 스켈레톤 로딩 스크린 띄우기
  showSkeletonLoading();

  // 의도적으로 1.5초의 로딩을 걸기
  await new Promise(resolve => setTimeout(resolve, 1500));

  // 서버 통신
  let response;
  let results;

  if (inputValue.startsWith('#')) {
    console.log('val: ', inputValue);
    
    // 해시태그 검색
    response = await fetchWithAuth(`/api/hashtags/search?keyword=${inputValue.substring(1)}`);
    results = await response.json();
    renderHashtagResults(results);
  } else {
    // 사용자 검색
    response = await fetchWithAuth(`/api/search/members?keyword=${inputValue}`);
    results = await response.json();
    // console.log(results);
    renderResults(results); // 사용자 검색결과 렌더링
  }

  // 스켈레톤 숨기기
  hideSkeletonLoading();
}

// 필요한 이벤트 바인딩
function bindEvents() {
  // 사이드바의 검색 버튼 클릭시 모달 열기
  document
    .querySelector('.menu-item i.fa-magnifying-glass')
    .closest('.menu-item')
    .addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  
  // 모달 닫기 이벤트 바인딩
  $closeBtn.addEventListener('click', closeModal);
  $backdrop.addEventListener('click', closeModal);

  // 검색어 입력 이벤트
  $searchInput.addEventListener('input', debounce(e => { 
    // 입력값 읽기
    const inputValue = e.target.value.trim();

    $clearBtn.style.display = inputValue ? 'block' : 'none';

    if (inputValue) {
      search(inputValue);
    } else {
      showRecentSearches();
    }
  }, 500));

  // 검색어 클리어 버튼 이벤트
  $clearBtn.addEventListener('click', () => { 
    $searchInput.value = '';
    $clearBtn.style.display = 'none';
    showRecentSearches();
    $searchInput.focus();
  });
  
}


export default function initSearchModal() {
  bindEvents();
  renderRecentSearches();
}