// ===================== placeholder 타이핑 기능 =====================
const messages = [
    "어디로 떠나고 싶나요?",
    "예: 대도시 / 일본 / 바다 / 힐링",
    "AI가 여행지를 추천해드립니다 ✨"
];

let messageIndex = 0;
let charIndex = 0;

function typePlaceholder(targetInput) {
    const currentMessage = messages[messageIndex];
    targetInput.placeholder = currentMessage.substring(0, charIndex);
    charIndex++;

    if (charIndex <= currentMessage.length) {
        setTimeout(() => typePlaceholder(targetInput), 80);
    } else {
        setTimeout(() => {
            charIndex = 0;
            messageIndex = (messageIndex + 1) % messages.length;
            typePlaceholder(targetInput);
        }, 1500);
    }
}

// ===================== 실제 페이지 로직 =====================
document.addEventListener("DOMContentLoaded", async () => {
    let page = 1;
    const size = 8;
    let hasMore = true;
    let checkScroll = true;

    const profileWrap = document.querySelector(".profile-wrap");
    const PROFILE_EDIT_URL = "/mypage/modify";
    const DEFAULT_IMG = "/images/crew-station-icon-profile.png";

    // ===================== 프로필 처리 =====================
    if (profileWrap) {
        const a = profileWrap.querySelector("a");
        if (a) a.href = PROFILE_EDIT_URL;

        try {
            const member = await memberProfileService.getMyPageProfile();

            if (member) {
                const imgEl = profileWrap.querySelector(".profile-img");
                const nameEl = profileWrap.querySelector(".profile-name");

                if (imgEl) {
                    if (member.filePath) {
                        imgEl.src = member.filePath;
                    } else if (member.socialImgUrl) {
                        imgEl.src = member.socialImgUrl;
                    } else {
                        imgEl.src = DEFAULT_IMG;
                    }
                }

                if (nameEl) nameEl.textContent = member.memberName || "";
            }
        } catch (e) {
            console.error("프로필 불러오기 실패:", e);
        }
    }

    // 첫 로드: 다이어리 리스트 & 카운트
    const totalCount = await DiaryService.getMyDiaryCount();
    DiaryLayout.updateDiaryCount(totalCount);
    await loadMyDiaryList(page);

    // ===================== 무한 스크롤 =====================
    window.addEventListener("scroll", async () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 2) {
            if (!checkScroll) return;

            if (hasMore) {
                page++;
                const newCriteria = await loadMyDiaryList(page);
                hasMore = newCriteria?.hasMore ?? false;
            }

            checkScroll = false;
            setTimeout(() => { checkScroll = true; }, 1100);
        }
    });

    // ===================== 목록 로딩 함수 =====================
    async function loadMyDiaryList(page) {
        const data = await DiaryService.getMyDiaryList(page, size);

        if (data && data.myDiaryDTOs) {
            DiaryLayout.renderDiaryList(data.myDiaryDTOs, page > 1);
            hasMore = data.criteria.total > page * size;
            return data.criteria;
        } else {
            hasMore = false;
        }
    }

    // ============================================================
    //              AI 여행지 추천 기능
    // ============================================================

    const aiButton = document.getElementById("aiButton");
    const inputWrap = document.getElementById("aiInputWrap");
    const inputField = document.getElementById("aiInput");
    const resultBox = document.getElementById("resultBox");
    const resultPlace = document.getElementById("resultPlace");

    if (aiButton && inputWrap && inputField && resultBox) {

        typePlaceholder(inputField);

        aiButton.addEventListener("click", () => {

            if (resultBox.style.display === "block") {
                resultBox.style.display = "none";
            }

            inputWrap.style.display =
                inputWrap.style.display === "block" ? "none" : "block";

            if (inputWrap.style.display === "block") {
                inputField.focus();
            }
        });

        inputField.addEventListener("keydown", async (e) => {
            if (e.key === "Enter") {
                e.preventDefault();

                const keyword = inputField.value.trim();
                if (!keyword) return;

                // 입력창 닫기
                inputWrap.style.display = "none";

                // 로딩 표시
                document.getElementById("loading").style.display = "block";

                try {
                    const result = await AiTravelService.recommendDestinations(keyword);

                    if (result && result.results) {
                        resultPlace.innerHTML = result.results
                            .map(item => `• ${item.city} (${item.country})`)
                            .join("<br>");

                        resultBox.style.display = "block";
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    // 로딩 숨기기
                    document.getElementById("loading").style.display = "none";
                }
            }
        });
    }
});
