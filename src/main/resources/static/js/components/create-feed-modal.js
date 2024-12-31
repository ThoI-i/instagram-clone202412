// 피드 생성 모달을 전역관리
let $modal = document.getElementById('createPostModal');

// 모달 관련 DOM들을 저장할 객체
let elements = {
  $closeBtn: $modal.querySelector('.modal-close-button'),
  $backdrop: $modal.querySelector('.modal-backdrop'),
  $uploadBtn: $modal.querySelector('.upload-button'),
  $fileInput: $modal.querySelector('#fileInput'),
};
// 파일 업로드 관련 이벤트 함수
function setUpFileUploadEvents() {
  const { $uploadBtn, $fileInput } = elements;
  
  // 파일을 검사하고 다음 단계로 이동하는 함수
  const handleFiles = files => { 
    // 파일의 개수가 10개가 넘는지 검사
    if (files.length > 3) {
      alert('최대 3개의 파일만 선택 가능합니다.')
      return;
    }
  };

  // 업로드 버튼을 누르면 파일선택창이 대신 눌리도록 조작
  $uploadBtn.addEventListener('click', e => $fileInput.click());

  // 파일 선택이 끝났을 때 파일정보를 읽는 이벤트
  $fileInput.addEventListener('change', e => {
    // console.log(e.target.files);
    const files = [...e.target.files];
    if (files.length > 0) handleFiles(files);    
  });
}
// 피드 생성 모달 관련 이벤트 함수
function setUpModalEvents() {

  const { $closeBtn, $backdrop } = elements;

  // 모달 열기 함수
  const openModal = (e) => {
    e.preventDefault();
    // 모달 열기
    $modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';  // 배경 바디 스크롤 방지
  };

  // 모달 닫기
  const closeModal = e => {
    e.preventDefault();
    $modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // 배경 바디 스크롤 방지 해제
  };

  // 피드 생성 모달 열기 이벤트
  document
    .querySelector('.fa-square-plus')
    .closest('.menu-item')
    .addEventListener('click', openModal);

  // X버튼 눌렀을 때
  $closeBtn.addEventListener('click', closeModal);

  // 백드롭 눌렀을 때
  $backdrop.addEventListener('click', closeModal);
}

// 이벤트 바인딩 관련 함수
function bindEvents() {
  setUpModalEvents();
  setUpFileUploadEvents();
}

// 모달 관련 JS 함수 - 외부에 노출
function initCreateFeedModal() {
  bindEvents();
}

export default initCreateFeedModal;