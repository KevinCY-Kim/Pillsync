// ==========================================================
// 1. Mock DB Initial State
// ==========================================================

const mockDatabase = {
    categories: [
        { id: 1, name: "피로 개선", desc: "만성 피로와 활력 저하로 고민하는 직장인 맞춤형", icon: "fa-battery-three-quarters", class: "cat-fatigue" },
        { id: 2, name: "다이어트", desc: "체지방 감소와 탄수화물 컷팅이 필요한 분을 위한 맞춤형", icon: "fa-person-running", class: "cat-diet" },
        { id: 3, name: "탈모 & 모발 건강", desc: "모근 약화와 머리숱 감소가 절박한 분들을 위한 맞춤형", icon: "fa-feather", class: "cat-hair" }
    ],
    
    symptoms: [
        // Fatigue (Cat ID 1)
        { id: 101, category_id: 1, text: "아침에 일어날 때 몸이 납덩이처럼 무거워요", ingredient_id: "밀크씨슬" },
        { id: 102, category_id: 1, text: "오후만 되면 집중력이 깨지고 쉽게 나른해져요", ingredient_id: "비타민B군" },
        { id: 103, category_id: 1, text: "업무/학업 스트레스로 인해 가슴이 답답하고 지쳐요", ingredient_id: "홍경천 추출물" },
        
        // Diet (Cat ID 2)
        { id: 201, category_id: 2, text: "밥, 빵, 면 등 탄수화물 섭취가 너무 많아요", ingredient_id: "가르시니아" },
        { id: 202, category_id: 2, text: "기름진 음식을 좋아하고 체지방률이 높아요", ingredient_id: "녹차카테킨" },
        { id: 203, category_id: 2, text: "다이어트 시 운동 수행 능력과 기초대사량을 늘리고 싶어요", ingredient_id: "콜레우스포스콜리" },
        
        // Hair loss (Cat ID 3)
        { id: 301, category_id: 3, text: "머리카락이 가늘어지고 자고 일어나면 베개에 많이 빠져요", ingredient_id: "비오틴" },
        { id: 302, category_id: 3, text: "두피가 건조하고 가려우며 모발 윤기가 없어요", ingredient_id: "맥주효모" },
        { id: 303, category_id: 3, text: "모발 강도와 손톱 끝이 쉽게 갈라져 영양이 부족해요", ingredient_id: "아연" }
    ],
    
    ingredientsMapping: {
        "밀크씨슬": {
            name: "밀크씨슬 (실리마린)",
            desc: "간 세포막을 보호하고 항산화 작용을 통해 간 건강에 도움을 줄 수 있음 (식약처 인정 기능성 원료)",
            keyword: "밀크씨슬 실리마린 직구"
        },
        "비타민B군": {
            name: "활성 비타민B 콤플렉스",
            desc: "체내 에너지 생성 및 대사에 필수적인 영양소로 육체 피로 회복에 도움을 줄 수 있음",
            keyword: "고함량 비타민B 컴플렉스"
        },
        "홍경천 추출물": {
            name: "홍경천 추출물",
            desc: "스트레스로 인한 피로 개선에 도움을 줄 수 있음 (식약처 기능성 고시 원료)",
            keyword: "홍경천 로디올라 스트레스"
        },
        "가르시니아": {
            name: "가르시니아 캄보지아 추출물 (HCA)",
            desc: "탄수화물이 지방으로 합성되는 것을 억제하여 체지방 감소에 도움을 줄 수 있음",
            keyword: "가르시니아 HCA 다이어트"
        },
        "녹차카테킨": {
            name: "녹차 추출물 (카테킨)",
            desc: "항산화, 체지방 감소, 혈중 콜레스테롤 개선에 도움을 줄 수 있음",
            keyword: "녹차카테킨 다이어트보조제"
        },
        "콜레우스포스콜리": {
            name: "콜레우스 포스콜리 추출물",
            desc: "체지방 감소에 도움을 줄 수 있음 (개별인정형 원료)",
            keyword: "콜레우스 포스콜리 포스콜린"
        },
        "비오틴": {
            name: "비오틴 (Biotin / 비타민B7)",
            desc: "지방, 탄수화물, 단백질 대사와 에너지 생성에 필요하며 모발 수치 활성화에 관여함",
            keyword: "비오틴 5000mcg 고함량"
        },
        "맥주효모": {
            name: "맥주효모 (Brewer's Yeast)",
            desc: "모발의 구성 성분인 아미노산과 단백질이 풍부하여 두피 영양 공급 및 모발 탄력 유지에 도움",
            keyword: "맥주효모 환 분말 대용량"
        },
        "아연": {
            name: "아연 (Zinc)",
            desc: "정상적인 면역 기능과 세포 분열에 필수적이며 모낭 세포 증식에 관여함",
            keyword: "아연 영양제 징크"
        }
    }
};

// Mock Products Database matching keywords to display realistic Coupang listings
const mockCoupangProducts = {
    "밀크씨슬 실리마린 직구": [
        { brand: "나우푸드 (Now Foods)", title: "실리마린 밀크씨슬 추출물 300mg, 200베지캡슐", price: 18450, rating: 4.8, reviews: 24502, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" },
        { brand: "캘리포니아 골드 뉴트리션", title: "실리마린 컴플렉스 밀크씨슬 300mg, 120베지캡슐", price: 12100, rating: 4.7, reviews: 15309, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
    ],
    "고함량 비타민B 컴플렉스": [
        { brand: "솔가 (Solgar)", title: "B-콤플렉스 100 메가용량, 100식물성캡슐", price: 22400, rating: 4.9, reviews: 8402, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" },
        { brand: "얼라이브 (Alive)", title: "원스데일리 퓨어에너지 활성 비타민B 다량 함유 멀티비타민 60정", price: 19800, rating: 4.8, reviews: 31052, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" }
    ],
    "홍경천 로디올라 스트레스": [
        { brand: "라이프 익스텐션", title: "로디올라 홍경천 추출물 250mg, 60베지캡슐", price: 15700, rating: 4.6, reviews: 3890, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
    ],
    "가르시니아 HCA 다이어트": [
        { brand: "에버비키니", title: "콜레올로지 컷팅 가르시니아 HCA 더블 112정 (4주분)", price: 26900, rating: 4.7, reviews: 14201, img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=150&auto=format&fit=crop&q=60" },
        { brand: "이너셋", title: "가르시니아 캄보지아 트리플 다이어트 3중 기능성 60정", price: 8900, rating: 4.5, reviews: 7800, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
    ],
    "녹차카테킨 다이어트보조제": [
        { brand: "그린몬스터", title: "다이어트 스페셜 2인1 카테킨 플러스 90정 (30일분)", price: 13400, rating: 4.6, reviews: 9283, img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=150&auto=format&fit=crop&q=60" }
    ],
    "콜레우스 포스콜리 포스콜린": [
        { brand: "푸드올로지", title: "콜레올로지 빨간통 다이어트 콜레우스 포스콜리 60정", price: 35800, rating: 4.8, reviews: 45091, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
    ],
    "비오틴 5000mcg 고함량": [
        { brand: "솔가 (Solgar)", title: "고함량 비오틴 5000mcg, 100식물성캡슐", price: 16500, rating: 4.9, reviews: 19803, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" },
        { brand: "내츄럴플러스", title: "맥주효모 비오틴 10000 60정", price: 11900, rating: 4.7, reviews: 5691, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
    ],
    "맥주효모 환 분말 대용량": [
        { brand: "자연의품격", title: "유기농 국산 맥주효모 환 3g x 30포", price: 14900, rating: 4.8, reviews: 4322, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
    ],
    "아연 영양제 징크": [
        { brand: "나우푸드 (Now Foods)", title: "글루코네이트 아연 50mg, 250정", price: 9800, rating: 4.8, reviews: 18239, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
    ]
};

// Fallback products for newly added categories
const defaultMockProducts = [
    { brand: "네이처스웨이", title: "눈건강 루테인지아잔틴 프리미엄 60소프트젤", price: 23900, rating: 4.8, reviews: 8109, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" },
    { brand: "나우푸드 (Now Foods)", title: "아스타잔틴 4mg 항산화 포뮬러, 90소프트젤", price: 19800, rating: 4.7, reviews: 4120, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
];


// ==========================================================
// 2. Global App State variables (in-memory)
// ==========================================================
let currentCategoryId = null;
let selectedSymptomIds = [];

// DOM Elements
const screenContent = document.getElementById("screen-content");
const appBackBtn = document.getElementById("app-back-btn");
const coupangDisclaimer = document.getElementById("coupang-disclaimer");

// ==========================================================
// 3. UI Renderer Functions (Mobile Screen Router)
// ==========================================================

// Screen 1: Home (Category Selection)
function renderHomeScreen() {
    currentCategoryId = null;
    selectedSymptomIds = [];
    appBackBtn.style.visibility = "hidden";
    coupangDisclaimer.style.display = "none";
    
    let html = `
        <div class="welcome-box animate-fade">
            <h2>나에게 딱 맞는<br><span style="color:var(--color-primary)">영양제 성분 조합</span> 찾기</h2>
            <p>질병 진단이나 처방이 아닌, 식약처 기능성 고시 데이터에 기반하여 고민 해결에 최적화된 맞춤 성분을 30초 만에 추천합니다.</p>
        </div>
        
        <div class="section-tag">건강 고민 선택</div>
        <div class="category-grid">
    `;
    
    mockDatabase.categories.forEach(cat => {
        html += `
            <div class="category-card ${cat.class || ''}" onclick="selectCategory(${cat.id})">
                <div class="icon-wrapper">
                    <i class="fa-solid ${cat.icon}"></i>
                </div>
                <div class="info">
                    <h3>${cat.name}</h3>
                    <p>${cat.desc}</p>
                </div>
                <div class="arrow">
                    <i class="fa-solid fa-chevron-right"></i>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    screenContent.innerHTML = html;
}

// Screen 2: Questionnaire
function selectCategory(catId) {
    currentCategoryId = catId;
    selectedSymptomIds = [];
    appBackBtn.style.visibility = "visible";
    coupangDisclaimer.style.display = "none";
    
    const category = mockDatabase.categories.find(c => c.id === catId);
    const symptoms = mockDatabase.symptoms.filter(s => s.category_id === catId);
    
    let html = `
        <div class="question-box">
            <div class="section-tag">${category.name} 분석</div>
            <div class="question-title">
                현재 몸에서 느껴지는 **불편한 증상**을 모두 선택해주세요. (중복 선택 가능)
            </div>
            
            <div class="options-list">
    `;
    
    symptoms.forEach(s => {
        html += `
            <div class="option-btn" id="symptom-opt-${s.id}" onclick="toggleSymptomOption(${s.id})">
                <span>${s.text}</span>
                <i class="fa-solid fa-check"></i>
            </div>
        `;
    });
    
    html += `
            </div>
            <button class="submit-survey-btn" id="submit-survey-btn" disabled onclick="renderResultScreen()">
                맞춤 영양소 매칭 완료 <i class="fa-solid fa-wand-magic-sparkles"></i>
            </button>
        </div>
    `;
    
    screenContent.innerHTML = html;
}

// Option selection toggle
window.toggleSymptomOption = function(symptomId) {
    const idx = selectedSymptomIds.indexOf(symptomId);
    const btn = document.getElementById(`symptom-opt-${symptomId}`);
    
    if (idx > -1) {
        selectedSymptomIds.splice(idx, 1);
        btn.classList.remove("selected");
    } else {
        selectedSymptomIds.push(symptomId);
        btn.classList.add("selected");
    }
    
    // Enable/disable submit button
    const submitBtn = document.getElementById("submit-survey-btn");
    submitBtn.disabled = selectedSymptomIds.length === 0;
};

// Screen 3: Results & Coupang Linking
function renderResultScreen() {
    appBackBtn.style.visibility = "visible";
    coupangDisclaimer.style.display = "block"; // Show Coupang banner
    
    const category = mockDatabase.categories.find(c => c.id === currentCategoryId);
    
    // 1. Gather matched ingredients
    const matchedIngredients = [];
    selectedSymptomIds.forEach(symId => {
        const symptom = mockDatabase.symptoms.find(s => s.id === symId);
        if (symptom) {
            const ingId = symptom.ingredient_id;
            const ingData = mockDatabase.ingredientsMapping[ingId];
            if (ingData && !matchedIngredients.some(i => i.id === ingId)) {
                matchedIngredients.push({ id: ingId, ...ingData });
            }
        }
    });

    let html = `
        <div class="result-header">
            <div class="result-badge">식약처 고시 기반 매칭</div>
            <h3>당신을 위한 맞춤 영양 조합</h3>
            <p>${category.name} 설문 기준 추천 성분입니다.</p>
        </div>
        
        <div class="section-tag">식약처 기능성 원료 분석</div>
        <div class="ingredient-analysis-card">
    `;
    
    matchedIngredients.forEach(ing => {
        html += `
            <div class="ingredient-item">
                <div class="ing-name">
                    <i class="fa-solid fa-capsules"></i> ${ing.name}
                </div>
                <div class="ing-desc">
                    ${ing.desc}
                </div>
            </div>
        `;
    });
    
    html += `
        </div>
        
        <div class="fda-box">
            <i class="fa-solid fa-circle-info"></i>
            <div>본 안내는 식약처 고시 데이터 기반 가이드이며, 약사법에 저촉되지 않는 단순 정보 매칭입니다. 특정 질병 치료는 전문의와 상담하십시오.</div>
        </div>
        
        <div class="section-tag">쿠팡 최저가 딥링크 추천</div>
        <div class="product-grid">
    `;
    
    // 2. Fetch mock coupang products for the matched keywords
    matchedIngredients.forEach(ing => {
        const keyword = ing.keyword;
        const products = mockCoupangProducts[keyword] || defaultMockProducts;
        
        products.forEach(prod => {
            // Simulated affiliate redirection
            const encodedTitle = encodeURIComponent(prod.title);
            const redirectUrl = `https://www.coupang.com/np/search?q=${encodeURIComponent(ing.keyword)}`;
            
            html += `
                <a href="${redirectUrl}" target="_blank" class="product-card" onclick="alert('쿠팡 파트너스 딥링크 리다이렉션:\\n[${prod.brand}] ${prod.title}\\n\\n클릭 시 본인의 파트너스 서브아이디 및 링크로 실제 쿠팡 앱이 자동 실행됩니다.');">
                    <div class="prod-img-box">
                        <img src="${prod.img}" alt="${prod.title}">
                    </div>
                    <div class="prod-info">
                        <div>
                            <span class="prod-brand">${prod.brand}</span>
                            <div class="prod-title">${prod.title}</div>
                        </div>
                        <div class="price-row">
                            <span class="prod-price">${prod.price.toLocaleString()}원</span>
                            <span class="buy-btn">
                                <i class="fa-solid fa-shopping-cart"></i> 쿠팡 최저가
                            </span>
                        </div>
                    </div>
                </a>
            `;
        });
    });
    
    html += `
        </div>
        
        <button class="reset-btn" onclick="renderHomeScreen()">
            <i class="fa-solid fa-house"></i> 건강고민 다시 선택
        </button>
    `;
    
    screenContent.innerHTML = html;
}

// Back Button Navigation
appBackBtn.addEventListener("click", () => {
    if (selectedSymptomIds.length > 0 || currentCategoryId !== null) {
        // Go back to Home
        renderHomeScreen();
    }
});

// Exposed globally for onclick handlers
window.selectCategory = selectCategory;
window.renderResultScreen = renderResultScreen;
window.renderHomeScreen = renderHomeScreen;


// ==========================================================
// 4. Admin Simulator System (Dynamic Database Sync)
// ==========================================================

// Render current database to HTML tables
function syncDatabaseToTables() {
    // 1. Categories Table
    const catBody = document.querySelector("#categories-table tbody");
    catBody.innerHTML = "";
    mockDatabase.categories.forEach(cat => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${cat.id}</td>
            <td><strong>${cat.name}</strong></td>
            <td title="${cat.desc}">${cat.desc}</td>
            <td><i class="fa-solid ${cat.icon}"></i></td>
        `;
        catBody.appendChild(row);
    });

    // 2. Symptoms Table
    const symBody = document.querySelector("#symptoms-table tbody");
    symBody.innerHTML = "";
    mockDatabase.symptoms.forEach(s => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${s.id}</td>
            <td>${s.category_id}</td>
            <td>${s.text}</td>
            <td><span class="keyword-badge">${s.ingredient_id}</span></td>
        `;
        symBody.appendChild(row);
    });

    // 3. Ingredients Table
    const ingBody = document.querySelector("#ingredients-table tbody");
    ingBody.innerHTML = "";
    Object.keys(mockDatabase.ingredientsMapping).forEach(key => {
        const ing = mockDatabase.ingredientsMapping[key];
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${key}</strong></td>
            <td title="${ing.desc}">${ing.desc}</td>
            <td><span class="keyword-badge">${ing.keyword}</span></td>
        `;
        ingBody.appendChild(row);
    });
}

// Switch simulator tabs
const tabBtns = document.querySelectorAll(".tab-btn");
tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // Remove active state
        tabBtns.forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(tc => tc.classList.remove("active"));
        
        // Add active state
        btn.classList.add("active");
        const targetTab = document.getElementById(`tab-${btn.dataset.tab}`);
        targetTab.classList.add("active");
    });
});

// Form Submission (Add New Category & Symptom & Ingredient)
const newCatForm = document.getElementById("new-category-form");
newCatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const catName = document.getElementById("cat-name").value;
    const catDesc = document.getElementById("cat-desc").value;
    const catIcon = document.getElementById("cat-icon").value;
    const symptomText = document.getElementById("symptom-text").value;
    const ingredientName = document.getElementById("matched-ingredient").value;
    const ingredientDesc = document.getElementById("ingredient-desc").value;
    const coupangKeyword = document.getElementById("coupang-keyword").value;
    
    // 1. Calculate IDs
    const newCatId = mockDatabase.categories.length + 1;
    const newSymptomId = 100 * newCatId + 1;
    
    // 2. Insert Category
    mockDatabase.categories.push({
        id: newCatId,
        name: catName,
        desc: catDesc,
        icon: catIcon,
        class: `cat-custom-${newCatId}`
    });
    
    // 3. Insert Ingredient Mapping
    const ingredientKey = ingredientName.replace(/\s+/g, "");
    mockDatabase.ingredientsMapping[ingredientKey] = {
        name: ingredientName,
        desc: ingredientDesc,
        keyword: coupangKeyword
    };
    
    // 4. Insert Symptom
    mockDatabase.symptoms.push({
        id: newSymptomId,
        category_id: newCatId,
        text: symptomText,
        ingredient_id: ingredientKey
    });

    // 5. Populate products if not exists
    if (!mockCoupangProducts[coupangKeyword]) {
        mockCoupangProducts[coupangKeyword] = [
            { brand: "네이처스웨이", title: `${ingredientName} 프리미엄 골드 라벨`, price: 24500, rating: 4.8, reviews: 1024, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" },
            { brand: "나우푸드 (Now Foods)", title: `${ingredientName} 고용량 식이보조제`, price: 17800, rating: 4.7, reviews: 3412, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
        ];
    }
    
    // 6. Reset form
    newCatForm.reset();
    
    // 7. Show success alert and refresh UI
    alert(`[DB 업데이트 완료] \n카테고리 '${catName}' 및 식약처 성분 '${ingredientName}'이 성공적으로 데이터베이스에 추가되었습니다. \n\n모바일 화면에서 확인하실 수 있습니다.`);
    
    // Switch tab back to DB View
    document.querySelector('[data-tab="db-view"]').click();
    
    // Sync UI
    syncDatabaseToTables();
    renderHomeScreen();
});


// ==========================================================
// 5. Initialization
// ==========================================================
syncDatabaseToTables();
renderHomeScreen();
console.log("PillSync MVP Sandbox successfully initialized.");
