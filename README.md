# 게시판 및 채팅 서비스(Typescript 적용 / 계속해서 업데이트 중)


<br><br>

## 📌 서비스 개요

- 본 서비스는 게시판 및 실시간 채팅 이용 서비스 입니다.
- Typescript 연습 겸 게시판 기능을 확대해가고 있습니다.
- Redis를 사용하여 일일방문자 수 등의 기능 추가
- Socket 통신을 이용하여 실시간 채팅 서비스 구현
- Multer를 이용하여 게시글 작성 시 파일첨부 기능 추가

## 📌 서비스 기능

### 회원가입
- 이메일, 비밀번호, 이름으로 회원가입 할 수 있습니다.
- 형식과 이메일 중복여부 체크.
- 비밀번호는 암호화하여 데이터베이스에 저장합니다.

### 로그인
- 이메일, 비밀번호 형식 체크.
- 로그인 성공하면 Access Token 발급.
- 로그인 성공 시 Redis에 일일방문자 수 업데이트(20230221 과 같이 현재 날짜로 bitmaps 키값 결정)

### 일일방문자수
- 로그인 시 업데이트 한 일일방문자(오늘) 수를 알 수 있습니다. 


### 게시글 작성
- Access Token 으로 유저 인증.
- Multer 이용하여 파일 첨부 가능(5MB 이하, PNG 확장자)
- Redis 조회수 리스트에 생성

### 게시글 읽기
- 24시간 이내의 게시물이면 Redis에 조회수 업데이트(일일 인기 게시글을 위해)


### 게시글 수정, 삭제, 복구
- 해당 게시글 작성자만 권한이 있음(Access Token 으로 유저 인증)
- 게시글 내용을 수정할 수 있음
- 게시글을 삭제 및 복구 할 수 있음(soft delete)

### 게시글 좋아요
- 해당 게시글에 대해 좋아요를 누르고 취소할 수 있다.

### 게시글 목록
- 제목 검색 기능
- 아래 4가지 동작이 각각 및 동시에 작용 됩니다.
- 1. Ordering : 작성일, 좋아요 수, 조회수 로 정렬할 수 있습니다.(ex. orderBy=조회수 order=DESC) default(orderBy=작성일 order=DESC)
- 2. Searching : 검색어로 게시글의 제목을 검색할 수 있습니다.(ex. search=검색어)
- 3. Filtering : 해시태그로 검색(구현중)
- 4. Pagination : 1페이지 당 게시글 수를 조정할 수 있습니다.(ex. page=1 limit=10) default(page=1 limit=10)

### 실시간 인기 게시글
- Redis에서 top 10 조회수 게시글 리스트를 가져옴
- 전체 조회수 기반이라 24시간 이내에 작성된 게시글만 가져옴

### 공지글
- 관리자 권한만 공지글 작성, 수정, 삭제 등 가능
- 일반유저는 읽기만 가능
- 수정 삭제는 관리자 권한을 가진 누구라도 수정 및 삭제 가능

### 채팅 기능
- Socket.io를 이용한 실시간 채팅 기능


## 📌 DB Modeling
<img width="588" alt="스크린샷 2023-02-22 오후 4 26 41" src="https://user-images.githubusercontent.com/19259688/220551703-7b37d845-7aef-4ef0-9537-32c33e8f72e7.png">

<br>

## 📌 API DOCS
- [포스트맨 API DOCS](https://documenter.getpostman.com/view/21381599/2s93CLsDU8)

<br><br>

## 📌 적용 기술

- 사용언어 : Typescript
- 런타임 환경 : Node.js
- 프레임워크 : Express
- ORM : Sequelize
- 데이터베이스 : MySQL
  <br/> <br/>

## 📌 Commit Convention

- feat : 새로운 기능 추가
- fix : 버그 수정
- docs : 문서 수정
- style : 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우, linting
- refactor : 코드 리팩터링
- test : 테스트 코드, 리팩터링 테스트 코드 추가
- chore : 빌드 업무 수정, 패키지 매니저 수정, 그 외 자잘한 수정에 대한 커밋
