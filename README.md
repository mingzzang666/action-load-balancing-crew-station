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

# 🧭 AI 여행지 추천 기능

## 📌 기능 개요
사용자가 입력한 **여행 키워드(예: "추운", "바다", "힐링")**를 기반으로  
전 세계 도시 데이터를 분석하여 최적의 여행지를 추천하는 기능입니다.

텍스트 기반 유사도 모델과 도시 특성 태깅 시스템을 결합한  
**Hybrid Recommendation System**으로 구성되어 있습니다.

---

## ✨ UI 흐름

사용자는 아래와 같은 직관적인 UI 흐름을 통해 AI 여행지 추천 기능을 사용할 수 있습니다.

---

### 1) AI 여행지 추천 버튼

<img width="120" height="36" alt="AI 여행지 추천 버튼" src="https://github.com/user-attachments/assets/3d4c8e04-b452-4822-bcfc-63609d1c5a10" />

- 사용자가 추천 기능을 시작하는 진입점  
- 부드러운 그라디언트와 아이콘으로 직관적이고 접근성이 우수함  

---

### 2) 여행 선호 입력창

<img width="365" height="103" alt="AI 여행지 추천 입력창" src="https://github.com/user-attachments/assets/c3e3a00e-a356-4cb8-b921-58c826a57448" />

- 사용자가 원하는 여행 스타일을 키워드로 자유롭게 입력  
- 입력 예시  
  - `"대도시 / 일본 / 바다"`  
  - `"추운 곳 / 조용한 도시"`  
  - `"힐링 / 자연 / 따뜻함"`  
- 입력된 텍스트는 AI 모델에서 분석되어 **유사도 기반 추천**이 진행됨  

---

### 3) 추천 결과 화면

<img width="465" height="148" alt="AI 여행지 추천 결과 화면" src="https://github.com/user-attachments/assets/8e72ed9c-c015-4e41-89e5-5656bc80bac5" />

- 사용자의 취향을 분석해 **상위 여행지 3곳을 자동 추천**  
- 추천 도시 예시  
  - **Seoul (대한민국)**  
  - **Istanbul (튀르키예)**  
  - **Tokyo (일본)**  
- 각 도시는 도시 특성 태그(기후 / 규모 / 해변 등)와  
  텍스트 유사도 기반 분석을 통해 선정됨  

---

## 📌 기능 요약

- 텍스트 기반 분석 + 도시 특성 태그 기반의  
  **하이브리드 여행지 추천 모델**
- 간단한 키워드 입력만으로 즉각 추천 가능
- 누구나 쉽게 사용할 수 있는 직관적인 UI 흐름 제공  

---

## 🔗 전체 추천 로직은 아래와 같이 구성됩니다

## 🧠 추천 모델 구조

### ✔ 1) 텍스트 기반 추천 (Content-Based Filtering)
- `CountVectorizer` 로 여행지 텍스트를 BoW(Bag of Words)로 벡터화
- 사용자 입력도 동일하게 벡터화
- `cosine_similarity` 로 유사도 계산 후 상위 여행지 추천

```python
user_vector = count_v.transform([user_text])
cosine_sim = cosine_similarity(user_vector, count_matrix)[0]
top_idx = np.argsort(cosine_sim)[::-1][:top_n]
```

---

### 🏷 도시 특성 태깅 시스템 (Tagging System)

도시 데이터에 다양한 태그를 자동 생성하여
추천 정확도와 추천 설명력(Explainability)을 강화합니다.

| 태그              | 기준          | 예시                |
| --------------- | ----------- | ----------------- |
| **ClimateTag**  | 위도 기반 기후    | 추움 / 온화 / 더움      |
| **BeachTag**    | 해변 여부       | Beach / Non-Beach |
| **SizeTag**     | 인구 기반 도시 규모 | 소도시 / 중도시 / 대도시   |
| **NatureTag**   | 자연 환경       | 산악 / 평야 / 해안      |
| **TravelStyle** | 기후 + 규모 조합  | 힐링형 / 도시형 / 액티비티형 |


---

```travel_df["ClimateTag"] = travel_df["Latitude"].apply(climate_tag)
travel_df["BeachTag"]   = travel_df["AccentCity"].apply(beach_tag)
travel_df["SizeTag"]    = travel_df["Population"].apply(size_tag)
travel_df["NatureTag"]  = travel_df["Latitude"].apply(nature_tag)

travel_df["TravelStyle"] = travel_df.apply(
    lambda x: travel_style_tag(x["Latitude"], x["Population"]), axis=1
)
```

### 🎯 추천 결과 예시

추천은 도시 기본 정보와 함께 유사도 점수를 함께 포함합니다.
> 도시명 (AccentCity)
>
> 국가명 (CountryKor)
>
> 인구수
>
> 위도/경도
>
> 자동 생성 태그들(기후/해변/규모/자연/여행스타일)

``` def recommend_city(user_text, top_n=3):
    user_vector = count_v.transform([user_text])
    cosine_sim = cosine_similarity(user_vector, count_matrix)[0]
    top_idx = np.argsort(cosine_sim)[::-1][:top_n]

    result = travel_df.iloc[top_idx][[
        "AccentCity", "Country", "CountryKor",
        "Population", "Latitude", "Longitude"
    ]].copy()

    result["score"] = cosine_sim[top_idx]
    return result
```

🏁 요약

>텍스트 기반 유사도 + 도시 특성 태그를 활용한 하이브리드 여행지 추천 모델
>
>빠르고 가벼우며 확장성이 높음
>
>“추운”, “따뜻한”, “바다”, “힐링” 같은 단어 기반 즉각 추천 가능
>
>태그 시스템으로 추천 이유를 유저에게 명확히 제공 가능

