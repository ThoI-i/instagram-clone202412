package com.example.instagramclone.service;

import com.example.instagramclone.domain.member.dto.response.SuggestedMemberResponse;
import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.MemberException;
import com.example.instagramclone.repository.FollowRepository;
import com.example.instagramclone.repository.MemberRepository;
import com.example.instagramclone.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class SuggestionService {

    private final MemberRepository memberRepository;
    private final FollowRepository followRepository;
    private final PostRepository postRepository;

    /**
     * 추천 사용자 목록 조회
     * - 팔로우하지 않은 사용자 중에서
     * - 최근 가입했거나 활동이 많은 사용자를 추천
     */
    public List<SuggestedMemberResponse> getSuggestedMembers(String username, int size) {

        // 1. 현재 로그인한 사용자 찾기
        Member currentMember = findByUsername(username);

        // 2. 추천할 사용자 목록 조회
        List<Member> suggestedMembers =
                memberRepository.findMembersToSuggest(currentMember.getId(), size);

        // 3. 각 사용자별로 추가 정보를 조회하여 응답 DTO 구성
        return suggestedMembers.stream()
                .map(member -> {
                    // 3-1. 팔로워 수와 게시물 수 조회
                    long followerCount = followRepository.countFollowByType(member.getId(), "follower");
                    long feedCount = postRepository.countByMemberId(member.getId());

                    // 3-2. 함께 아는 친구들 (공통 팔로잉) 찾기
                    List<String> commonFollowers = followRepository.findCommonFollowingUsernames(
                            member.getId(),
                            currentMember.getId()
                    );

                    // 3-3. 추천 이유 문구 생성
                    String suggestionReason = createSuggestionReason(
                            commonFollowers,
                            followerCount,
                            feedCount
                    );

                    // 3-4. 응답 DTO 생성
                    return SuggestedMemberResponse.of(
                            member,
                            suggestionReason
                    );

                })
                .collect(Collectors.toList())
                ;
    }

    /**
     * 추천 이유 문구 생성
     */
    private String createSuggestionReason(
            List<String> commonFollowers,
            long followerCount,
            long feedCount
    ) {
        if (!commonFollowers.isEmpty()) {
            // 함께 아는 친구가 있는 경우
            if (commonFollowers.size() == 1) {
                return commonFollowers.get(0) + "님이 팔로우합니다";
            } else {
                return commonFollowers.get(0) + "님 외 " +
                        (commonFollowers.size() - 1) + "명이 팔로우합니다";
            }
        } else if (followerCount > 2) {
            // 팔로워가 많은 인기 계정인 경우
            return "인기 있는 계정";
        } else if (feedCount > 2) {
            // 게시물이 많은 활성 사용자인 경우
            return "활발한 활동";
        } else {
            // 기본 메시지
            return "회원님을 위한 추천";
        }
    }


    public Member findByUsername(String username) {
        return memberRepository.findByUsername(username)
                .orElseThrow(() -> new MemberException(ErrorCode.MEMBER_NOT_FOUND));
    }


}