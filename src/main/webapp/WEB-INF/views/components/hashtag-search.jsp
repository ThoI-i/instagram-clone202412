<%-- src/main/webapp/WEB-INF/views/hashtag-search.jsp --%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>검색 결과</title>

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">

    <link rel="stylesheet" href="/css/index.css">
    <link rel="stylesheet" href="/css/sidebar.css">
    <link rel="stylesheet" href="/css/modal.css">
    <link rel="stylesheet" href="/css/feed-detail-modal.css">
    <link rel="stylesheet" href="/css/like.css">
    <link rel="stylesheet" href="/css/search-modal.css">
    <link rel="stylesheet" href="/css/hashtag-search.css">

    <script src="/js/components/hashtag-search-page.js" type="module" defer></script>
</head>
<body>
<div class="container">
    <%@ include file="./sidebar.jsp" %>

    <main class="explore-container">
        <header class="explore-header">
            <div class="hashtag-info">
                <h1>#해시태그</h1>
            </div>
        </header>

        <div class="posts-grid">
            <!-- 게시물이 여기에 동적으로 추가됨 -->
        </div>

        <!-- 로딩 스피너 -->
        <div class="grid-loader">
            <div class="spinner" style="display: none;">
                <i class="fa-solid fa-spinner fa-spin"></i>
            </div>
        </div>
    </main>
</div>

<%@ include file="./feed-detail-modal.jsp" %>
<%@ include file="./create-post-modal.jsp" %>
<%@ include file="./search-modal.jsp" %>
</body>
</html>