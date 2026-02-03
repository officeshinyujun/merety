# 🚀 Merety VPS 배포 가이드 (Ubuntu)

> Ubuntu VPS에 Merety 프로젝트를 Docker Compose로 배포하는 완전한 가이드

---

## 📋 목차

- [사전 준비](#-사전-준비)
- [1단계: VPS 초기 설정](#1단계-vps-초기-설정)
- [2단계: Docker 설치](#2단계-docker-설치)
- [3단계: 프로젝트 배포](#3단계-프로젝트-배포)
- [4단계: Nginx 리버스 프록시 설정](#4단계-nginx-리버스-프록시-설정)
- [5단계: SSL 인증서 설정 (Let's Encrypt)](#5단계-ssl-인증서-설정-lets-encrypt)
- [6단계: 방화벽 설정](#6단계-방화벽-설정)
- [7단계: 모니터링 및 로그](#7단계-모니터링-및-로그)
- [유지보수](#-유지보수)
- [트러블슈팅](#-트러블슈팅)

---

## 🎯 사전 준비

### 필요한 것들

- **Ubuntu VPS** (20.04 LTS 이상 권장)
- **도메인 네임** (선택사항, SSL 사용 시 필요)
- **최소 사양**:
  - CPU: 2 Core
  - RAM: 2GB 이상
  - Storage: 20GB 이상
- **로컬 환경**: Git, SSH 클라이언트

### 도메인 DNS 설정 (도메인 사용 시)

도메인 관리 페이지에서 A 레코드 추가:

```
Type: A
Name: @ (또는 www)
Value: [VPS IP 주소]
TTL: 3600
```

---

## 1단계: VPS 초기 설정

### 1.1 SSH 접속

```bash
ssh root@[VPS_IP_주소]
```

### 1.2 시스템 업데이트

```bash
# 패키지 목록 업데이트
sudo apt update

# 설치된 패키지 업그레이드
sudo apt upgrade -y
```

### 1.3 새로운 사용자 생성 (보안을 위해 root 대신 사용)

```bash
# 새 사용자 생성
adduser merety

# sudo 권한 부여
usermod -aG sudo merety

# 사용자 전환
su - merety
```

### 1.4 SSH 키 기반 인증 설정 (선택사항, 보안 강화)

**로컬 컴퓨터에서:**

```bash
# SSH 키 생성 (이미 있다면 스킵)
ssh-keygen -t ed25519 -C "your_email@example.com"

# 공개 키를 VPS에 복사
ssh-copy-id merety@[VPS_IP_주소]
```

**VPS에서 비밀번호 인증 비활성화 (선택사항):**

```bash
sudo nano /etc/ssh/sshd_config

# 다음 라인을 찾아 수정:
# PasswordAuthentication no
# PubkeyAuthentication yes

# SSH 재시작
sudo systemctl restart sshd
```

---

## 2단계: Docker 설치

### 2.1 Docker 설치

```bash
# 필수 패키지 설치
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Docker GPG 키 추가
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Docker 저장소 추가
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker 설치
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Docker 서비스 시작 및 자동 시작 설정
sudo systemctl start docker
sudo systemctl enable docker

# 현재 사용자를 docker 그룹에 추가 (sudo 없이 docker 명령어 사용)
sudo usermod -aG docker $USER

# 그룹 변경사항 적용 (재로그인 필요)
newgrp docker
```

### 2.2 Docker Compose 설치

```bash
# Docker Compose 최신 버전 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 실행 권한 부여
sudo chmod +x /usr/local/bin/docker-compose

# 설치 확인
docker --version
docker-compose --version
```

---

## 3단계: 프로젝트 배포

### 3.1 Git 설치 및 프로젝트 클론

```bash
# Git 설치
sudo apt install -y git

# 프로젝트 디렉토리 생성
mkdir -p ~/apps
cd ~/apps

# 프로젝트 클론
git clone https://github.com/your-username/merety.git
cd merety
```

### 3.2 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집
nano .env
```

**`.env` 파일 내용 (프로덕션 환경에 맞게 수정):**

```env
# Backend Environment Variables
PORT=3000
NODE_ENV=production

# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_strong_password_here  # 강력한 비밀번호로 변경!
DB_NAME=merety

# Auth Configuration
JWT_SECRET=your_very_secure_jwt_secret_key_here  # 랜덤한 긴 문자열로 변경!

# Frontend URL (for CORS)
FRONTEND_URL=https://yourdomain.com  # 실제 도메인으로 변경 (또는 http://VPS_IP:4000)

# Frontend Environment Variables
NEXT_PUBLIC_API_URL=https://api.yourdomain.com  # 실제 API URL로 변경 (또는 http://VPS_IP:3000)
```

> **보안 팁**: JWT_SECRET과 DB_PASSWORD는 반드시 강력한 랜덤 문자열로 변경하세요!
> 
> 랜덤 문자열 생성:
> ```bash
> openssl rand -base64 32
> ```

### 3.3 Docker Compose로 빌드 및 실행

```bash
# 컨테이너 빌드 및 백그라운드 실행
docker-compose up -d --build

# 로그 확인
docker-compose logs -f

# 컨테이너 상태 확인
docker-compose ps
```

**예상 출력:**

```
NAME                COMMAND                  SERVICE    STATUS      PORTS
merety-backend      "npm run start:prod"     backend    Up          0.0.0.0:3000->3000/tcp
merety-db           "docker-entrypoint.s…"   db         Up          0.0.0.0:5432->5432/tcp
merety-frontend     "node server.js"         frontend   Up          0.0.0.0:4000->3000/tcp
```

### 3.4 데이터베이스 초기화 (필요시)

```bash
# 백엔드 컨테이너에 접속
docker exec -it merety-backend sh

# 마이그레이션 실행 (NestJS TypeORM 사용 시)
npm run migration:run

# 컨테이너 종료
exit
```

---

## 4단계: Nginx 리버스 프록시 설정

### 4.1 Nginx 설치

```bash
sudo apt install -y nginx

# Nginx 시작 및 자동 시작 설정
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4.2 Nginx 설정 파일 생성

```bash
sudo nano /etc/nginx/sites-available/merety
```

**Nginx 설정 내용:**

```nginx
# HTTP 서버 블록 (나중에 HTTPS로 리다이렉트)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;  # 실제 도메인으로 변경

    # 프론트엔드 (메인 도메인)
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# 백엔드 API (서브도메인 사용 시)
server {
    listen 80;
    server_name api.yourdomain.com;  # API 서브도메인

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS 헤더 (필요시)
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
    }
}
```

**도메인이 없는 경우 (IP만 사용):**

```nginx
server {
    listen 80;
    server_name [VPS_IP_주소];

    # 프론트엔드
    location / {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 백엔드 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 4.3 Nginx 설정 활성화

```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/merety /etc/nginx/sites-enabled/

# 기본 설정 제거 (선택사항)
sudo rm /etc/nginx/sites-enabled/default

# 설정 파일 문법 검사
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

---

## 5단계: SSL 인증서 설정 (Let's Encrypt)

> **주의**: 도메인이 있고 DNS가 올바르게 설정된 경우에만 진행하세요.

### 5.1 Certbot 설치

```bash
# Certbot 설치
sudo apt install -y certbot python3-certbot-nginx
```

### 5.2 SSL 인증서 발급

```bash
# 인증서 발급 및 Nginx 자동 설정
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# 이메일 입력 및 약관 동의 후 진행
```

### 5.3 자동 갱신 설정

```bash
# 자동 갱신 테스트
sudo certbot renew --dry-run

# Cron job 확인 (자동으로 설정됨)
sudo systemctl status certbot.timer
```

**인증서는 90일마다 자동으로 갱신됩니다.**

---

## 6단계: 방화벽 설정

### 6.1 UFW 방화벽 설정

```bash
# UFW 설치 (이미 설치되어 있을 수 있음)
sudo apt install -y ufw

# 기본 정책 설정
sudo ufw default deny incoming
sudo ufw default allow outgoing

# SSH 허용 (중요! 이것을 먼저 해야 접속이 끊기지 않음)
sudo ufw allow ssh
sudo ufw allow 22/tcp

# HTTP, HTTPS 허용
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# 방화벽 활성화
sudo ufw enable

# 상태 확인
sudo ufw status verbose
```

**예상 출력:**

```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
```

---

## 7단계: 모니터링 및 로그

### 7.1 Docker 컨테이너 로그 확인

```bash
# 모든 컨테이너 로그
docker-compose logs -f

# 특정 컨테이너 로그
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db

# 최근 100줄만 보기
docker-compose logs --tail=100 backend
```

### 7.2 Nginx 로그 확인

```bash
# 접근 로그
sudo tail -f /var/log/nginx/access.log

# 에러 로그
sudo tail -f /var/log/nginx/error.log
```

### 7.3 시스템 리소스 모니터링

```bash
# 실시간 컨테이너 리소스 사용량
docker stats

# 디스크 사용량
df -h

# 메모리 사용량
free -h

# CPU 사용량
top
```

### 7.4 자동 재시작 설정 (이미 docker-compose.yml에 설정됨)

`docker-compose.yml`에 `restart: always`가 설정되어 있어 서버 재부팅 시 자동으로 컨테이너가 시작됩니다.

---

## 🔧 유지보수

### 코드 업데이트 및 재배포

```bash
cd ~/apps/merety

# 최신 코드 가져오기
git pull origin main

# 환경 변수 업데이트 (필요시)
nano .env

# 컨테이너 재빌드 및 재시작
docker-compose down
docker-compose up -d --build

# 로그 확인
docker-compose logs -f
```

### 데이터베이스 백업

```bash
# 백업 디렉토리 생성
mkdir -p ~/backups

# PostgreSQL 백업
docker exec merety-db pg_dump -U postgres merety > ~/backups/merety_backup_$(date +%Y%m%d_%H%M%S).sql

# 백업 복원 (필요시)
docker exec -i merety-db psql -U postgres merety < ~/backups/merety_backup_YYYYMMDD_HHMMSS.sql
```

### 자동 백업 스크립트 (Cron)

```bash
# 백업 스크립트 생성
nano ~/backup_db.sh
```

**backup_db.sh 내용:**

```bash
#!/bin/bash
BACKUP_DIR=~/backups
DATE=$(date +%Y%m%d_%H%M%S)
docker exec merety-db pg_dump -U postgres merety > $BACKUP_DIR/merety_backup_$DATE.sql

# 7일 이상 된 백업 삭제
find $BACKUP_DIR -name "merety_backup_*.sql" -mtime +7 -delete
```

```bash
# 실행 권한 부여
chmod +x ~/backup_db.sh

# Cron 작업 추가 (매일 새벽 2시)
crontab -e

# 다음 라인 추가:
0 2 * * * ~/backup_db.sh
```

### Docker 정리

```bash
# 사용하지 않는 이미지, 컨테이너, 볼륨 정리
docker system prune -a

# 볼륨만 정리 (주의: 데이터 손실 가능)
docker volume prune
```

---

## 🔍 트러블슈팅

### 1. 컨테이너가 시작되지 않을 때

```bash
# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db

# 컨테이너 재시작
docker-compose restart
```

### 2. 데이터베이스 연결 오류

```bash
# DB 컨테이너 상태 확인
docker-compose logs db

# DB 컨테이너 내부 접속
docker exec -it merety-db psql -U postgres -d merety

# 연결 테스트
\l  # 데이터베이스 목록
\dt # 테이블 목록
\q  # 종료
```

### 3. Nginx 502 Bad Gateway

```bash
# Nginx 에러 로그 확인
sudo tail -f /var/log/nginx/error.log

# 백엔드/프론트엔드 컨테이너 상태 확인
docker-compose ps

# Nginx 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

### 4. 포트 충돌

```bash
# 포트 사용 확인
sudo netstat -tulpn | grep :3000
sudo netstat -tulpn | grep :4000

# 프로세스 종료 (필요시)
sudo kill -9 [PID]
```

### 5. 디스크 공간 부족

```bash
# 디스크 사용량 확인
df -h

# Docker 정리
docker system prune -a --volumes

# 로그 파일 정리
sudo journalctl --vacuum-time=7d
```

### 6. 메모리 부족

```bash
# 메모리 사용량 확인
free -h

# 스왑 메모리 추가 (2GB 예시)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 영구 설정
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 📊 성능 최적화 (선택사항)

### Nginx 캐싱 설정

```nginx
# /etc/nginx/sites-available/merety에 추가

# 캐시 경로 설정 (http 블록 내)
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

server {
    # ... 기존 설정 ...
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        proxy_cache my_cache;
        proxy_cache_valid 200 60m;
        proxy_pass http://localhost:4000;
    }
}
```

### PM2로 프로세스 관리 (Docker 대신)

Docker Compose 대신 PM2를 사용하려면 별도 가이드가 필요합니다.

---

## 🎉 배포 완료 체크리스트

- [ ] VPS 초기 설정 완료
- [ ] Docker 및 Docker Compose 설치
- [ ] 프로젝트 클론 및 환경 변수 설정
- [ ] Docker Compose로 컨테이너 실행
- [ ] Nginx 리버스 프록시 설정
- [ ] SSL 인증서 설정 (도메인 사용 시)
- [ ] 방화벽 설정
- [ ] 데이터베이스 백업 스크립트 설정
- [ ] 모니터링 및 로그 확인

---

## 📞 추가 도움말

### 유용한 명령어 모음

```bash
# 전체 재시작
docker-compose restart

# 특정 서비스만 재시작
docker-compose restart backend

# 컨테이너 중지
docker-compose down

# 컨테이너 중지 및 볼륨 삭제 (주의!)
docker-compose down -v

# 실시간 로그
docker-compose logs -f --tail=100

# 컨테이너 내부 접속
docker exec -it merety-backend sh
```

### 보안 체크리스트

- [ ] SSH 키 기반 인증 사용
- [ ] 비밀번호 인증 비활성화
- [ ] 방화벽 활성화 (UFW)
- [ ] 강력한 DB 비밀번호 사용
- [ ] JWT_SECRET 랜덤 문자열로 설정
- [ ] SSL/TLS 인증서 적용
- [ ] 정기적인 시스템 업데이트
- [ ] 정기적인 백업

---