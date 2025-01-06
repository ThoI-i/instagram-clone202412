package com.example.instagramclone.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Set;

@SpringBootTest
class HashtagUtilTest {

    @Autowired
    HashtagUtil hashtagUtil;

    @Test
    @DisplayName("해시태그가 포함된 피드 내용에서 해시태그들을 중복없이 추출한다.")
    void test() {
        //given
        String content = """
                    #가위바위보 했다가 져서 #친구 한테 #떡뽀끼 쏨 ㅠㅠ
                    #친구 가 재수없게 웃어서 짜증남 #슬픔 #가위바위보 #개고수 님
                    #꿀팁 전수좀요 
                """;
        //when
        Set<String> hashtags = hashtagUtil.extractHashtags(content);
        //then
        System.out.println("hashtags = " + hashtags);
    }

}