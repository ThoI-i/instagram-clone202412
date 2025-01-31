
package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.post.dto.request.PostCreate;
import com.example.instagramclone.domain.post.dto.response.FeedResponse;
import com.example.instagramclone.domain.post.dto.response.PostDetailResponse;
import com.example.instagramclone.domain.post.dto.response.PostResponse;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.PostException;
import com.example.instagramclone.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@Slf4j
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    // 피드 목록 조회 요청
    @GetMapping
    public ResponseEntity<FeedResponse<PostResponse>> getFeeds(
            @AuthenticationPrincipal String username,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size
    ) {

        FeedResponse<PostResponse> allFeeds = postService.findAllFeeds(username, size, page);

        return ResponseEntity
                .ok()
                .body(allFeeds);
    }

    // 피드 생성 요청
    @PostMapping
    public ResponseEntity<?> createFeed(
            // 피드 내용, 작성자 이름 JSON { "writer": "", "content": "" } -> 검증
            @RequestPart("feed") @Valid PostCreate postCreate
            // 이미지 파일 목록 multipart-file
            , @RequestPart("images") List<MultipartFile> images
            , @AuthenticationPrincipal String username // 인증된 사용자 이름
    ) {

        // 파일 업로드 개수 검증
        if (images.size() > 10) {
            throw new PostException(ErrorCode.TOO_MANY_FILES, "파일의 개수는 10개를 초과할 수 없습니다.");
        }

        images.forEach(image -> {
            log.info("uploaded image file name - {}", image.getOriginalFilename());
        });

        postCreate.setImages(images);
        log.info("feed create request: POST - {}", postCreate);

        // 이미지와 JSON을 서비스클래스로 전송
        Long postId = postService.createFeed(postCreate, username);

        // 응답 메시지 JSON 생성 { "id": 23, "message": "save success" }
        Map<String, Object> response = Map.of(
                "id", postId
                , "message", "save success"
        );

        return ResponseEntity
                .ok()
                .body(response);
    }

    // 피드 상세보기 단일 조회 API
    @GetMapping("/{postId}")
    public ResponseEntity<?> getDetail(
            @PathVariable Long postId
            , @AuthenticationPrincipal String username
    ) {

        PostDetailResponse postDetails = postService.getPostDetails(postId, username);

        return ResponseEntity.ok().body(postDetails);
    }

}