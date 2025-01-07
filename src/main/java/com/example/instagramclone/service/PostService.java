package com.example.instagramclone.service;

import com.example.instagramclone.domain.hashtag.entity.Hashtag;
import com.example.instagramclone.domain.hashtag.entity.PostHashtag;
import com.example.instagramclone.domain.post.dto.request.PostCreate;
import com.example.instagramclone.domain.post.dto.response.PostResponse;
import com.example.instagramclone.domain.post.entity.Post;
import com.example.instagramclone.domain.post.entity.PostImage;
import com.example.instagramclone.repository.HashtagRepository;
import com.example.instagramclone.repository.PostRepository;
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

    private final FileUploadUtil fileUploadUtil; // 로컬서버에 이미지 저장
    private final HashtagUtil hashtagUtil; // 해시태그 추출기

    // 피드 목록조회 중간처리
    @Transactional(readOnly = true)
    public List<PostResponse> findAllFeeds() {
        // 전체 피드 조회
        return postRepository.findAll()
                .stream()
                .map(feed -> {
                    feed.setImages(postRepository.findImagesByPostId(feed.getId()));
                    return PostResponse.from(feed);
                })
                .collect(Collectors.toList());
    }


    // 피드 생성 DB에 가기 전 후 중간처리
    public Long createFeed(PostCreate postCreate) {

        // entity 변환
        Post post = postCreate.toEntity();

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

}