/* src/main/resources/static/js/index.js */

import initStories from './components/stories.js';
import initCreateFeedModal from './components/create-feed-modal.js';
import initFeed from './components/feed.js';

// 모든 태그가 렌더링되면 실행됨
document.addEventListener('DOMContentLoaded', () => {
  initStories(); // 스토리 관련 js
  initCreateFeedModal(); // 피드생성 관련 js
  initFeed(); // 피드목록 렌더링 관련 js
});