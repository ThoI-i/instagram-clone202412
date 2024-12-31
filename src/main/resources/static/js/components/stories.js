/* src/main/resources/static/js/components/stories.js */

export default function initStories() {
  const $storiesList = document.querySelector('.stories-list');
  const $prevButton = document.querySelector('.stories-prev');
  const $nextButton = document.querySelector('.stories-next');
  const $storyItems = document.querySelectorAll('.story-item');

  // 스토리가 8개 이하면 다음 버튼 숨기기
  if ($storyItems.length <= 8) {
    $nextButton.style.display = 'none';
    return;
  }

  const SCROLL_AMOUNT = 4; // 한 번에 스크롤할 아이템 수
  const itemWidth = $storyItems[0].offsetWidth;
  const gap = 12;
  const scrollDistance = (itemWidth + gap) * SCROLL_AMOUNT;

  // 스크롤 위치에 따른 버튼 표시/숨김 업데이트
  function updateButtons() {
    const isScrollStart = $storiesList.scrollLeft <= 0;
    const isScrollEnd = $storiesList.scrollLeft >= $storiesList.scrollWidth - $storiesList.clientWidth;

    $prevButton.style.display = isScrollStart ? 'none' : 'flex';
    $nextButton.style.display = isScrollEnd ? 'none' : 'flex';
  }

  // 스크롤 이벤트 핸들러
  $storiesList.addEventListener('scroll', () => {
    updateButtons();
  });

  // 버튼 클릭 핸들러
  function scrollStories(direction) {
    const currentScroll = $storiesList.scrollLeft;
    const newScroll = direction === 'next'
      ? currentScroll + scrollDistance
      : currentScroll - scrollDistance;

    $storiesList.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  }

  // 이벤트 리스너 등록
  $nextButton.addEventListener('click', () => scrollStories('next'));
  $prevButton.addEventListener('click', () => scrollStories('prev'));

  // 초기 버튼 상태 설정
  updateButtons();

  // 터치 스크롤 이벤트 처리
  let isScrolling;
  $storiesList.addEventListener('scroll', () => {
    // 스크롤 중에 계속해서 timeout을 초기화
    window.clearTimeout(isScrolling);

    // 스크롤이 멈추고 150ms 후에 버튼 상태 업데이트
    isScrolling = setTimeout(() => {
      updateButtons();
    }, 150);
  });
}