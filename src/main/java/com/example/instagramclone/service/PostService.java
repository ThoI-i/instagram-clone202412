package com.example.instagramclone.service;

import com.example.instagramclone.domain.post.dto.request.PostCreate;
import com.example.instagramclone.domain.post.entity.Post;
import com.example.instagramclone.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    // 피드 생성 DB에 가기 전 후 중간처리
    public void createFeed(PostCreate postCreate) {

        // entity 변환
        Post post = postCreate.toEntity();

        // 피드게시물을 posts테이블에 insert
        postRepository.saveFeed(post);

        // 이미지들을 서버(/upload 폴더)에 저장

        // 이미지들을 데이터베이스 post_images 테이블에 insert

        // 컨트롤러에게 결과 반환
    }

}