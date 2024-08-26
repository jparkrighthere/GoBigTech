# 📖 채용 공고 모음 서비스앱 GoBigTech
<p align="center">
<img src= https://github.com/user-attachments/assets/b7a90963-cd55-4db1-a759-1e7b7e0349aa />
</p>

## 🚀 프로젝트 소개
- GoBigTech는 테크 기업들의 채용 공고를 한눈에 볼 수 있는 서비스입니다. 
- 국내 주요 빅테크 기업들(네카라쿠배당토 등)의 채용 공고를 마감일 기준으로 정리하여 사용자들이 효율적으로 정보를 얻을 수 있도록 돕습니다.
<br>

## 🤔 프로젝트 동기
- 취업 준비를 하면서 원하는 기업 채용 공고를 확인하기 위해 일일히 페이지를 방문하는 것이 번거럽게 느껴졌고, 주요 기업들의 채용 공고를 한 곳에서 확인할 수 있는 앱 또는 웹이 있으면 좋겠다고 생각했습니다.

## 💻 개발 환경
- Language : TypeScript
- Front : React, React Native, styled-components
- Back-end : Node.js, Express, Mongo DB, axios, cheerios, puppeteer
- 버전 및 이슈관리 : Github
- 서비스 배포 환경 : 배포 예정
<br>

## 📚 주요 기능
- **로그인 서비스**:
  - React Native 카카오 로그인 라이브러리를 활용한 소셜 로그인
- **크롤링**: 
  - `axios`와 `cheerio`를 사용한 데이터 수집
  - `puppeteer`를 활용한 동적 데이터 처리
  - `cron`을 사용한 자동화 크롤링 [예)매일 오후 12시로 설정]
- **데이터베이스**: 
  - `mongoose`와 `MongoDB Atlas`를 사용하여 데이터 관리
<br>

## 🌟 주요 기능
### 1. **채용 공고 목록** 
#### 국내 주요 빅테크 기업들의 채용 공고를 마감일 기준으로 한눈에 볼 수 있는 목록 제공
<p align="center">
<img src= https://github.com/user-attachments/assets/ea421d36-d6aa-4981-8e76-9bb3e3ed389a width ="400" height="900" />
</p>

### 2. **채용 공고 확인** 
#### 원하는 채용 공고의 상세 정보를 확인 가능한 클릭 이동
<p align="center">
<img src = https://github.com/user-attachments/assets/50eac65e-9e7f-4bd7-ac59-e3801e34c647 width ="400" height="900" />
</p>

### 3. **검색 기능**
#### 원하는 채용 공고를 손쉽게 검색할 수 있는 기능
<p align="center">
<img src= https://github.com/user-attachments/assets/18540023-cc5a-451b-bb4f-2f996c4137cb width ="400" height="900"/>
</p>

### 4. **공고 저장**
#### 나중에 지원하기 위해 공고를 저장할 수 있는 기능
<p align="center">
<img src= https://github.com/user-attachments/assets/4a942464-3ef6-4bff-b263-aed2ba7f6e1b width ="400" height="900"/>
</p>

## 회고 및 느낀 점
- 처음으로 진행해보았던 앱 개발 프로젝트였다. React를 활용한 프론트엔드 개념이 확실치 않은데 React Native를 사용하려 하니 어려움을 겪었다. 특히 크롤링한 채용 공고를 수집하여, 그 많은 양의 스크롤을 구현하는 부분에서, 처리속도가 스크롤 속도를 따라오지 못해 버벅거리는 현상이 발생했었다. 찾아보니 FlatList를 활용하면 데이터를 한번에 렌더링 하지 않고, 화면에 보여지거나 설정한 수만큼만 렌더링 한다는 것을 알게 되었고, 해당 문제를 해결할 수 있었다. 백엔드에서도 마찬가지로 한꺼번에 많은 양의 데이터를 여러 웹페이지에서 크롤링하려 하다보니 서버에서 가끔 TimeoutException이 발생하였다. 그래서 delay 함수를 써서 각 웹페이지 간의 크롤링 사이에 일정 시간을 지연시켰더니 해결되었다. 카카오 로그인 서비스를 사용한 이유가 이용자가 저장한 공고의 타이틀과 링크를 카카오톡 메세지로 자신에게 보내어 PC에서 활용할 수 있도록 하기 위해서였는데, 사용하는 React Native 카카오 로그인 라이브러리에서는 지원하지 않아 이 부분을 완성시키지 못했다. 시간을 내어, 외부 라이브러리가 아닌 Kakao API를 직접 사용해 구현해봐야겠다.
