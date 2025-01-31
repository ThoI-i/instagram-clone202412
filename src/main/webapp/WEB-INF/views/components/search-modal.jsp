<%-- src/main/webapp/WEB-INF/views/components/search-modal.jsp --%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<div class="search-modal-backdrop" style="display: none;"></div>
<div class="search-modal" style="display: none;">

    <!-- Modal Backdrop -->
    <!-- Modal Content -->
    <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
            <h2>검색</h2>
            <button type="button" class="modal-close">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <!-- Search Input -->
        <div class="search-input-wrapper">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
                    type="text"
                    class="search-input"
                    placeholder="검색"
                    autocomplete="off"
            >
            <button type="button" class="clear-button" style="display: none;">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <!-- Search Results -->
        <div class="search-results">
            <!-- Recent Searches -->
            <div class="recent-searches">
                <div class="results-header">
                    <h3>최근 검색 항목</h3>
                </div>
                <div class="no-results">
                    최근 검색 내역 없음
                </div>
            </div>


            <!-- Skeleton Loading -->
            <div class="skeleton-loading" style="display: none;">
                <c:forEach begin="1" end="13">
                    <div class="skeleton-item">
                        <div class="skeleton-avatar"></div>
                        <div class="skeleton-info">
                            <div class="skeleton-line-sm"></div>
                            <div class="skeleton-line"></div>
                        </div>
                    </div>
                </c:forEach>
            </div>

            <!-- Search Result List (Initially Hidden) -->
            <div class="search-result-list" style="display: none;">
                <!-- Results will be dynamically added here -->

            </div>

        </div>
    </div>
</div>