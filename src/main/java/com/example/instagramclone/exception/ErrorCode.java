package com.example.instagramclone.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

// API에서 나오는 여러가지 에러상황들을 상수로 표현
@RequiredArgsConstructor
@Getter
public enum ErrorCode {

    // 알 수 없는 서버오류
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "알 수 없는 서버 오류입니다. 점검 후 조치하겠습니다."),

    // File 관련 오류
    FILE_UPLOAD_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드에 실패했습니다."),
    INVALID_FILE_TYPE(HttpStatus.BAD_REQUEST, "지원하지 않는 파일 형식입니다."),
    FILE_SIZE_EXCEEDED(HttpStatus.BAD_REQUEST, "파일 크기가 제한을 초과했습니다."),
    TOO_MANY_FILES(HttpStatus.BAD_REQUEST, "파일 개수가 제한을 초과했습니다."),


    ;

    private final HttpStatus status;
    private final String message;

}