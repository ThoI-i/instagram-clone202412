package com.example.instagramclone.repository;

import com.example.instagramclone.domain.hashtag.dto.response.HashtagSearchResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class HashtagRepositoryTest {

    @Autowired
    HashtagRepository hashtagRepository;

    @Test
    @DisplayName("해시태그의 특정 단어를 입력하면 최대 5개의 해시태그와 그 피드수가 조회된다.")
    void searchHashtagTest() {
        //given
        String keyword = "아";
        //when
        List<HashtagSearchResponse> results = hashtagRepository.searchHashtagsByKeyword(keyword);
        //then
        assertThat(results).isNotEmpty();
        assertThat(results.get(0).getHashtag()).startsWith(keyword);

        results.forEach(System.out::println);
    }

}