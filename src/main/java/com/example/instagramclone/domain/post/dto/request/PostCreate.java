package com.example.instagramclone.domain.post.dto.request;

import com.example.instagramclone.domain.post.entity.Post;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// 피드 생성시 클라이언트가 보낸 JSON데이터를 파싱하고 검증
@Getter @Setter @ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class PostCreate {

    @NotBlank(message = "작성자 정보는 필수입니다.")
    private String writer;

    @Size(max = 2200, message = "피드 내용은 최대 2200자까지 입력 가능합니다.")
    private String content;

    // 이미지 목록
    private List<MultipartFile> images;

    // 엔터티 변환 편의메서드
    public Post toEntity() {
        return Post.builder()
                .writer(this.writer)
                .content(this.content)
                .build();
    }
}