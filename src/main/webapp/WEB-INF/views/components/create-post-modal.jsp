<%-- src/main/webapp/WEB-INF/views/components/create-post-modal.jsp --%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>



<div class="modal-container" id="createPostModal" style="display: none;">
  <div class="modal-backdrop"></div>
  <button class="modal-close-button">
    <i class="fa-solid fa-xmark"></i>
  </button>

  <div class="modal-content">
    <!-- 모달 헤더 -->
    <div class="modal-header">
      <button class="back-button" style="visibility: hidden;">
        <i class="fa-solid fa-arrow-left"></i>
      </button>
      <h2 class="modal-title">새 게시물 만들기</h2>
      <button class="next-button">다음</button>

      <div class="loading-spinner" style="display: none;">
        <i class="fa-solid fa-spinner fa-spin"></i>
      </div>

    </div>

    <!-- 모달 바디 -->
    <div class="modal-body">
      <!-- Step 1: 업로드 -->
      <div class="step upload-container active">
        <div class="upload-area">
          <i class="fa-regular fa-images"></i>
          <p>사진과 동영상을 여기에 끌어다 놓으세요</p>
          <input type="file" id="fileInput" multiple accept="image/*" style="display: none;">
          <button class="upload-button">컴퓨터에서 선택</button>
        </div>
      </div>

      <!-- Step 2: 미리보기 & 편집 -->
      <div class="step preview-container">
        <div class="preview-area">
          <div class="carousel-container">
            <div class="carousel-track"></div>
            <button class="carousel-prev">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <button class="carousel-next">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
            <div class="carousel-indicators"></div>
          </div>
        </div>
      </div>

      <!-- Step 3: 내용 작성 -->
      <div class="step write-container">
        <div class="write-layout">
          <!-- 왼쪽 캐러셀 영역 -->
          <div class="preview-area">
            <div class="carousel-container">
              <div class="carousel-track"></div>
              <button class="carousel-prev">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <button class="carousel-next">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
              <div class="carousel-indicators"></div>
            </div>
          </div>

          <!-- 오른쪽 글쓰기 영역 -->
          <div class="write-area">
            <div class="user-info">
              <div class="profile-image">
                <img src="/images/default-profile.svg" alt="프로필">
              </div>
              <span class="username">사용자명</span>
            </div>
            <div class="content-input">
                <textarea
                        maxlength="2200"
                        rows="10"></textarea>
              <div class="char-counter">0/2,200</div>
            </div>
            <div class="additional-options">
              <div class="option-item">
                <span>위치 추가</span>
                <i class="fa-solid fa-chevron-right"></i>
              </div>
              <div class="option-item">
                <span>접근성</span>
                <i class="fa-solid fa-chevron-right"></i>
              </div>
              <div class="option-item">
                <span>고급 설정</span>
                <i class="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- 기존 모달 내용 안에 추가 -->
  <div class="nested-modal" style="display: none;">
    <div class="nested-modal-content">
      <div class="nested-modal-title">
        <h3>게시물을 삭제하시겠어요?</h3>
        <p>지금 나가면 수정 내용이 저장되지 않습니다.</p>
      </div>
      <div class="nested-modal-buttons">
        <button class="delete-button">삭제</button>
        <button class="cancel-button">취소</button>
      </div>
    </div>
  </div>
</div>


