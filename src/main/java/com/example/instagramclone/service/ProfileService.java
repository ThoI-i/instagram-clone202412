package com.example.instagramclone.service;

import com.example.instagramclone.domain.member.dto.response.MeResponse;
import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.MemberException;
import com.example.instagramclone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 개인 프로필 처리
@Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class ProfileService {

    private final MemberRepository memberRepository;

    /**
     * 로그인한 유저 정보를 반환하는 처리
     * @param username - 인증된 사용자 이름 (스프링 시큐리티에 의해 컨트롤러에서 받아옴)
     * @return 인증된 사용자의 프로필정보 (이름, 사용자계정, 프로필사진)
     */
    @Transactional(readOnly = true)   // SELECT만 하고 있을 경우
    public MeResponse getLoggedInUser(String username) {
        Member foundMember = memberRepository.findByUsername(username)
                .orElseThrow(
                        () -> new MemberException(ErrorCode.MEMBER_NOT_FOUND)
                );

        return MeResponse.from(foundMember);
    }
}