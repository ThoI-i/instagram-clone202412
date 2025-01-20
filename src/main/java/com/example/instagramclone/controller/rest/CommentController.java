package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.comment.dto.request.CommentCreateRequest;
import com.example.instagramclone.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
@Slf4j
public class CommentController {

    private final CommentService commentService;

    // 댓글 작성 API
    @PostMapping
    public ResponseEntity<?> createComment(
            @PathVariable Long postId
            , @AuthenticationPrincipal String username
            , @RequestBody @Valid CommentCreateRequest commentCreateRequest
    ) {

        Map<String, Object> commentResponse
                = commentService.createComment(postId, username, commentCreateRequest.getContent());

        return ResponseEntity.ok().body(commentResponse);
    }

}