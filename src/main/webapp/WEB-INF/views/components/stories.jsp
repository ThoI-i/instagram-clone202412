<%-- src/main/webapp/WEB-INF/views/components/stories.jsp --%>

<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>


<div class="stories-container">
    <div class="stories-list">

        <c:forEach var="i" begin="1" end="14">
            <!-- Story Item -->
            <div class="story-item">
                <div class="story-avatar">
                    <img src="/images/default-profile.svg" alt="user's story">
                    <div class="story-ring"></div>
                </div>
                <span class="story-username">user${i}</span>
            </div>
        </c:forEach>


        <!-- Navigation Buttons -->
        <button class="stories-prev" aria-label="이전 스토리">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button class="stories-next" aria-label="다음 스토리">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    </div>
</div>