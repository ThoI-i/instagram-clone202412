package com.example.instagramclone.repository;

import com.example.instagramclone.domain.member.entity.Member;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface MemberRepository {

    // 회원 정보 생성
    void insert(Member member);

    // 중복 체크용 조회 메서드
    Optional<Member> findByEmail(String email);
    Optional<Member> findByPhone(String phone);
    Optional<Member> findByUsername(String username);
}