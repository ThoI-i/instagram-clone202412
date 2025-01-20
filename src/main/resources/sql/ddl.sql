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

SELECT * FROM posts;
SELECT * FROM post_images;

DELETE FROM posts;

SELECT
	P.*
    , I.*
FROM posts P
JOIN post_images I
ON P.id = I.post_id
;



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

-- 게시물 해시태그 연결 테이블
CREATE TABLE post_hashtags
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id    BIGINT NOT NULL,
    hashtag_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (hashtag_id) REFERENCES hashtags (id) ON DELETE CASCADE,
    UNIQUE KEY unique_post_hashtag (post_id, hashtag_id)
)
;

-- 특정 단어로 시작하는 해시태그 검색하기(A)
SELECT
	h.name
FROM hashtags h
WHERE name LIKE '나%'
LIMIT 5
;

-- 각 해시태그들이 달린 게시물 수 확인하기(B)
SELECT
	hashtag_id
    , COUNT(post_id)
FROM post_hashtags
GROUP BY hashtag_id
ORDER BY hashtag_id
;

-- (A) + (B)
SELECT
	 p.name
	, COUNT(ph.post_id) feed_count
FROM post_hashtags ph
RIGHT OUTER JOIN hashtags p
ON ph.hashtag_id = p.id
WHERE p.name LIKE '나%' -- "나_" 로 시작하는 단어찾기
GROUP BY p.name
ORDER BY feed_count DESC
LIMIT 3
;

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

SELECT * FROM users;
DELETE FROM users;
COMMIT;

SELECT * FROM users
-- WHERE username = 'test';
WHERE phone = 'test';
WHERE email = 'test';
;

SELECT * FROM posts;
SELECT * FROM hashtags;
SELECT * FROM post_hashtags;

DELETE FROM posts;
DELETE FROM hashtags;
DELETE FROM post_hashtags;

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

SELECT
	p.*
    , u.username
    , u.profile_image_url
FROM posts p
JOIN users u
ON p.member_id = u.id
;

SELECT * FROM users
WHERE username = 'mamel';

SELECT * FROM users;
SELECT * FROM posts;

SELECT
 COUNT(*)
FROM posts
WHERE member_id = (
	SELECT id
    FROM users
    WHERE username = ''
)
;

-- 특정 회원 피드의 id와 대표 이미지 목록 조회
SELECT
	p.id
    , pi.image_url
FROM posts p
JOIN ( -- JOIN 할 횟수를 미리 줄여둠 → 연산 횟수 감소↓ = 최적화
	SELECT post_id, image_url
    FROM post_images
    WHERE image_order = 1
) pi
ON pi.id = pi.post_id
WHERE member_id = (
	SELECT id
    FROM users
    WHERE username = ''
)
AND pi.image_order = 1
ORDER BY p.created_at DESC
;

SELECT * FROM post_images; -- 대표 이미지: image_order가 1인 이미지

UPDATE users
SET profile_image_url = '.jpg'
WHERE user_name = '';

SELECT
	p.id
    , p.content
    , u.username
    , u.profile_image_url
    , pi.image_url
    , pi.image_order
FROM posts p
INNER JOIN users u
ON p.member_id = u.id
INNER JOIN post_images pi
ON p.id = pi.post_id
WHERE p.id = 61
ORDER BY pi.image_order
;


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

SELECT * FROM post_likes;

-- SELECT
--             p.id,
--             pi.image_url as mainThumbnail
--         FROM posts p
--         INNER JOIN
--             (SELECT post_id, image_url
--             FROM post_images
--             WHERE image_order = 1) pi
--         ON p.id = pi.post_id
--         WHERE p.member_id = #{memberId}
-- 		ORDER BY p.created_at DESC
-- ;

--  데이터가 없을 시 NULL로 표기
SELECT
	p.id,
	pi.image_url as mainThumbnail,
    l.likeCount
FROM posts p
INNER JOIN
	(SELECT post_id, image_url
	FROM post_images
	WHERE image_order = 1) pi
ON p.id = pi.post_id

JOIN (
	SELECT post_id, COUNT(*) AS likeCount
    FROM post_likes
    GROUP BY post_id
) l
ON p.id = l.post_id

WHERE p.member_id = 14
ORDER BY p.created_at DESC
;

--  NULL을 0으로 바꿈
SELECT
	p.id,
	pi.image_url as mainThumbnail,
    NVL(l.likeCount, 0) AS likeCount
FROM posts p
INNER JOIN
	(SELECT post_id, image_url
	FROM post_images
	WHERE image_order = 1) pi
ON p.id = pi.post_id

LEFT JOIN (
	SELECT post_id, COUNT(*) AS likeCount
    FROM post_likes
    GROUP BY post_id
) l
ON p.id = l.post_id

WHERE p.member_id = 14
ORDER BY p.created_at DESC
;

CREATE TABLE comments
(
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id    BIGINT NOT NULL,
    member_id  BIGINT NOT NULL,
    content    TEXT   NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users (id) ON DELETE CASCADE
);

-- 조회 성능을 위한 인덱스 추가
CREATE INDEX idx_comments_post_id ON comments (post_id);
CREATE INDEX idx_comments_member_id ON comments (member_id);

SELECT * FROM posts;
SELECT * FROM comments;
