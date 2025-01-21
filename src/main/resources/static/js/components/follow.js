// 서버에 팔로우 토글 요청을 보내기
function toggleFollow() {

}

// 팔로우 관련 종합 처리 (팔로우 버튼 토글, 팔로우 모달 등)
export default function initFollow() {
  // console.log('init follow!');

  // 팔로우 토글 기능
  // 팔로우 버튼에 이벤트 처리
  const $followButton = document.querySelector('.follow-button');
  $followButton.addEventListener('click', e => { 
    console.log('follow button clicked!');
  });
}