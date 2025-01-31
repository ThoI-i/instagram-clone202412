import initCreateFeedModal from './create-feed-modal.js';
import initMoreMenu from './more-menu.js';
import initSideBar from './side-bar.js';
import initSearchModal from './search-modal.js';
import initFeedDetailModal from './feed-detail-modal.js';


export default function initCommon() {
  initCreateFeedModal(); // 피드생성 관련 js
  initMoreMenu(); // 더보기 버튼 클릭 관련
  initSideBar(); // 사이드바 관련
  initSearchModal(); // 검색창 모달
  initFeedDetailModal(); // 상세보기 모달 이벤트
}