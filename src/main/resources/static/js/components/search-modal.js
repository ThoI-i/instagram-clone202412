const $modal = document.querySelector('.search-modal');
const $backdrop = document.querySelector('.search-modal-backdrop');
const $searchInput = $modal.querySelector('.search-input');

// 검색창 모달 열기
function openModal() {
  $modal.style.display = 'block';
  $backdrop.style.display = 'block';
  document.body.style.overflow = 'hidden';

  $searchInput.focus();
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
}


export default function initSearchModal() {
  bindEvents();
}