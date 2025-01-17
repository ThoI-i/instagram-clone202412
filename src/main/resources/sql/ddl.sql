-- 데이터베이스 생성
CREATE DATABASE instagram_clone
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

-- 게시물 테이블
CREATE TABLE posts
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    content    TEXT,
    writer     VARCHAR(100) NOT NULL,
    view_count INT       DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 게시물 이미지 테이블
CREATE TABLE post_images
(
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id     BIGINT       NOT NULL,
    image_url   VARCHAR(255) NOT NULL,
    image_order INT          NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE
);

-- ==============
-- 해시태그 테이블
CREATE TABLE hashtags
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 게시물-해시태그 연결 테이블
CREATE TABLE post_hashtags
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id    BIGINT NOT NULL,
    hashtag_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES hashtags (id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_hashtag (post_id, hashtag_id)
);

-- 인덱스 추가
CREATE INDEX idx_hashtag_name ON hashtags (name);
CREATE INDEX idx_post_hashtags_post_id ON post_hashtags (post_id);
CREATE INDEX idx_post_hashtags_hashtag_id ON post_hashtags (hashtag_id);


-- 회원 테이블
CREATE TABLE users
(
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    username          VARCHAR(30) NOT NULL UNIQUE,
    password          VARCHAR(100),        -- OAuth2 사용자는 password가 null일 수 있음
    email             VARCHAR(100) UNIQUE, -- 이메일과 전화번호 중 하나는 필수
    phone             VARCHAR(20) UNIQUE,
    name              VARCHAR(50) NOT NULL,
    profile_image_url VARCHAR(255),
    role              VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    refresh_token     VARCHAR(255),        -- JWT Refresh Token
    created_at        TIMESTAMP            DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP            DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at     TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_username (username)
);

-- 기존 피드 와 해시태그 모두 삭제
DELETE FROM post_hashtags;
DELETE FROM hashtags;
DELETE FROM posts;

COMMIT;

-- posts 테이블 수정
ALTER TABLE posts
    DROP COLUMN writer, -- 기존 writer 컬럼 제거
    ADD COLUMN member_id BIGINT NOT NULL, -- 회원 ID 컬럼 추가
    ADD CONSTRAINT fk_posts_member -- FK 제약조건 추가
        FOREIGN KEY (member_id)
            REFERENCES users (id)
            ON DELETE CASCADE;

-- 인덱스 추가
CREATE INDEX idx_posts_member_id ON posts (member_id);


-- 좋아요 테이블
CREATE TABLE post_likes
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id    BIGINT NOT NULL,
    member_id  BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users (id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_member (post_id, member_id)
);

-- 인덱스 추가
CREATE INDEX idx_post_likes_post_id ON post_likes (post_id);
CREATE INDEX idx_post_likes_member_id ON post_likes (member_id);