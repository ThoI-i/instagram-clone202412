/* src/main/resources/static/js/index.js */

import initStories from './components/stories.js';
import initFeed from './components/feed.js';
import initSuggestions from './components/suggestions.js';
import initCommon from './components/common.js';

// 모든 태그가 렌더링되면 실행됨
document.addEventListener('DOMContentLoaded', () => {
  initCommon();
  
  initStories(); // 스토리 관련 js
  initFeed(); // 피드목록 렌더링 관련 js
  initSuggestions(); // 사용자 추천 관련
});