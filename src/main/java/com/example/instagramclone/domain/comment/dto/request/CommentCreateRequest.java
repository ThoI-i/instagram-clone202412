package com.example.instagramclone.domain.comment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter @Setter
@ToString
public class CommentCreateRequest {

    @NotBlank(message = "댓글 내용을 입력하세요.")
    @Size(max = 1000, message = "댓글을 1000자를 초과할 수 없습니다.")
    private String content;
}