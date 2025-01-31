const $modal = document.querySelector('.search-modal');
const $backdrop = document.querySelector('.search-modal-backdrop');
const $closeBtn = $modal.querySelector('.modal-close');
const $searchInput = $modal.querySelector('.search-input');
const $clearBtn = $modal.querySelector('.clear-button');

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
  $searchInput.addEventListener('input', e => { 
    // 입력값 읽기
    const inputValue = e.target.value.trim();

    $clearBtn.style.display = inputValue ? 'block' : 'none';
  });

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