import { fetchWithAuth } from "../util/api.js";

class HashtagSearch {
  constructor($textarea) {
    // console.log('해시태그 검색 객체 생성!');
    // 사용자가 피드내용을 입력하는 영역
    this.$textarea = $textarea;

    // 검색결과를 표시할 컨테이너를 생성
    this.$suggestionContainer = this.createContainer();

    // 디바운스를 위한 타이머변수
    this.searchTimeout = null;

  }

  // textarea에 input이벤트 걸기
  init() {
    // text입력 감지
    this.$textarea.addEventListener('input', (e) => {
      // 입력값을 읽어옴
      const text = e.target.value;

      // 해시태그입력을 감지해야 함.
      // 현재 커서를 읽어오기
      const currentCursorPosition = e.target.selectionStart;
      // console.log(currentCursorPosition);

      const hashtagMatch = this.findHashtagAtCursor(text, currentCursorPosition);

      if (hashtagMatch) {
        // 서버에 검색요청 보내기 - 디바운스 적용
        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(() => {
          this.fetchHashtagSearch(hashtagMatch.keyword);
        }, 700);

        // 검색할 해시태그 범위(start, end)를 저장
        this.currentRange = {
          start: hashtagMatch.start,
          end: currentCursorPosition,
        };
      }
    });
  }

  // 서버에 검색요청을 보내는 함수
  async fetchHashtagSearch(keyword) {
    // 키워드가없으면 서버통신 보내지마
    if (!keyword) {
      return;
    }

    const response = await fetchWithAuth(`/api/hashtags/search?keyword=${keyword}`);
    const hashtags = await response.json();
    // console.log(hashtags);

    // 서버에서 가져온 해시태그정보 렌더링
    this.renderSuggestions(hashtags);
  }

  // 서버에서 가져온 해시태그 화면에 렌더링하기
  renderSuggestions(hashtags) {
    // 검색결과가 없다면 컨테이너 숨기기
    if (!hashtags || !hashtags.length) {
      this.hideSuggestions();
      return;
    }

    // HTML 문자열로 각 해시태그 아이템을 구성하여 삽입
    this.$suggestionContainer.innerHTML = hashtags
      .map(
        (tag, index) => `
      <div class="hashtag-item" data-name="${tag.hashtag}" data-index="${index}">
        <div class="hashtag-info">
          <span class="hashtag-name">#${tag.hashtag}</span>
          <span class="post-count">게시물 ${tag.feedCount}개</span>
        </div>
      </div>
    `
      )
      .join('');

    // 생성된 목록을 보여주기
    this.$suggestionContainer.style.display = 'block';

    // 해시태그 클릭시 이벤트
    this.addClickEvents();

  }

  // 해시태그 추천 컨테이너 숨기기
  hideSuggestions() {
    this.$suggestionContainer.style.display = 'none';
  }

  /**
   * 현재 커서 앞부분에 있는 가까운 해시태그를 찾는다.
   * @param {string} text - 전체 textarea 입력값
   * @param {*} currentCursorPosition - 현재 위치한 커서의 인덱스
   */
  findHashtagAtCursor(text, currentCursorPosition) {
    // 현재 위치한 커서 이전에 있는 텍스트를 전부 추출
    const beforeCursorText = text.substring(0, currentCursorPosition);

    // 정규표현식으로 마지막 해시태그를 찾아내서 추출
    // 정규표현식으로 마지막 #부터 시작하는 단어(한글 포함)를 찾는다
    const match = beforeCursorText.match(/#[\w가-힣]*$/);
    console.log('match: ', match);

    return match ? { keyword: match[0].substring(1), start: match.index } : null;
  }

  // 해시태그 추천목록을 만들 컨테이너
  createContainer() {
    const $container = document.createElement('div');
    $container.classList.add('hashtag-suggestions');
    this.$textarea.parentElement.append($container);
    return $container;
  }

  /**
   * 표시된 해시태그 후보(추천)들을 클릭했을 때,
   * 해당 태그를 실제 textarea에 삽입하기 위한 이벤트를 등록한다.
   */
  addClickEvents() {
    this.$suggestionContainer
      .querySelectorAll('.hashtag-item')
      .forEach((item) => {
        item.addEventListener('click', () => {
          // 클릭 시, data-name 속성에 담긴 해시태그 이름 삽입
          this.insertHashtag(item.dataset.name);
        });
      });
  }

  /**
   * 추천 목록에서 해시태그를 선택(클릭)했을 때,
   * 현재 textarea에 해당 태그를 삽입하는 함수
   *
   * @param {string} tagName - 선택된 태그 이름
   */
  insertHashtag(tagName) {
    const text = this.$textarea.value;

    // 해시태그가 시작되기 전 구간
    const beforeHashtag = text.substring(0, this.currentRange.start);

    // 해시태그가 끝난 뒤 구간
    const afterHashtag = text.substring(this.currentRange.end);

    // 새롭게 구성된 문자열 (해시태그 이름 뒤에 공백 추가)
    const newText = `${beforeHashtag}#${tagName} ${afterHashtag}`;

    // textarea에 반영
    this.$textarea.value = newText;

    // 추천 목록 숨기고 포커스 유지
    this.hideSuggestions();
    this.$textarea.focus();
  }
}

export default HashtagSearch;