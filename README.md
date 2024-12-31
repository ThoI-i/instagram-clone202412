# 초기 실행 방법

## 1. 프로젝트를 클론하고 인텔리제이나 이클립스로 열어주세요.

## 2. src/main/resources/application.yml 파일을 열어주세요.
- server.port 를 원하는 포트로 변경하세요.
- spring.datasource 를 현재 로컬 데이터베이스나 원격 데이터베이스에 맞게 변경하세요.
```yml
server:
  port: 8900  

spring:
  datasource:
    driver-class-name: org.mariadb.jdbc.Driver
    url: jdbc:mariadb://localhost:3306/instagram
    username: root
    password: mariadb
  
```

## 3. src/main/java/com/example/instagramclone/InstagramCloneTemplateApplication을 실행합니다.

## 4. 브라우저에서 http://localhost:8900 으로 접속합니다.
