package com.example.instagramclone.service;

import com.example.instagramclone.domain.follow.entity.Follow;
import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.MemberException;
import com.example.instagramclone.repository.FollowRepository;
import com.example.instagramclone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final MemberRepository memberRepository;

    // 팔로우 / 언팔로우 토글
    public Map<String, Object> toggleFollow(String followingUserName, String followerUserName) {

        // 팔로잉한 회원정보와 팔로우당한 회원정보 조회
        Member following = getMember(followingUserName);
        Member follower = getMember(followerUserName);


        Long followerId = follower.getId();
        Long followingId = following.getId();

        // 자기 자신을 팔로우하는 것을 방지
        if (followerId.equals(followingId)) {
            throw new MemberException(ErrorCode.SELF_FOLLOW);
        }

        // 팔로우 여부 확인
        boolean isFollow = followRepository.doesFollowExist(followerId, followingId);

        if (isFollow) { // 이미 팔로우를 한 상태 - 언팔
            followRepository.delete(followerId, followingId);
        } else { // 아직 팔로우를 안 한 상태
            followRepository.insert(
                    Follow.builder()
                            .followingId(followingId)
                            .followerId(followerId)
                            .build()
            );
        }

        // 팔로우 / 언팔로우 완료 시 응답할 데이터
        // 팔로우 상태 데이터
        return Map.of(
                "following", !isFollow,
                // 내가 팔로우/ 언팔한 상대방의 팔로워 카운트를 갱신해주기 위한 데이터
                "followerCount", followRepository.countFollowByType(followerId, "follower")
        );
    }

    private Member getMember(String username) {
        return memberRepository.findByUsername(username).orElseThrow(
                () -> new MemberException(ErrorCode.MEMBER_NOT_FOUND)
        );
    }
}