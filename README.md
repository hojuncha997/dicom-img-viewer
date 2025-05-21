# DICOM 이미지 뷰어


## 기술 스택

- **프론트엔드**: React 19, TypeScript
- **DICOM 처리**: Cornerstone3D 라이브러리
  - @cornerstonejs/core
  - @cornerstonejs/dicom-image-loader
  - @cornerstonejs/tools
  - dicom-parser
- **상태 관리**: Zustand
- **스타일링**: TailwindCSS
- **빌드 도구**: Webpack

## 설치 방법

1. 저장소 클론:
   ```bash
   git clone https://github.com/hojuncha997/dicom-img-viewer.git
   cd dicom-img-viewer
   ```

2. 의존성 설치:
   ```bash
   npm install
   ```

3. 개발 서버 실행:
   ```bash
   npm start
   ```
   브라우저에서 `http://localhost:3000`으로 접근.

4. 개발서버 빌드:
    ```bash
   npm run build
   ```

## 프로젝트 구조

```
dicom-img-viwer/
├── src/
│   ├── components/    # UI 컴포넌트
│   │   ├── layout/    # 레이아웃 관련 컴포넌트
│   │   └── viewer/    # 뷰어 관련 컴포넌트
│   ├── hooks/         # React 커스텀 훅
│   ├── store/         # Zustand 상태 관리
│   ├── types/         # TypeScript 타입 정의
│   ├── utils/         # 유틸리티 함수
│   ├── App.tsx        # 메인 애플리케이션 컴포넌트
│   └── index.tsx      # 진입점
├── public/            # 정적 파일
└── dist/              # 빌드 결과물
```
