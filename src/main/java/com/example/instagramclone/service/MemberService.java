package com.example.instagramclone.service;

import com.example.instagramclone.domain.member.dto.request.SignUpRequest;
import com.example.instagramclone.domain.member.dto.response.DuplicateCheckResponse;
import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.MemberException;
import com.example.instagramclone.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional // 트랜잭션 처리
@RequiredArgsConstructor
public class MemberService {

    private final PasswordEncoder passwordEncoder;
    private final MemberRepository memberRepository;

    // 회원가입 중간처리
    public void signUp(SignUpRequest signUpRequest) {

        // 순수 비밀번호를 꺼내서 암호화
        String rawPassword = signUpRequest.getPassword();
        // 암호화된 패스워드
        String encodedPassword = passwordEncoder.encode(rawPassword);

        // 회원정보를 엔터티로 변환
        Member newMember = signUpRequest.toEntity();
        // 패스워드를 인코딩패스워드로 교체
        newMember.setPassword(encodedPassword);

        // DB에 전송
        memberRepository.insert(newMember);
    }

    /**
     * 중복 검사 통합 처리 (이메일, 전화번호, 유저네임)
     *
     * @param type - 검사할 값의 타입 (email, phone, username)
     * @param value - 실제로 중복을 검사할 값
     */
    public DuplicateCheckResponse checkDuplicate(String type, String value) {
        switch (type) {
            case "email":
                // 중복된 경우를 클라이언트에게 알려야 함
                return memberRepository.findByEmail(value)
                        .map(m -> DuplicateCheckResponse.unavailable("이미 사용 중인 이메일입니다."))
                        .orElse(DuplicateCheckResponse.available());
            case "phone":
                return memberRepository.findByPhone(value)
                        .map(m -> DuplicateCheckResponse.unavailable("이미 사용 중인 전화번호입니다."))
                        .orElse(DuplicateCheckResponse.available());
            case "username":
                return memberRepository.findByUsername(value)
                        .map(m -> DuplicateCheckResponse.unavailable("이미 사용 중인 사용자 이름입니다."))
                        .orElse(DuplicateCheckResponse.available());
            default:
                throw new MemberException(ErrorCode.INVALID_SIGNUP_DATA);
        }
    }
}