# 🔷 겸용 펌프 용량 계산서 PWA
### 옥내소화전 + 스프링클러 통합

> **Developer MANMIN** | 대성건축사사무소  
> Blueprint Engineering Theme · Ver 3.1

## 📦 파일 구성

```
gyeomyong-pwa/
├── index.html          ← 메인 앱 (React 포함, Ver 3.1)
├── manifest.json       ← PWA 매니페스트
├── sw.js               ← 서비스 워커 (오프라인 지원 + 업데이트 감지)
├── README.md
└── icons/              ← 아이콘 13종 (겸용 이미지 기반)
    ├── favicon.ico
    ├── favicon-16.png
    ├── favicon-32.png
    ├── apple-touch-icon.png
    ├── icon-72 ~ 384.png
    └── icon-512.png     ← 마스커블 / 스플래시
```

## 🚀 GitHub Pages 배포 방법

1. 이 폴더 전체를 GitHub 저장소 루트에 업로드
2. `Settings` → `Pages` → `Source: main branch / (root)` 선택
3. 배포된 **HTTPS URL** 로 접속 *(HTTP에서는 PWA 설치 불가)*
4. 우하단 **📲 앱 설치** FAB 버튼 클릭 → 즉시 설치

## 📱 PWA 설치 지원 환경

| 환경 | 설치 방법 |
|------|----------|
| Android Chrome / Edge | 📲 앱 설치 FAB 버튼 또는 하단 배너 |
| Windows Chrome / Edge | 주소창 우측 설치 아이콘 ⊕ |
| macOS Chrome | 주소창 우측 설치 아이콘 ⊕ |
| iOS Safari | 공유 버튼 → "홈 화면에 추가" *(FAB 미지원)* |

> ⚠️ **iOS Safari** 는 `beforeinstallprompt` 미지원 → FAB 미표시  
> Safari 공유 메뉴에서 직접 설치해 주세요.

## 🆕 Ver 3.1 변경사항

| 항목 | 내용 |
|------|------|
| **📲 설치 FAB 버튼** | 우하단 퍼플 고정 버튼, 팝-인 애니메이션 |
| **🔴 NEW 뱃지** | 빨간 펄싱 뱃지로 설치 유도 강화 |
| **📐 계산식 FAB** | bottom 80→90px 상향 (버튼 겹침 방지) |
| **alt 속성** | 이미지 alt="" → "겸용펌프 앱 아이콘" 으로 보완 |
| **버전 스탬프** | 전체 Ver-3.0 → Ver-3.1 일괄 업데이트 |

## ⚙️ 기술 스택

- **React 18** (UMD, cdnjs CDN)
- **Service Worker** (오프라인 캐싱, 자동 업데이트 감지)
- **Web App Manifest** (설치, 아이콘, 바로가기)
- **Hazen-Williams 공식** 기반 배관 마찰손실 계산
- **NFPC 102 / NFTC 102** (옥내소화전) + **NFPC 103 / NFTC 103** (스프링클러) 기준

## 📐 설계 원칙

- 토출량: 옥내소화전 + 스프링클러 합산
- 전양정: 양 설비 중 최댓값 채택
- 수원: 양 설비 합산

---
*MANMIN · Blueprint Engineering Theme · Ver 3.1*
