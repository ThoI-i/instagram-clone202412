<%-- src/main/webapp/WEB-INF/views/components/feed-detail-modal.jsp --%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="post-detail-modal" style="display: none;">
    <!-- Modal Backdrop -->
    <div class="modal-backdrop"></div>

    <!-- Close Button -->
    <button class="modal-close-button">
        <i class="fa-solid fa-xmark"></i>
    </button>

    <!-- Feed Navigation -->
    <div class="modal-navigation-buttons">
        <button class="modal-prev-button">
            <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button class="modal-next-button">
            <i class="fa-solid fa-chevron-right"></i>
        </button>
    </div>

    <!-- Modal Content -->
    <div class="modal-content">
        <!-- Image Carousel -->
        <div class="modal-carousel-container">
            <div class="carousel-container">
                
            </div>
        </div>

        <!-- Post Details Sidebar -->
        <div class="modal-sidebar">
            <!-- Post Header -->
            <header class="post-header">
                <div class="post-user-info">
                    <div class="post-profile-image">
                        <img src="/images/default-profile.svg" alt="Profile Image">
                    </div>
                    <a href="#" class="post-username"></a>
                </div>
                <button type="button" class="post-options-button">
                    <i class="fa-solid fa-ellipsis"></i>
                </button>
            </header>

            <!-- Comments Container -->
            <div class="comments-container">
                <!-- Original Post -->
                <div class="comment-item post-caption-container">
                    <div class="post-profile-image">
                        <img src="/images/default-profile.svg" alt="Profile Image">
                    </div>
                    <div class="comment-content">
                        <div>
                            <a href="#" class="post-username"></a>
                            <span class="post-caption"></span>
                        </div>
                        <div class="post-time"></div>
                    </div>
                </div>

                <!-- Comments List -->
                <div class="comments-list">
                    <!-- Comments will be dynamically added here -->
                </div>
            </div>

            <!-- Post Actions -->
            <div class="post-actions">
                <div class="action-buttons">
                    <div class="action-buttons-left">
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
                <!-- Likes Count -->
                <div>
                    좋아요 <span class="likes-count">0</span>개
                </div>
                <!-- Post Time -->
                <div class="post-time"></div>
            </div>

            <!-- Comment Form -->
            <form class="comment-form" autocomplete="off">
                <input type="text"
                       placeholder="댓글 달기..."
                       class="comment-input"
                       name="content">
                <button type="submit"
                        class="comment-submit-btn"
                        disabled>
                    게시
                </button>
            </form>
        </div>
    </div>
</div>