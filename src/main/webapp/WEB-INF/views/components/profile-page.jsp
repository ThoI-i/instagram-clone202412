<%-- src/main/webapp/WEB-INF/views/profile-page.jsp --%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instagram</title>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

    <!-- CSS -->
    <link rel="stylesheet" href="/css/index.css">
    <link rel="stylesheet" href="/css/sidebar.css">
    <link rel="stylesheet" href="/css/profile.css">
    <link rel="stylesheet" href="/css/modal.css">
    <link rel="stylesheet" href="/css/feed.css">
    <link rel="stylesheet" href="/css/feed-detail-modal.css">
    <link rel="stylesheet" href="/css/like.css">
    <link rel="stylesheet" href="/css/follow-modal.css">
    <link rel="stylesheet" href="/css/search-modal.css">

    <!-- JavaScript -->
    <script src="/js/components/profile-page.js" type="module" defer></script>
</head>
<body>
<div class="container profile-page">
    <!-- Left Sidebar -->
    <%@ include file="./sidebar.jsp" %>

    <!-- Main Content -->
    <main class="profile-main">
        <!-- Profile Header -->
        <header class="profile-header">
            <!-- Profile Image -->
            <div class="profile-image-container">
                <div class="profile-image">
                    <img src="/images/default-profile.svg" alt="프로필 이미지">
                </div>
                <input 
                    type="file" 
                    name="profileImage" 
                    accept="image/*" 
                    style="display: none;"
                >
            </div>

            <!-- Profile Info -->
            <div class="profile-info">
                <!-- Username and Buttons Row -->
                <div class="profile-actions">
                    <h2 class="username"></h2>
                    <div class="action-buttons">
                        
                    </div>
                </div>

                <!-- Stats Row -->
                <ul class="profile-stats">
                    <li>
                        게시물 <span class="stats-number feed-count">0</span>
                    </li>
                    <li>
                        팔로워 <span class="stats-number follower-count">0</span>
                    </li>
                    <li>
                        팔로우 <span class="stats-number following-count">0</span>
                    </li>
                </ul>

                <!-- Bio -->
                <div class="profile-bio">
                    <span class="full-name"></span>
                    <div class="bio-text"></div>
                </div>
            </div>
        </header>


        <!-- Profile Navigation -->
        <nav class="profile-nav">
            <a href="#" class="active">
                <i class="fa-solid fa-table-cells"></i>
                게시물
            </a>
            <a href="#">
                <i class="fa-solid fa-film"></i>
                릴스
            </a>
            <a href="#">
                <i class="fa-regular fa-bookmark"></i>
                저장됨
            </a>
            <a href="#">
                <i class="fa-solid fa-user-tag"></i>
                태그됨
            </a>
        </nav>

        <!-- Posts Grid -->
        <div class="posts-grid">
            <!-- Grid Items will be dynamically added here -->
        </div>
    </main>

    <%@ include file="./create-post-modal.jsp" %>
    <%@ include file="./feed-detail-modal.jsp" %>
    <%@ include file="./search-modal.jsp" %>

    <!-- 팔로워/팔로잉 모달 -->
    <div class="follow-modal" style="display: none;">
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <!-- 모달 헤더 -->
            <div class="modal-header">
                <h1 class="modal-title">팔로워</h1>
                <button type="button" class="modal-close">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>

            <!-- 모달 바디 -->
            <div class="modal-body">
                <!-- 사용자 목록이 여기에 동적으로 추가됨 -->
            </div>
        </div>
    </div>

</div>

</body>
</html>