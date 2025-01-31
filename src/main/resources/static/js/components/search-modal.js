import { debounce } from "../util/debounce.js";
import { fetchWithAuth } from '../util/api.js';


const $modal = document.querySelector('.search-modal');
const $backdrop = document.querySelector('.search-modal-backdrop');
const $closeBtn = $modal.querySelector('.modal-close');
const $searchInput = $modal.querySelector('.search-input');
const $clearBtn = $modal.querySelector('.clear-button');

const $skeletonLoading = $modal.querySelector('.skeleton-loading');
const $resultList = $modal.querySelector('.search-result-list');
const $recentSearch = $modal.querySelector('.recent-searches');

// 검색창 모달 닫기
function closeModal() {
  $modal.style.display = 'none';
  $backdrop.style.display = 'none';
  document.body.style.overflow = '';

  $searchInput.value = ''; // 검색어 지우기
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

  // 검색 결과 클릭시 해당 프로필로 이동
  $resultList.querySelectorAll('.search-result-item').forEach($item => {
    $item.addEventListener('click', () => {
      const username = $item.dataset.username;
      window.location.href = `/${username}`;
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
  const response = await fetchWithAuth(
    `/api/search/members?keyword=${inputValue}`
  );

  const results = await response.json();
  // console.log(results);

  renderResults(results); // 검색결과 렌더링
  

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
    }
  }, 500));

  // 검색어 클리어 버튼 이벤트
  $clearBtn.addEventListener('click', () => { 
    $searchInput.value = '';
    $clearBtn.style.display = 'none';
    $searchInput.focus();
  });
  
}


export default function initSearchModal() {
  bindEvents();
}