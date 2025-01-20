import { fetchWithAuth } from "../util/api.js";
import { openModal, createCommentHTML } from "./feed-detail-modal.js";


// 댓글 등록 요청 처리 (피드 목록 - 여러개 의 입력, 상세보기 모달 - 하나의 입력)
export function createComment($form) {

  // 렌더링 헬퍼 함수
  function renderAfterCreated({ comment, commentCount }) {

    // 댓글이 작성되는 공간이 크게 피드 목록과 모달 내부가 있음.
    // 그런데 피드 목록에서 작성될 때는
    // 첫 댓글인 경우 '댓글 1개 보기'라는 버튼을 생성해야 함
    // 그리고 두번째 댓글부터는 '댓글 n개 보기'로 텍스트만 갱신함

    // 일단 현재 여기가 피드 목록인지부터 확인
    const $feed = $form.closest('.feed-page');

    if ($feed) {
      if (commentCount === 1) {
        const $commentPreview = document.createElement('div');
        $commentPreview.classList.add('comments-preview');
        $commentPreview.innerHTML = `
            <button class="view-comments-button">
              댓글 1개 모두 보기
            </button>
        `;
        $form.before($commentPreview);

        // 댓글 n개보기에 이벤트 걸기
        $commentPreview.addEventListener('click', () => openModal(postId));

      } else {
        const $viewCommentsBtn = $feed.querySelector('.view-comments-button');
        $viewCommentsBtn.textContent = `댓글 ${commentCount}개 모두 보기`;
      }
    }

    // 댓글이 작성된 공간이 모달 내부라면 실시간으로 새댓글을 렌더링
    const $modal = $form.closest('.post-detail-modal');

    if ($modal) {

      // 첫 댓글인 경우 '아직 댓글이 없습니다'를 제거
      if (commentCount === 1) {
        const $noComment = $modal.querySelector('.no-comments-container');
        $noComment?.remove();
      }

      const $commentsList = $modal.querySelector('.comments-list');
      $commentsList.innerHTML += createCommentHTML(comment);
    }

    // 여기가 프로필페이지면 썸네일의 댓글 수 동기화
    const $profilePage = $form.closest('.profile-page');
    if ($profilePage) {
      const $gridItem = $profilePage.querySelector(`.grid-item[data-post-id="${postId}"]`);
      $gridItem.querySelector('.grid-comments-count').textContent = commentCount;
    }

  }
  // ======================= //


  // 피드 아이디 가져오기 
  const postId = $form.closest('[data-post-id]')?.dataset.postId;

  // 댓글 입력창 가져오기
  const $commentInput = $form.querySelector('.comment-input');
  // 댓글 입력 버튼 가져오기
  const $commentSubmitBtn = $form.querySelector('.comment-submit-btn');

  // 입력값 변경 시 댓글 게시 버튼 활성화 여부 처리
  $commentInput.oninput = () => { 
    // 0일 때 false, 0보다크면 true
    const isValid = $commentInput.value.trim().length > 0;
    $commentSubmitBtn.disabled = !isValid;
  };

  // 댓글 생성 서버에 요청하기
  $form.onsubmit = async (e) => {
    e.preventDefault();

    // 입력한 댓글 읽어오기
    const content = $commentInput.value.trim();
    if (!content) return;

    const response = await fetchWithAuth(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });

    if (!response.ok) {
      alert('댓글 생성에 실패했습니다.');
      return;
    }

    const commentResponse = await response.json();

    // console.log(commentResponse);

    // 댓글 입력창을 비우고, 게시버튼 잠그기
    $commentInput.value = '';
    $commentSubmitBtn.disabled = true;
    
    // 후속 렌더링 처리
    renderAfterCreated(commentResponse);

  };
  
}