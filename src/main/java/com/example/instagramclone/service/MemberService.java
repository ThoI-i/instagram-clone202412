package com.example.instagramclone.service;

import com.example.instagramclone.domain.member.dto.request.SignUpRequest;
import com.example.instagramclone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional // 트랜잭션 처리
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    // 회원가입 중간처리
    public void signUp(SignUpRequest signUpRequest) {

        // 회원정보를 데이터베이스에 저장
        memberRepository.insert(signUpRequest.toEntity());


    }
}