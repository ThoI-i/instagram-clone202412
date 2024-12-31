<%-- src/main/webapp/WEB-INF/views/index.jsp --%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Instagram Clone</title>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

    <!-- Modular CSS -->
    <link rel="stylesheet" href="/css/index.css">
    <link rel="stylesheet" href="/css/sidebar.css">
    <link rel="stylesheet" href="/css/stories.css">
    <link rel="stylesheet" href="/css/feed.css">
    <link rel="stylesheet" href="/css/suggestions.css">
    <link rel="stylesheet" href="/css/modal.css">

    <!-- Modular JS -->
    <script src="/js/index.js" type="module" defer></script>
</head>
<body>
<div class="container">
    <!-- Left Sidebar -->
    <%@ include file="components/sidebar.jsp" %> <!-- 네비게이션 메뉴 -->

    <!-- Main Feed Section -->
    <main class="feed">
        <!-- Stories Section -->
        <%@ include file="components/stories.jsp" %> <!-- 상단 스토리 섹션 -->

        <!-- Posts Section -->
        <%@ include file="components/feed.jsp" %> <!-- 게시물 피드 섹션 -->
    </main>

    <!-- Right Sidebar (Suggestions) -->
    <%@ include file="components/suggestions.jsp" %> <!-- 추천 사용자 섹션 -->


    <%@ include file="components/create-post-modal.jsp" %> <!-- 모달 섹션 -->
</div>
</body>
</html>
