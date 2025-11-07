# ⚙️ Docker · Nginx · GitHub Actions 기반 로드밸런싱 및 자동배포 인프라

## 📘 프로젝트 개요

이 프로젝트는 **AWS EC2 환경**에서  
**Nginx 로드밸런서**, **Docker 컨테이너화된 Spring Boot 애플리케이션**,  
그리고 **GitHub Actions CI/CD**를 이용하여  
코드 변경 시 자동 배포가 이루어지는 **무중단 서비스 아키텍처**를 구축한 사례입니다.

## 🧩 인프라 아키텍처

<img width="1289" height="723" alt="스크린샷 2025-11-07 085548" src="https://github.com/user-attachments/assets/1d4a23a2-ecee-4b26-bc7a-253ff3523101" />

#### 핵심 구성요소
| 구성 요소 | 역할 |
|------------|------|
| **Client (Web/Mobile)** | React / React Native 클라이언트 |
| **AWS EC2** | Nginx 로드밸런서 및 Spring Boot 컨테이너 실행 |
| **Nginx** | `least_conn` 기반 트래픽 분산 처리 |
| **PostgreSQL** | 주요 데이터베이스 |
| **Redis** | 세션 / 인증 캐싱 |
| **Amazon S3** | 정적 리소스 저장소 |
| **GitHub Actions** | 코드 푸시 → 자동 빌드 & 배포 트리거 |
| **Docker** | 애플리케이션 실행 환경 컨테이너화 |
---

## ⚖️ Nginx 로드밸런싱 구성

### 📄 설정 파일

```sudo vim /etc/nginx/sites-available/crew-station-loadbalancer```
```
nginx
upstream [이름] {
        least_conn;
        server <EC2-IP-1>:80;
        server <EC2-IP-2>:80;
}

server {
        listen 80;

        location / {
        proxy_pass http://[이름];
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        }
}

```
## 🧰 운영 및 점검 명령어
```
> sudo nginx -t	Nginx 설정 문법 검사
> sudo systemctl reload nginx	설정 반영
> docker ps	실행 중인 컨테이너 목록 확인
> docker-compose logs -f	실시간 로그 확인
> sudo journalctl -u nginx	Nginx 로그 모니터링
```

## 🏁 결과 및 기대효과
```
> 무중단 배포 : 코드 푸시 → 자동 빌드 → 배포 → 트래픽 분산까지 자동화
> 확장성 확보 : 컨테이너 수 증가에도 설정 유지
> 안정성 향상 : 실시간 부하분산을 통한 장애 대응력 강화
> 운영 효율성 : 수동 배포 및 서비스 중단 최소화
```



