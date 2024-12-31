
<%-- src/main/webapp/WEB-INF/views/components/feed.jsp --%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="feed-container">
  <c:forEach begin="1" end="5">
    <!-- Post Item -->
    <article class="post">
      <!-- Post Header -->
      <div class="post-header">
        <div class="post-user-info">
          <div class="post-profile-image">
            <img src="/images/default-profile.svg" alt="프로필 이미지">
          </div>
          <div class="post-user-details">
            <a href="#" class="post-username">사용자명</a>
            <span class="post-location">위치 정보</span>
          </div>
        </div>
        <button class="post-options-btn">
          <i class="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      <!-- Post Images -->
      <div class="post-images">
        <div class="carousel-container">
          <div class="carousel-track">
            <img src="https://cdn.pixabay.com/photo/2023/03/31/06/41/winter-7889299_1280.jpg" alt="게시물 이미지">
            <img src="https://png.pngtree.com/background/20230401/original/pngtree-beautiful-scenery-suitable-for-summer-travel-picture-image_2253560.jpg" alt="게시물 이미지">
            <img src="https://gongu.copyright.or.kr/gongu/wrt/cmmn/wrtFileImageView.do?wrtSn=9046030&filePath=L2Rpc2sxL25ld2RhdGEvMjAxNC8yMS9DTFM0L2FzYWRhbF8yNTY4NjZfMjAxNDA0MTY=&thumbAt=Y&thumbSe=b_tbumb&wrtTy=10004" alt="게시물 이미지">
          </div>
          <button class="carousel-prev">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <button class="carousel-next">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
          <div class="carousel-indicators">
            <span class="indicator active"></span>
            <span class="indicator"></span>
            <span class="indicator"></span>
          </div>
        </div>
      </div>

      <!-- Post Actions -->
      <div class="post-actions">
        <div class="post-buttons">
          <div class="post-buttons-left">
            <button class="action-button like-button">
              <i class="fa-regular fa-heart"></i>
            </button>
            <button class="action-button comment-button">
              <i class="fa-regular fa-comment"></i>
            </button>
            <button class="action-button share-button">
              <i class="fa-regular fa-paper-plane"></i>
            </button>
          </div>
          <button class="action-button save-button">
            <i class="fa-regular fa-bookmark"></i>
          </button>
        </div>
        <div class="post-likes">
          좋아요 <span class="likes-count">100</span>개
        </div>
      </div>

      <!-- Post Content -->
      <div class="post-content">
        <div class="post-text">
          <a href="#" class="post-username">사용자명</a>
          <span class="post-caption">게시물 내용입니다. #해시태그 #인스타그램</span>
        </div>
        <button class="more-button">더 보기</button>
        <div class="post-time">7시간 전</div>
      </div>

      <!-- Comments Section -->
      <div class="post-comments">
        <div class="comment-list">
          <div class="comment">
            <a href="#" class="comment-username">댓글작성자</a>
            <span class="comment-text">댓글 내용입니다.</span>
            <div class="comment-actions">
              <span class="comment-time">5시간 전</span>
              <button class="comment-like">좋아요</button>
              <button class="comment-reply">답글 달기</button>
            </div>
          </div>
        </div>
        <form class="comment-form">
          <input type="text" placeholder="댓글 달기..." class="comment-input">
          <button type="submit" class="comment-submit-btn">게시</button>
        </form>
      </div>
    </article>
  </c:forEach>
</div>