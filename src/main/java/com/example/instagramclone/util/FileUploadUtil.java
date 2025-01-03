package com.example.instagramclone.util;

import com.example.instagramclone.config.FileUploadConfig;
import com.example.instagramclone.exception.ErrorCode;
import com.example.instagramclone.exception.PostException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Component
public class FileUploadUtil {

    private final FileUploadConfig fileUploadConfig;

    // 하나의 파일을 로컬저장폴더에 저장하고 그 업로드 경로를 리턴
    public String saveFile(MultipartFile file) {

        // 검증 메서드
        validateImages(file);

        // 원본 파일명 불러오기
        String originalFilename = file.getOriginalFilename();
        // 파일명 랜덤으로 바꾸기
        String newFilename = UUID.randomUUID() + "_" + originalFilename;

        try {
            // 저장할 절대경로
            String uploadPath = fileUploadConfig.getLocation() + newFilename;

            log.debug("Attempting to save file to : {}", uploadPath);

            // 실제 파일 전송
            file.transferTo(new File(uploadPath));

            // uploadPath: 로컬의 저장 경로
            // server url : WebResourceConfig에서 바꿔놓은 URL
            return "/uploads/" + newFilename;
        } catch (IOException e) {
            // ... 예외처리
            log.error("Failed to save file: {}", newFilename, e);
            throw new PostException(ErrorCode.FILE_UPLOAD_ERROR);
        }
    }

    private void validateImages(MultipartFile file) {
        // 파일이 깡통인 경우
        if (file.isEmpty()) {
            throw new PostException(ErrorCode.INVALID_FILE_TYPE, "빈 파일입니다.");
        }

        // 파일이 이미지가 아닌경우
        String contentType = file.getContentType();
        if (!contentType.startsWith("image")) {
            throw new PostException(ErrorCode.INVALID_FILE_TYPE, "이미지만 업로드 가능합니다.");
        }

        // 개별 파일 용량 검증
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new PostException(ErrorCode.FILE_SIZE_EXCEEDED, "이미지 크기는 10MB를 초과할 수 없습니다.");
        }
    }

}