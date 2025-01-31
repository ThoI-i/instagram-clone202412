/* src/main/resources/static/js/index.js */

import initStories from './components/stories.js';
import initCreateFeedModal from './components/create-feed-modal.js';
import initFeed from './components/feed.js';
import initMoreMenu from './components/more-menu.js';
import initSuggestions from './components/suggestions.js';
import initSideBar from './components/side-bar.js';
import initFeedDetailModal from './components/feed-detail-modal.js';
import initSearchModal from './components/search-modal.js';

// 모든 태그가 렌더링되면 실행됨
document.addEventListener('DOMContentLoaded', () => {
  initCreateFeedModal(); // 피드생성 관련 js
  initMoreMenu(); // 더보기 버튼 클릭 관련
  initSideBar(); // 사이드바 관련
  initFeedDetailModal(); // 상세보기 모달 관련 이벤트
  initSearchModal(); // 검색창 모달 관련
  
  initStories(); // 스토리 관련 js
  initFeed(); // 피드목록 렌더링 관련 js
  initSuggestions(); // 사용자 추천 관련
});