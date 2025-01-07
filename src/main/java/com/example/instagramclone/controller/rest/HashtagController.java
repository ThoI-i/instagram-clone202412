package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.hashtag.dto.response.HashtagSearchResponse;
import com.example.instagramclone.service.HashtagService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/hashtags")
@Slf4j
@RequiredArgsConstructor
public class HashtagController {

    private final HashtagService hashtagService;

    // ?keyword=아
    @GetMapping("/search")
    public ResponseEntity<?> searchHashtag(@RequestParam String keyword) {
        log.info("Searching hashtags with keyword: {}", keyword);
        List<HashtagSearchResponse> responses = hashtagService.searchHashtags(keyword);

        return ResponseEntity
                .ok()
                .body(responses);
    }

}