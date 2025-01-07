package com.example.instagramclone.service;

import com.example.instagramclone.domain.hashtag.dto.response.HashtagSearchResponse;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.PostException;
import com.example.instagramclone.repository.HashtagRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class HashtagService {

    private final HashtagRepository hashtagRepository;

    // 해시태그 추천 목록 불러오기 중간처리
    @Transactional(readOnly = true)  // 조회 최적화 - 갱신에 대한 준비를 하지 않아서 리소스가 낭비되지 않음
    public List<HashtagSearchResponse> searchHashtags(String keyword) {

        // 검색어가 null이거나 빈문자열이면 예외를 발생
        if (keyword == null || keyword.trim().isEmpty()) {
            throw new PostException(ErrorCode.INVALID_HASHTAG_SEARCH, "검색어를 입력하세요");
        }

        // 검색어 길이 제한
        if (keyword.length() > 20) {
            throw new PostException(ErrorCode.INVALID_HASHTAG_SEARCH, "검색어는 20자를 초과할 수 없습니다.");
        }

        // 만약 클라이언트가 해시태그에 #을 안떼고 줬을 경우
        keyword = keyword.startsWith("#") ? keyword.substring(1) : keyword;

        return hashtagRepository.searchHashtagsByKeyword(keyword);
    }
}