package com.example.instagramclone.repository;

import com.example.instagramclone.domain.member.entity.Member;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberRepository {

    // 회원 정보 생성
    void insert(Member member);
}