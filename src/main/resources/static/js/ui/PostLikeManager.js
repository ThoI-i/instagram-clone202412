import { fetchWithAuth } from "../util/api.js";

// 좋아요 기능을 관리하는 클래스
// - 토글
// - 좋아요 상태표시( 좋아요 수, 하트색깔 )
class PostLikeManager { 

  // container는 index페이지에서는 피드가 컨테이너고
  // profile페이지에서는 상세모달이 컨테이너다.
  constructor(container) {
    this.$container = container;
    // 좋아요 버튼
    this.$likeButton = container.querySelector('.like-button');
    // 좋아요 아이콘
    this.$heartIcon = container.querySelector('.like-button i');
    // 좋아요 수
    this.$likeCount = container.querySelector('.likes-count');

    // 피드 ID
    this.postId = container.dataset.postId;

    // 좋아요 토글 이벤트 바인딩
    this.$likeButton.onclick = async (e) => { 
      e.preventDefault();
      
      // 서버에 좋아요 토글 요청 보내기
      const response = await fetchWithAuth(`/api/posts/${this.postId}/likes`, {
        method: 'POST'
      });
      if (!response.ok) {
        alert('좋아요 처리 실패!');
        return;
      }
      const likeStatus = await response.json();
      // console.log(likeStatus);
      this.updateUI(likeStatus);
    };
    // 더블 클릭 이벤트 바인딩
    this.addDoubleClickLike();

  }

  // 좋아요 UI처리
  updateUI({ liked, likeCount }) {

    // 하트 아이콘 처리
    this.$likeButton.classList.toggle('liked', liked);
    this.$heartIcon.className = liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';

    // 좋아요 수 처리
    this.$likeCount.textContent = likeCount;

    // 만약 토글한 위치가 프로필 페이지라면
    // 프로필 페이지 피드의 전체좋아요 수도 동적으로 바뀌어야 한다.
    const $gridItem = document.querySelector(`.grid-item[data-post-id="${this.postId}"]`);
    if ($gridItem) {
      $gridItem.querySelector('.grid-likes-count').textContent = likeCount;
    }

    // 만약 토글한 위치가 전체피드목록 페이지면
    // 피드 목록의 좋아요 수와 상태를 수동으로 바꿔줘야 함
    const $feed = document.querySelector(`.post[data-post-id="${this.postId}"]`);
    if ($feed) {
      $feed.querySelector('.likes-count').textContent = likeCount;

      const $likeBtn = $feed.querySelector('.like-button');
      $likeBtn.classList.toggle('liked', liked);
      $likeBtn.querySelector('i').className = liked
        ? 'fa-solid fa-heart'
        : 'fa-regular fa-heart';
    }

  }

  // 더블클릭 좋아요 기능
  addDoubleClickLike() {
    // 캐러셀 컨테이너에 더블클릭 이벤트 바인딩
    const $carousel = this.$container.querySelector('.carousel-container');
    $carousel.ondblclick = () => { 
      this.$likeButton.click();

      // 하트 애니메이션 표시
      const $heartAnimation = document.createElement('div');
      $heartAnimation.classList.add('heart-animation');
      $heartAnimation.innerHTML = '<i class="fa-solid fa-heart"></i>';

      $carousel.append($heartAnimation);

      // 1초 후 애니메이션이 끝나면 하트 박스 삭제
      setTimeout(() => { 
        $heartAnimation.remove();
      }, 1000);

    };
  }

}

export default PostLikeManager;