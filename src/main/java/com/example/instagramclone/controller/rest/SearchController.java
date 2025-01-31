package com.example.instagramclone.controller.rest;

import com.example.instagramclone.service.SearchService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
@Slf4j
@RequiredArgsConstructor
public class SearchController {

    private final SearchService searchService;

    @GetMapping("/members")
    public ResponseEntity<?> searchMembers(
            @RequestParam String keyword
            , @AuthenticationPrincipal String username
    ) {

        return ResponseEntity.ok()
                .body(searchService.searchMembers(keyword, username));
    }
}