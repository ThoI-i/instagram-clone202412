package com.example.instagramclone.service;

import com.example.instagramclone.domain.member.dto.response.MemberSearchResponse;
import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.repository.FollowRepository;
import com.example.instagramclone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class SearchService {

    private final MemberRepository memberRepository;
    private final FollowRepository followRepository;

    // 사용자 검색 기능
    @Transactional(readOnly = true)
    public List<MemberSearchResponse> searchMembers(String keyword, String username) {

        // 로그인한 회원 조회
        Member currentMember = memberRepository.findByUsername(username).orElseThrow();

        // 검색어를 통한 조회 (최대 5명)
        List<Member> members = memberRepository.searchMembers(keyword);

        return members.stream()
                .map(member -> MemberSearchResponse.of(
                        member
                        , followRepository.findCommonFollowingUsernames(member.getId(), currentMember.getId())
                ))
                .collect(Collectors.toList());
    }
}