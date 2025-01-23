package com.example.instagramclone.controller.rest;

import com.example.instagramclone.domain.member.dto.response.SuggestedMemberResponse;
import com.example.instagramclone.service.SuggestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/suggestions")
@RequiredArgsConstructor
public class SuggestionController {

    private final SuggestionService suggestionService;

    /**
     * 추천 사용자 목록 조회
     * - 메인 피드 우측의 "회원님을 위한 추천" 섹션에서 사용
     */
    @GetMapping
    public ResponseEntity<List<SuggestedMemberResponse>> getSuggestions(
            @RequestParam(defaultValue = "5") int size,
            @AuthenticationPrincipal String username
    ) {
        log.info("Get suggested members for user: {}", username);

        List<SuggestedMemberResponse> suggestions =
                suggestionService.getSuggestedMembers(username, size);

        return ResponseEntity.ok().body(suggestions);
    }
}