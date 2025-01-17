
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

    // 좋아요 토글 이벤트 바인딩
    this.$likeButton.onclick = (e) => { 
      e.preventDefault();
      console.log('toggle like!');
    };
  }

}

export default PostLikeManager;