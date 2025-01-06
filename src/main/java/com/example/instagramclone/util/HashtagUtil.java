package com.example.instagramclone.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@Slf4j
public class HashtagUtil {

    // 정규표현식을 정의. '#'으로 시작하고 뒤에 영문, 숫자, 밑줄, 또는 한글(가-힣)이 이어지는 패턴을 찾음
    private static final Pattern HASHTAG_PATTERN = Pattern.compile("#(\\w+|[가-힣]+)");

    // 주어진 피드 내용에서 해시태그를 중복없이 추출해서 리턴하는 메서드
    public Set<String> extractHashtags(String content) {

        // 해시태그들을 모아놓을 Set을 생성
        Set<String> hashtags = new HashSet<>();

        // 피드내용이 비어있으면 빈 셋을 리턴
        if (content == null || content.isEmpty()) {
            return hashtags;
        }

        // 해시태그들을 추출해서 Set에 저장
        // Matcher: 패턴에 걸린 단어들을 조작할 수 있는 객체
        Matcher matcher = HASHTAG_PATTERN.matcher(content);

        // 해시태그가 발견될 동안에
        while (matcher.find()) {
            // 실제 해시태그를 하나씩 추출
            String hashtag = matcher.group();
            log.debug("hashtag: {}", hashtag);

            // 해당 해시태그를 #을 떼고 Set에 저장
            hashtags.add(hashtag.substring(1));
        }

        return hashtags;
    }

}