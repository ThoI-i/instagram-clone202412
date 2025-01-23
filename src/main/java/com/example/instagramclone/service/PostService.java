package com.example.instagramclone.service;

import com.example.instagramclone.domain.comment.dto.response.CommentResponse;
import com.example.instagramclone.domain.hashtag.entity.Hashtag;
import com.example.instagramclone.domain.hashtag.entity.PostHashtag;
import com.example.instagramclone.domain.like.dto.response.LikeStatusResponse;
import com.example.instagramclone.domain.member.entity.Member;
import com.example.instagramclone.domain.post.dto.request.PostCreate;
import com.example.instagramclone.domain.post.dto.response.FeedResponse;
import com.example.instagramclone.domain.post.dto.response.PostDetailResponse;
import com.example.instagramclone.domain.post.dto.response.PostResponse;
import com.example.instagramclone.domain.post.entity.Post;
import com.example.instagramclone.domain.post.entity.PostImage;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.MemberException;
import com.example.instagramclone.exception.PostException;
import com.example.instagramclone.repository.*;
import com.example.instagramclone.util.FileUploadUtil;
import com.example.instagramclone.util.HashtagUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository; // db에 피드내용 저장, 이미지저장
    private final HashtagRepository hashtagRepository; // 해시태그 db에 저장
    private final MemberRepository memberRepository; // 사용자 정보 가져오기
    private final PostLikeRepository postLikeRepository; // 좋아요 정보 가져오기
    private final CommentRepository commentRepository; // 댓글 정보 가져오기
    private final FollowRepository followRepository; // 팔로우 정보

    private final FileUploadUtil fileUploadUtil; // 로컬서버에 이미지 저장
    private final HashtagUtil hashtagUtil; // 해시태그 추출기

    // 피드 목록조회 중간처리
    @Transactional(readOnly = true)
    public FeedResponse findAllFeeds(String username, int size, int page) {

        // offset은 size에 따라 숫자가 바뀜
        /*
            size = 5   ->   offset  0, 5, 10, 15, 20
            size = 3   ->   offset  0, 3, 6, 9, 12, 15
         */
        int offset = (page - 1) * size;

        Member foundMember = memberRepository.findByUsername(username)
                .orElseThrow(() -> new MemberException(ErrorCode.MEMBER_NOT_FOUND));


        // 이 유저가 팔로잉 수가 하나라도 있는지 체크
        boolean hasFollowing
                = followRepository.countFollowByType(foundMember.getId(), "following") > 0;

        List<Post> posts = hasFollowing
                ? postRepository.findFeedPosts(foundMember.getId(), offset, size + 1)
                : postRepository.findRecommendedPosts(offset, size + 1);

        // 전체 피드 조회 - 사이즈를 하나 더 크게 조회하여 다음 데이터가 있는지 체크
        List<PostResponse> feedList = posts
                .stream()
                .map(feed -> {
                    LikeStatusResponse likeStatus = LikeStatusResponse.of(
                            postLikeRepository.findByPostIdAndMemberId(feed.getId(), foundMember.getId()).isPresent()
                            , postLikeRepository.countByPostId(feed.getId())
                    );
                    long commentCount = commentRepository.countByPostId(feed.getId());
                    return PostResponse.of(feed, likeStatus, commentCount);
                })
                .collect(Collectors.toList());

        // 다음 페이지가 존재하는지 여부 확인
        // 클라이언트가 요구한 개수보다 많이 조회되었다면
        boolean hasNext = feedList.size() > size;

        // 클라이언트에게 다음 페이지 데이터가 있는게 확인되었다면
        // size + 1개를 반환하면 안된다. 마지막 데이터를 지우고 반환
        if (hasNext) {
            feedList.remove(feedList.size() - 1);
        }

        return FeedResponse.of(feedList, hasNext);

    }


    // 피드 생성 DB에 가기 전 후 중간처리
    @Transactional
    public Long createFeed(PostCreate postCreate, String username) {

        // 유저의 이름을 통해 해당 유저의 ID를 구함
        Member foundMember = memberRepository.findByUsername(username)
                .orElseThrow(
                        () -> new MemberException(ErrorCode.MEMBER_NOT_FOUND)
                );

        // entity 변환
        Post post = postCreate.toEntity();

        // 사용자의 ID를 세팅해줘야 함 <- 이걸 어케구함?
        post.setMemberId(foundMember.getId());

        // 피드게시물을 posts테이블에 insert
        postRepository.saveFeed(post);

        // 이미지 관련 처리를 모두 수행
        Long postId = post.getId();

        processImages(postCreate.getImages(), postId);

        // 해시태그 관련 처리를 수행
        processHashtags(post);

        // 컨트롤러에게 결과 반환
        return postId;
    }

    // 해시태그 관련 처리 메서드
    private void processHashtags(Post post) {
        // 1. 피드 내용에서 해시태그들을 모두 추출 (중복없이)
        Set<String> hashtagNames = hashtagUtil.extractHashtags(post.getContent());

        // 2. 해시태그들이 최초등장한 해시태그면 데이터베이스에 저장
        //  단, 이미 존재하는 해시태그라면 기존의 해시태그를 조회해서 가져옴
        hashtagNames.forEach(hashtagName -> {

            // 일단 해시태그가 저장되어있는지 여부를 확인 - 조회해봄
            Hashtag foundHashtag = hashtagRepository.findByName(hashtagName)
                    .orElseGet(() -> {
                        Hashtag newHashtag = Hashtag.builder().name(hashtagName).build();
                        hashtagRepository.insertHashtag(newHashtag);
                        log.debug("new hashtag saved: {}", hashtagName);
                        return newHashtag;
                    }) // 일단 조회해보고 없으면(null)~~~ 대체적으로 뭘할지
                    ;

            // 3. 해시태그와 피드를 연결해서 연결테이블에 저장
            PostHashtag postHashtag = PostHashtag.builder()
                    .postId(post.getId())
                    .hashtagId(foundHashtag.getId())
                    .build();

            hashtagRepository.insertPostHashtag(postHashtag);
            log.debug("post hashtag saved: {}", postHashtag);

        });

    }

    private void processImages(List<MultipartFile> images, Long postId) {

        log.debug("start process Image!!");
        // 이미지들을 서버(/upload 폴더)에 저장
        if (images != null && !images.isEmpty()) {
            log.debug("save process Image!!");

            int order = 1; // 이미지 순서
            for (MultipartFile image : images) {
                // 파일 서버에 저장
                String uploadedUrl = fileUploadUtil.saveFile(image);

                log.debug("success to save file at: {}", uploadedUrl);
                // 이미지들을 데이터베이스 post_images 테이블에 insert
                PostImage postImage = PostImage.builder()
                        .postId(postId)
                        .imageUrl(uploadedUrl)
                        .imageOrder(order++)
                        .build();

                postRepository.saveFeedImage(postImage);
            }
        }

    }

    // 피드 단일 조회 처리
    @Transactional(readOnly = true)
    public PostDetailResponse getPostDetails(Long postId, String username) {
        Post post = postRepository.findPostDetailById(postId)
                .orElseThrow(
                        () -> new PostException(ErrorCode.POST_NOT_FOUND)
                );

        Member foundMember = memberRepository.findByUsername(username).orElseThrow();

        // 좋아요 상태
        LikeStatusResponse likeStatus = LikeStatusResponse.of(
                postLikeRepository.findByPostIdAndMemberId(postId, foundMember.getId()).isPresent()
                , postLikeRepository.countByPostId(postId)
        );

        // 댓글 목록
        List<CommentResponse> commentResponses = commentRepository.findByPostId(postId)
                .stream()
                .map(CommentResponse::from)
                .collect(Collectors.toList());

        return PostDetailResponse.of(
                post,
                likeStatus,
                commentResponses
        );
    }


}