
const $modal = document.querySelector('.post-detail-modal');
const $backdrop = $modal.querySelector('.modal-backdrop');
const $closeButton = $modal.querySelector('.modal-close-button');
const $gridContainer = document.querySelector('.posts-grid');


// 모달 열기
function openModal() {

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

function initFeedDetailModal() {
  // 피드 썸네일 클릭시 모달이 열리도록 처리
  // 나중에 이 모달은 index페이지에서도 재활용되는데
  // index페이지에는 gridContainer가 없다.
  if ($gridContainer) {
    $gridContainer.addEventListener('click', e => { 

      openModal();
    });
  }

  // 모달 닫기 이벤트
  $backdrop.addEventListener('click', closeModal);
  $closeButton.addEventListener('click', closeModal);

}

export default initFeedDetailModal;