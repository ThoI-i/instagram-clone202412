package com.example.instagramclone.service;

import com.example.instagramclone.domain.follow.dto.response.FollowResponse;
import com.example.instagramclone.domain.follow.dto.response.FollowStatus;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class FollowServiceTest {

    @Autowired
    FollowService followService;

    @Test
    @DisplayName("특정유저의 팔로워 목록을 조회한다.")
    void getFollowers() {
        //given
        String target = "mamel";
        String loginName = "kuromi";
        //when
        List<FollowResponse> followers
                = followService.getFollows(target, loginName, FollowStatus.FOLLOWER);
        //then
        System.out.println("\n\n====================");

        followers.forEach(System.out::println);

        System.out.println("====================\n\n");

    }

    @Test
    @DisplayName("특정유저의 팔로잉 목록을 조회한다.")
    void getFollowing() {
        //given
        String target = "mamel";
        String loginName = "kuromi";
        //when
        List<FollowResponse> followings
                = followService.getFollows(target, loginName, FollowStatus.FOLLOWING);
        //then
        System.out.println("\n\n====================");

        followings.forEach(System.out::println);

        System.out.println("====================\n\n");

    }


}