
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="suggestions">
  <!-- 현재 사용자 프로필 -->
  <div class="current-user">
    <div class="user-profile">
      <a href="/profile" class="profile-image">
        <img src="/images/default-profile.svg" alt="프로필 이미지">
      </a>
      <div class="profile-info">
        <a href="/profile" class="username">사용자명</a>
        <span class="name">실제 이름</span>
      </div>
      <button class="switch-button">전환</button>
    </div>
  </div>

  <!-- 추천 섹션 헤더 -->
  <div class="suggestions-header">
    <span class="suggestions-text">회원님을 위한 추천</span>
    <button class="see-all-button">모두 보기</button>
  </div>

  <!-- 추천 사용자 목록 -->
  <div class="suggestions-list">
    <!-- 추천 사용자 아이템 -->
    <c:forEach begin="1" end="5">
      <div class="suggestion-item">
        <div class="user-profile">
          <a href="/profile" class="profile-image">
            <img src="/images/default-profile.svg" alt="프로필 이미지">
          </a>
          <div class="profile-info">
            <a href="/profile" class="username">추천사용자${i}</a>
            <span class="follow-info">인기</span>
          </div>
          <button class="follow-button">팔로우</button>
        </div>
      </div>
    </c:forEach>
  </div>

  <!-- 푸터 링크 -->
  <div class="suggestions-footer">
    <nav class="footer-links">
      <a href="#">소개</a>
      <a href="#">도움말</a>
      <a href="#">홍보 센터</a>
      <a href="#">API</a>
      <a href="#">채용 정보</a>
      <a href="#">개인정보처리방침</a>
      <a href="#">약관</a>
      <a href="#">위치</a>
      <a href="#">언어</a>
      <a href="#">Meta Verified</a>
    </nav>
    <div class="copyright">
      © 2024 INSTAGRAM FROM META
    </div>
  </div>
</div>

