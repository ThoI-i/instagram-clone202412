package com.example.instagramclone.domain.hashtag.entity;

import lombok.*;

import java.time.LocalDateTime;

@Getter @Setter @ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hashtag {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
}