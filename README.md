# 🛡️ Merety - 404BNF 팀 내부 포털

> 404BNF 팀의 스터디 관리 및 협업을 위한 내부 포털 시스템

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![SCSS](https://img.shields.io/badge/SCSS-Modules-pink?style=flat-square&logo=sass)

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [환경 변수](#-환경-변수)
- [문서](#-문서)

---

## 🎯 프로젝트 소개

Merety는 404BNF 팀의 스터디 운영을 체계적으로 관리하기 위한 내부 포털입니다.

### 핵심 목표

- **스터디 관리**: Red Team / Web 스터디 운영 및 세션 관리
- **학습 기록**: TIL(Today I Learned) / WIL(Weekly I Learned) 작성
- **자료 공유**: Archive를 통한 학습 자료 관리
- **팀 협업**: 공지사항, 멤버 관리, 일정 관리

---

## ✨ 주요 기능

### 📚 스터디 관리

- 스터디 개요(Overview) 관리
- 세션(Sessions) 생성 및 출석 체크
- 멤버 관리 및 역할 지정
- WIL 작성 및 조회
- 학습 자료 아카이브

### 👥 팀 관리

- 팀 멤버 목록 및 상세 정보
- 공지사항 CRUD
- TIL 작성 및 통계
- 역할(Roles) 정의

### ⚙️ 관리자 기능

- 유저 관리 (생성, 권한 변경, 비활성화)
- 스터디 생성 및 관리
- 시스템 메트릭스 조회

---

## 🛠 기술 스택

### Frontend

| 기술         | 버전 | 설명                         |
| ------------ | ---- | ---------------------------- |
| Next.js      | 15   | React 기반 풀스택 프레임워크 |
| TypeScript   | 5.x  | 정적 타입 시스템             |
| SCSS Modules | -    | 컴포넌트 스코프 스타일링     |
| Lucide React | -    | 아이콘 라이브러리            |

### Backend (예정)

| 기술          | 설명                |
| ------------- | ------------------- |
| PostgreSQL    | 관계형 데이터베이스 |
| JWT           | 인증 토큰           |
| Argon2/bcrypt | 비밀번호 해싱       |

---

## 📁 프로젝트 구조

```
merety/
├── frontend/                 # 프론트엔드 (Next.js)
│   ├── src/
│   │   ├── app/             # App Router 페이지
│   │   │   ├── admin/       # 관리자 페이지
│   │   │   │   ├── study/   # 스터디 관리
│   │   │   │   └── user/    # 유저 관리
│   │   │   ├── study/       # 스터디 상세 페이지
│   │   │   │   └── [id]/    # 동적 라우팅
│   │   │   │       ├── overview/
│   │   │   │       ├── sessions/
│   │   │   │       ├── members/
│   │   │   │       ├── wil/
│   │   │   │       └── archives/
│   │   │   ├── team/        # 팀 관련 페이지
│   │   │   │   ├── members/
│   │   │   │   ├── notice/
│   │   │   │   ├── til/
│   │   │   │   └── roles/
│   │   │   └── signup/      # 회원가입
│   │   ├── components/      # 재사용 컴포넌트
│   │   │   ├── admin/       # 관리자용 컴포넌트
│   │   │   ├── general/     # 공통 컴포넌트
│   │   │   ├── login-signup/
│   │   │   ├── main/        # 메인 페이지용
│   │   │   ├── study/       # 스터디 관련
│   │   │   └── team/        # 팀 관련
│   │   ├── constants/       # 스타일 상수
│   │   │   ├── COLORS.scss
│   │   │   ├── FONTS.scss
│   │   │   └── SPACING.scss
│   │   ├── data/            # 더미 데이터
│   │   ├── hooks/           # 커스텀 훅
│   │   └── types/           # TypeScript 타입 정의
│   └── public/              # 정적 파일
├── 최종_백엔드_명세서.md      # 백엔드 API 명세
├── 기존명세서.md             # 초기 기획 문서
└── README.md
```

---

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/your-username/merety.git
cd merety

# 프론트엔드 의존성 설치
cd frontend
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

---

## 🔐 환경 변수

```env
# frontend/.env.local

# API 서버 URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# 기타 설정 (필요시 추가)
```

---

## 📖 문서

| 문서                                             | 설명                       |
| ------------------------------------------------ | -------------------------- |
| [최종*백엔드*명세서.md](./최종_백엔드_명세서.md) | 백엔드 API 상세 명세서     |
| [기존명세서.md](./기존명세서.md)                 | 초기 기획 및 요구사항 문서 |

---

## 👥 역할 및 권한

| 역할              | 설명                                         |
| ----------------- | -------------------------------------------- |
| **SUPER_ADMIN**   | 시스템 전체 관리 (유저, 스터디, 공지사항 등) |
| **STUDY_MANAGER** | 담당 스터디 운영 (세션, 출석, Overview 등)   |
| **MEMBER**        | 스터디 참여 및 TIL/WIL 작성                  |

---

## 🎨 디자인 시스템

### 컬러

```scss
$background-primary: #131416; // 메인 배경
$background-secondary: #1d1e20; // 보조 배경
$background-third: #26282b; // 카드 배경
$background-fourth: #313337; // 호버/강조

$text-primary: #fdfdfe; // 기본 텍스트
$text-secondary: #959595; // 보조 텍스트
$text-correct: #89da7f; // 성공/긍정
$text-wrong: #da7f7f; // 오류/경고

$border-primary: #474747; // 테두리
```

### 스페이싱

```scss
$s-4: 4px;
$s-8: 8px;
$s-12: 12px;
$s-16: 16px;
$s-20: 20px;
$s-24: 24px;
$s-32: 32px;
$s-48: 48px;
$s-64: 64px;

$s-pagePadding: 48px 128px; // 페이지 기본 패딩
```

### 폰트

```scss
$f-xs: 12px;
$f-sm: 14px;
$f-md: 16px;
$f-lg: 20px;
$f-xl: 24px;
$f-xxl: 32px;

$light: 300;
$regular: 400;
$medium: 500;
$semi-bold: 600;
$bold: 700;
```

---

## 📝 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅 (기능 변경 X)
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드, 설정 파일 수정
```

---

## 📄 라이선스

이 프로젝트는 404BNF 팀 내부용입니다.

---

<p align="center">
  Made with ❤️ by 404BNF Team
</p>
