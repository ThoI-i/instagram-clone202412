package com.example.instagramclone.config;

import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.File;

// 파일 업로드 루트 디렉토리 가져오기 및 생성
@Configuration
@Getter @Setter
public class FileUploadConfig {

    @Value("${file.upload.location}")
    private String location; // 업로드할 루트 디렉토리

    @PostConstruct // 이 설정클래스가 생성된 이후 자동으로 호출
    public void init() {
        File directory = new File(location);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

}