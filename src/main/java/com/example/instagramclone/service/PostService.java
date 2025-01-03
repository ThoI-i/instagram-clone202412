package com.example.instagramclone.service;

import com.example.instagramclone.domain.post.dto.request.PostCreate;
import com.example.instagramclone.domain.post.dto.response.PostImageResponse;
import com.example.instagramclone.domain.post.dto.response.PostResponse;
import com.example.instagramclone.domain.post.entity.Post;
import com.example.instagramclone.domain.post.entity.PostImage;
import com.example.instagramclone.repository.PostRepository;
import com.example.instagramclone.util.FileUploadUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository; // db에 피드내용 저장, 이미지저장
    private final FileUploadUtil fileUploadUtil; // 로컬서버에 이미지 저장


    // 피드 목록조회 중간처리
    public List<PostResponse> findAllFeeds() {
        // 전체 피드 조회
        return postRepository.findAll()
                .stream()
                .map(feed -> {
                    feed.setImages(postRepository.findImagesByPostId(feed.getId()));
                    return PostResponse.from(feed);
                })
                .collect(Collectors.toList());
    }


    // 피드 생성 DB에 가기 전 후 중간처리
    public Long createFeed(PostCreate postCreate) {

        // entity 변환
        Post post = postCreate.toEntity();

        // 피드게시물을 posts테이블에 insert
        postRepository.saveFeed(post);

        // 이미지 관련 처리를 모두 수행
        Long postId = post.getId();

        processImages(postCreate.getImages(), postId);

        // 컨트롤러에게 결과 반환
        return postId;
    }

    private void processImages(List<MultipartFile> images, Long postId) {

        log.debug("start process Image!!");
        // 이미지들을 서버(/upload 폴더)에 저장
        if (images != null && !images.isEmpty()) {
            log.debug("save process Image!!");

            int order = 1; // 이미지 순서
            for (MultipartFile image : images) {
                // 파일 서버에 저장
                String uploadedUrl = fileUploadUtil.saveFile(image);

                log.debug("success to save file at: {}", uploadedUrl);
                // 이미지들을 데이터베이스 post_images 테이블에 insert
                PostImage postImage = PostImage.builder()
                        .postId(postId)
                        .imageUrl(uploadedUrl)
                        .imageOrder(order++)
                        .build();

                postRepository.saveFeedImage(postImage);
            }
        }

    }

}