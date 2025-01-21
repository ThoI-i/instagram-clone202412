package com.example.instagramclone.repository;

import com.example.instagramclone.domain.follow.entity.Follow;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FollowRepository {

    // 팔로우 처리
    void insert(Follow follow);

    // 언팔로우 처리
    void delete(
            @Param("followerId") Long followerId
            , @Param("followingId") Long followingId
    );

    // 팔로우 여부 확인
    boolean doesFollowExist(
            @Param("followerId") Long followerId
            , @Param("followingId") Long followingId
    );

    /**
     * 특정 유저의 팔로워 수 / 팔로잉 수 조회
     * @param userId - 현재 팔로잉 / 팔로워 수를 구하려는 회원의 ID
     * @param type - 현재 구하려는 정보가 팔로잉 수인지 팔로워 수인지 구분
     * @return - 해당 타입의 숫자
     */
    long countFollowByType(
            @Param("userId") Long userId
            , @Param("type") String type
    );

}