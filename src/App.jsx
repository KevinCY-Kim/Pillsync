import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';

// ==========================================================
// Offline Local Mock DB Fallback Data
// ==========================================================
const localCategories = [
  { id: 1, name: "피로 개선", desc: "만성 피로와 활력 저하로 고민하는 직장인 맞춤형", icon: "fa-battery-three-quarters", class: "cat-fatigue" },
  { id: 2, name: "다이어트", desc: "체지방 감소와 탄수화물 컷팅이 필요한 분을 위한 맞춤형", icon: "fa-person-running", class: "cat-diet" },
  { id: 3, name: "탈모 & 모발 건강", desc: "모근 약화와 머리숱 감소가 절박한 분들을 위한 맞춤형", icon: "fa-feather", class: "cat-hair" }
];

const localSymptoms = [
  { id: 101, category_id: 1, text: "아침에 일어날 때 몸이 납덩이처럼 무거워요", ingredient_id: "밀크씨슬" },
  { id: 102, category_id: 1, text: "오후만 되면 집중력이 깨지고 쉽게 나른해져요", ingredient_id: "비타민B군" },
  { id: 103, category_id: 1, text: "업무/학업 스트레스로 인해 가슴이 답답하고 지쳐요", ingredient_id: "홍경천 추출물" },
  
  { id: 201, category_id: 2, text: "밥, 빵, 면 등 탄수화물 섭취가 너무 많아요", ingredient_id: "가르시니아" },
  { id: 202, category_id: 2, text: "기름진 음식을 좋아하고 체지방률이 높아요", ingredient_id: "녹차카테킨" },
  { id: 203, category_id: 2, text: "다이어트 시 운동 수행 능력 및 기초대사량을 늘리고 싶어요", ingredient_id: "콜레우스포스콜리" },
  
  { id: 301, category_id: 3, text: "머리카락이 가늘어지고 자고 일어나면 베개에 많이 빠져요", ingredient_id: "비오틴" },
  { id: 302, category_id: 3, text: "두피가 건조하고 가려우며 모발 윤기가 없어요", ingredient_id: "맥주효모" },
  { id: 303, category_id: 3, text: "모발 강도와 손톱 끝이 쉽게 갈라져 영양이 부족해요", ingredient_id: "아연" }
];

const localIngredientsMapping = {
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
};

const initialCoupangProducts = {
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

const defaultMockProducts = [
  { brand: "네이처스웨이", title: "눈건강 루테인지아잔틴 프리미엄 60소프트젤", price: 23900, rating: 4.8, reviews: 8109, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" },
  { brand: "나우푸드 (Now Foods)", title: "아스타잔틴 4mg 항산화 포뮬러, 90소프트젤", price: 19800, rating: 4.7, reviews: 4120, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
];

function App() {
  // DB States
  const [categories, setCategories] = useState(localCategories);
  const [symptoms, setSymptoms] = useState(localSymptoms);
  const [ingredientsMapping, setIngredientsMapping] = useState(localIngredientsMapping);
  const [coupangProducts, setCoupangProducts] = useState(initialCoupangProducts);

  // Connection Mode State
  const [dbMode, setDbMode] = useState("Local DB");

  // Mobile App Navigation / Interaction State
  const [activeScreen, setActiveScreen] = useState('home'); // 'home' | 'survey' | 'result'
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [selectedSymptomIds, setSelectedSymptomIds] = useState([]);

  // Admin Panel Tab State
  const [activeAdminTab, setActiveAdminTab] = useState('db-view'); // 'db-view' | 'add-category'

  // Admin Portal form fields state
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('fa-eye');
  const [newSymptomText, setNewSymptomText] = useState('');
  const [newIngredientName, setNewIngredientName] = useState('');
  const [newIngredientDesc, setNewIngredientDesc] = useState('');
  const [newCoupangKeyword, setNewCoupangKeyword] = useState('');

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Load database from Supabase or Fallback
  const loadDatabase = async () => {
    if (!isSupabaseConfigured) {
      console.log("[PillSync] Supabase is not configured. Running in Local Offline Mode.");
      setDbMode("Local DB");
      return;
    }

    try {
      console.log("[PillSync] Attempting to fetch database records from Supabase...");

      // 1. Fetch Categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('id');
      if (catError) throw catError;

      // 2. Fetch Symptoms
      const { data: symData, error: symError } = await supabase
        .from('symptoms')
        .select('*')
        .order('id');
      if (symError) throw symError;

      // 3. Fetch Ingredients Mapping
      const { data: ingData, error: ingError } = await supabase
        .from('ingredients_mapping')
        .select('*');
      if (ingError) throw ingError;

      console.log("[PillSync] Supabase sync completed successfully!", { catData, symData, ingData });

      // Map Supabase 'categories' columns to frontend structure
      const transformedCategories = catData.map(c => ({
        id: c.id,
        name: c.name,
        desc: c.description || c.desc || "",
        icon: c.icon_class || c.icon || "fa-capsules",
        class: c.class || `cat-custom-${c.id}`
      }));

      // Map Supabase 'symptoms' columns to frontend structure
      const transformedSymptoms = symData.map(s => ({
        id: s.id,
        category_id: s.category_id,
        text: s.symptom_text || s.text || "",
        ingredient_id: s.matched_ingredient_id || s.ingredient_id || ""
      }));

      // Map Supabase 'ingredients_mapping' list to frontend lookup dict
      const transformedIngredientsMapping = {};
      ingData.forEach(i => {
        transformedIngredientsMapping[i.id] = {
          name: i.name,
          desc: i.fda_functional_summary || i.desc || "",
          keyword: i.coupang_search_keyword || i.keyword || ""
        };
      });

      setCategories(transformedCategories);
      setSymptoms(transformedSymptoms);
      setIngredientsMapping(transformedIngredientsMapping);
      setDbMode("Supabase Connected");
      showToast("Supabase 클라우드 DB 연동 완료!");

    } catch (err) {
      console.warn("[PillSync] Supabase connection failed or tables missing. Falling back to Local Mock DB. Error details:", err.message || err);
      setCategories(localCategories);
      setSymptoms(localSymptoms);
      setIngredientsMapping(localIngredientsMapping);
      setDbMode("Local DB (Fallback)");
    }
  };

  useEffect(() => {
    loadDatabase();
  }, []);

  // Switch to category questionnaire
  const handleSelectCategory = (catId) => {
    setCurrentCategoryId(catId);
    setSelectedSymptomIds([]);
    setActiveScreen('survey');
  };

  // Toggle symptom selection checkbox
  const handleToggleSymptom = (symptomId) => {
    if (selectedSymptomIds.includes(symptomId)) {
      setSelectedSymptomIds(selectedSymptomIds.filter(id => id !== symptomId));
    } else {
      setSelectedSymptomIds([...selectedSymptomIds, symptomId]);
    }
  };

  const handleBack = () => {
    if (activeScreen === 'survey') {
      setActiveScreen('home');
      setCurrentCategoryId(null);
    } else if (activeScreen === 'result') {
      setActiveScreen('survey');
    }
  };

  const handleReset = () => {
    setActiveScreen('home');
    setCurrentCategoryId(null);
    setSelectedSymptomIds([]);
  };

  // Submit survey and calculate results
  const handleSubmitSurvey = () => {
    setActiveScreen('result');
  };

  // Form submission: Add a new custom category
  const handleAddCategorySubmit = async (e) => {
    e.preventDefault();

    const ingredientKey = newIngredientName.replace(/\s+/g, "");

    // 1. SUPABASE CONNECTION MODE
    if (dbMode === "Supabase Connected") {
      try {
        showToast("Supabase 클라우드에 저장하는 중...");

        // Insert new category (ID generated automatically by database serial)
        const { data: catInsert, error: catError } = await supabase
          .from('categories')
          .insert({
            name: newCatName,
            description: newCatDesc,
            icon_class: newCatIcon
          })
          .select();
        
        if (catError) throw catError;
        const createdCat = catInsert[0];

        // Insert new functional ingredient mapping
        const { error: ingError } = await supabase
          .from('ingredients_mapping')
          .insert({
            id: ingredientKey,
            name: newIngredientName,
            fda_functional_summary: newIngredientDesc,
            coupang_search_keyword: newCoupangKeyword
          });
        
        if (ingError) throw ingError;

        // Insert new symptom question linking them together
        const { error: symError } = await supabase
          .from('symptoms')
          .insert({
            category_id: createdCat.id,
            symptom_text: newSymptomText,
            matched_ingredient_id: ingredientKey
          });
        
        if (symError) throw symError;

        // If new Coupang Products are not present locally, register mock products for keyword
        if (!coupangProducts[newCoupangKeyword]) {
          const newProducts = [
            { brand: "네이처스웨이", title: `${newIngredientName} 프리미엄 골드 라벨`, price: 24500, rating: 4.8, reviews: 1024, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" },
            { brand: "나우푸드 (Now Foods)", title: `${newIngredientName} 고용량 식이보조제`, price: 17800, rating: 4.7, reviews: 3412, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
          ];
          setCoupangProducts({
            ...coupangProducts,
            [newCoupangKeyword]: newProducts
          });
        }

        showToast(`클라우드 DB 저장 완료! \n'${newCatName}' 카테고리가 Supabase에 동기화되었습니다.`);
        
        // Refetch to sync local state with Supabase
        await loadDatabase();

      } catch (err) {
        console.error("[PillSync] Supabase Insert Error:", err);
        alert(`Supabase 저장 중 오류가 발생했습니다. 자세한 정보: ${err.message || err}`);
      }

    // 2. LOCAL OFFLINE MODE
    } else {
      const newCatId = categories.length + 1;
      const newSymptomId = 100 * newCatId + 1;

      // Insert locally
      const newCategoryObj = {
        id: newCatId,
        name: newCatName,
        desc: newCatDesc,
        icon: newCatIcon,
        class: `cat-custom-${newCatId}`
      };
      setCategories([...categories, newCategoryObj]);

      const newIngredientObj = {
        name: newIngredientName,
        desc: newIngredientDesc,
        keyword: newCoupangKeyword
      };
      setIngredientsMapping({
        ...ingredientsMapping,
        [ingredientKey]: newIngredientObj
      });

      const newSymptomObj = {
        id: newSymptomId,
        category_id: newCatId,
        text: newSymptomText,
        ingredient_id: ingredientKey
      };
      setSymptoms([...symptoms, newSymptomObj]);

      if (!coupangProducts[newCoupangKeyword]) {
        const newProducts = [
          { brand: "네이처스웨이", title: `${newIngredientName} 프리미엄 골드 라벨`, price: 24500, rating: 4.8, reviews: 1024, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" },
          { brand: "나우푸드 (Now Foods)", title: `${newIngredientName} 고용량 식이보조제`, price: 17800, rating: 4.7, reviews: 3412, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
        ];
        setCoupangProducts({
          ...coupangProducts,
          [newCoupangKeyword]: newProducts
        });
      }

      showToast(`로컬 DB 저장 완료! \n카테고리 '${newCatName}' 및 식약처 성분 '${newIngredientName}'이 로컬에 추가되었습니다.`);
    }

    // Reset Form Fields
    setNewCatName('');
    setNewCatDesc('');
    setNewCatIcon('fa-eye');
    setNewSymptomText('');
    setNewIngredientName('');
    setNewIngredientDesc('');
    setNewCoupangKeyword('');

    // Switch view
    setActiveAdminTab('db-view');
    setActiveScreen('home');
    setCurrentCategoryId(null);
  };

  // Gather selected ingredients based on symptoms
  const getMatchedIngredients = () => {
    const matched = [];
    selectedSymptomIds.forEach(symId => {
      const symptom = symptoms.find(s => s.id === symId);
      if (symptom) {
        const ingId = symptom.ingredient_id;
        const ingData = ingredientsMapping[ingId];
        if (ingData && !matched.some(i => i.id === ingId)) {
          matched.push({ id: ingId, ...ingData });
        }
      }
    });
    return matched;
  };

  const selectedCategory = categories.find(c => c.id === currentCategoryId);
  const currentSymptoms = symptoms.filter(s => s.category_id === currentCategoryId);
  const matchedIngredientsList = getMatchedIngredients();

  return (
    <div className="app-container">
      {/* Background Orbs */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      {/* Custom Reactive Toast */}
      {toastMessage && (
        <div className="custom-toast animate-fade">
          <div className="toast-header">
            <i className="fa-solid fa-circle-check"></i>
            <span>성공적으로 처리되었습니다</span>
          </div>
          <p style={{ whiteSpace: 'pre-line' }}>{toastMessage}</p>
        </div>
      )}

      {/* Main App Title Header */}
      <header className="main-header">
        <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <i className="fa-solid fa-prescription-bottle-medical logo-icon"></i>
          <span className="brand-name">Pill<span>Sync</span></span>
          <span className="badge">Vite React Build</span>
          <span className={`badge ${dbMode.includes('Connected') ? 'badge-success' : 'badge-local'}`}>
            <i className={`fa-solid ${dbMode.includes('Connected') ? 'fa-cloud' : 'fa-database'}`} style={{ marginRight: '5px' }}></i>
            {dbMode}
          </span>
        </div>
        <p className="subtitle">식약처 데이터 기반 영양제 큐레이션 & 쿠팡 파트너스 연동 시뮬레이터</p>
      </header>

      {/* Dynamic Content Grid */}
      <main className="content-grid">
        
        {/* LEFT: Simulated mobile preview */}
        <section className="device-section">
          <div className="section-title">
            <i className="fa-solid fa-mobile-screen-button"></i> 모바일 앱 프리뷰 (Vite Dev)
          </div>

          <div className="mobile-frame">
            {/* System Status Bar */}
            <div className="status-bar">
              <span className="time">09:41</span>
              <div className="icons">
                <i className="fa-solid fa-signal" style={{marginRight: '4px'}}></i>
                <i className="fa-solid fa-wifi" style={{marginRight: '4px'}}></i>
                <i className="fa-solid fa-battery-three-quarters"></i>
              </div>
            </div>

            {/* Simulated App Navigation Bar */}
            <div className="app-screen">
              <div className="app-nav">
                <button 
                  className="back-btn" 
                  onClick={handleBack} 
                  style={{ visibility: (activeScreen !== 'home') ? 'visible' : 'hidden' }}
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <div className="app-title">필싱크 (PillSync)</div>
                <div className="app-actions">
                  <i className="fa-regular fa-bell"></i>
                </div>
              </div>

              {/* Dynamic screen content routing based on state */}
              <div className="screen-content">
                
                {/* 1. HOME SCREEN */}
                {activeScreen === 'home' && (
                  <div className="animate-fade">
                    <div className="welcome-box">
                      <h2>나에게 딱 맞는<br/><span style={{ color: 'var(--color-primary)' }}>영양제 성분 조합</span> 찾기</h2>
                      <p>질병 진단이나 처방이 아닌, 식약처 기능성 고시 데이터에 기반하여 고민 해결에 최적화된 맞춤 성분을 30초 만에 추천합니다.</p>
                    </div>

                    <div className="section-tag">건강 고민 선택</div>
                    <div className="category-grid" style={{ marginTop: '12px' }}>
                      {categories.map(cat => (
                        <div 
                          key={cat.id} 
                          className={`category-card ${cat.class || ''}`} 
                          onClick={() => handleSelectCategory(cat.id)}
                        >
                          <div className="icon-wrapper">
                            <i className={`fa-solid ${cat.icon}`}></i>
                          </div>
                          <div className="info">
                            <h3>{cat.name}</h3>
                            <p>{cat.desc}</p>
                          </div>
                          <div className="arrow">
                            <i className="fa-solid fa-chevron-right"></i>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. QUESTIONNAIRE SCREEN */}
                {activeScreen === 'survey' && selectedCategory && (
                  <div className="question-box">
                    <div className="section-tag">{selectedCategory.name} 분석</div>
                    <div className="question-title" style={{ marginTop: '8px' }}>
                      현재 몸에서 느껴지는 불편한 증상을 모두 선택해주세요. (중복 선택 가능)
                    </div>

                    <div className="options-list">
                      {currentSymptoms.map(sym => {
                        const isSelected = selectedSymptomIds.includes(sym.id);
                        return (
                          <div 
                            key={sym.id} 
                            className={`option-btn ${isSelected ? 'selected' : ''}`} 
                            onClick={() => handleToggleSymptom(sym.id)}
                          >
                            <span>{sym.text}</span>
                            <i className="fa-solid fa-check"></i>
                          </div>
                        );
                      })}
                    </div>

                    <button 
                      className="submit-survey-btn" 
                      disabled={selectedSymptomIds.length === 0} 
                      onClick={handleSubmitSurvey}
                      style={{ width: '100%' }}
                    >
                      맞춤 영양소 매칭 완료 <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </button>
                  </div>
                )}

                {/* 3. RESULT SCREEN */}
                {activeScreen === 'result' && selectedCategory && (
                  <div className="animate-fade">
                    <div className="result-header">
                      <div className="result-badge">식약처 고시 기반 매칭</div>
                      <h3>당신을 위한 맞춤 영양 조합</h3>
                      <p>{selectedCategory.name} 설문 기준 추천 성분입니다.</p>
                    </div>

                    <div className="section-tag">식약처 기능성 원료 분석</div>
                    <div className="ingredient-analysis-card" style={{ marginTop: '8px' }}>
                      {matchedIngredientsList.map(ing => (
                        <div key={ing.id} className="ingredient-item">
                          <div className="ing-name">
                            <i className="fa-solid fa-capsules"></i> {ing.name}
                          </div>
                          <div className="ing-desc">{ing.desc}</div>
                        </div>
                      ))}
                    </div>

                    <div className="fda-box">
                      <i className="fa-solid fa-circle-info"></i>
                      <div>본 안내는 식약처 고시 데이터 기반 가이드이며, 약사법에 저촉되지 않는 단순 정보 매칭입니다. 특정 질병 치료는 전문의와 상담하십시오.</div>
                    </div>

                    <div className="section-tag">쿠팡 최저가 딥링크 추천</div>
                    <div className="product-grid" style={{ marginTop: '8px' }}>
                      {matchedIngredientsList.map(ing => {
                        const productsList = coupangProducts[ing.keyword] || defaultMockProducts;
                        return productsList.map((prod, idx) => {
                          const redirectUrl = `https://www.coupang.com/np/search?q=${encodeURIComponent(ing.keyword)}`;
                          return (
                            <a 
                              key={`${ing.id}-${idx}`}
                              href={redirectUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="product-card"
                              onClick={(e) => {
                                e.preventDefault();
                                alert(`쿠팡 파트너스 딥링크 리다이렉션:\n[${prod.brand}] ${prod.title}\n\n클릭 시 본인의 파트너스 서브아이디 및 링크로 실제 쿠팡 앱이 자동 실행됩니다.`);
                                window.open(redirectUrl, '_blank');
                              }}
                            >
                              <div className="prod-img-box">
                                <img src={prod.img} alt={prod.title} />
                              </div>
                              <div className="prod-info">
                                <div>
                                  <span className="prod-brand">{prod.brand}</span>
                                  <div className="prod-title">{prod.title}</div>
                                  <div className="prod-meta">
                                    <span className="rating"><i className="fa-solid fa-star"></i> {prod.rating}</span>
                                    <span className="review-count">({prod.reviews.toLocaleString()}개 상품평)</span>
                                  </div>
                                </div>
                                <div className="price-row">
                                  <span className="prod-price">{prod.price.toLocaleString()}원</span>
                                  <span className="buy-btn">
                                    <i className="fa-solid fa-shopping-cart"></i> 쿠팡 최저가
                                  </span>
                                </div>
                              </div>
                            </a>
                          );
                        });
                      })}
                    </div>

                    <button className="reset-btn" onClick={handleReset} style={{ width: '100%' }}>
                      <i className="fa-solid fa-house"></i> 건강고민 다시 선택
                    </button>
                  </div>
                )}

              </div>

              {/* Bottom Sticky Banner (Coupang Disclaimer) */}
              {activeScreen === 'result' && (
                <div className="coupang-partners-disclaimer">
                  * 이 추천 리스트는 쿠팡 파트너스 활동의 일환으로, 구매 시 일정액의 수수료를 제공받을 수 있으며 이는 앱 운영에 도움이 됩니다.
                </div>
              )}
            </div>

          </div>
        </section>

        {/* RIGHT: Realtime Database administration view panel */}
        <section className="admin-section">
          <div className="section-title">
            <i className="fa-solid fa-database"></i> 실시간 DB & 관리자 시스템 시뮬레이터
          </div>

          <div className="admin-card">
            {/* Tab navigation */}
            <div className="tab-header">
              <button 
                className={`tab-btn ${activeAdminTab === 'db-view' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('db-view')}
              >
                <i className="fa-solid fa-table"></i> DB 스키마 뷰어
              </button>
              <button 
                className={`tab-btn ${activeAdminTab === 'add-category' ? 'active' : ''}`}
                onClick={() => setActiveAdminTab('add-category')}
              >
                <i className="fa-solid fa-plus-circle"></i> 신규 카테고리 추가
              </button>
            </div>

            {/* TAB 1: DB SCHEMA VIEWER */}
            {activeAdminTab === 'db-view' && (
              <div className="tab-content active">
                <div className="db-tables">
                  
                  {/* categories table */}
                  <div className="db-table-card">
                    <h4><i className="fa-solid fa-list"></i> Categories (대분류 테이블)</h4>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>카테고리명</th>
                            <th>설명</th>
                            <th style={{ textAlign: 'center' }}>아이콘</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map(cat => (
                            <tr key={cat.id}>
                              <td>{cat.id}</td>
                              <td><strong>{cat.name}</strong></td>
                              <td>{cat.desc}</td>
                              <td style={{ textAlign: 'center' }}><i className={`fa-solid ${cat.icon}`}></i></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* symptoms table */}
                  <div className="db-table-card">
                    <h4><i className="fa-solid fa-clipboard-question"></i> Symptoms (설문/선택지 테이블)</h4>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Cat_ID</th>
                            <th>선택 항목</th>
                            <th>매칭 성분 키</th>
                          </tr>
                        </thead>
                        <tbody>
                          {symptoms.map(sym => (
                            <tr key={sym.id}>
                              <td>{sym.id}</td>
                              <td>{sym.category_id}</td>
                              <td>{sym.text}</td>
                              <td><span className="keyword-badge">{sym.ingredient_id}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* ingredients_mapping table */}
                  <div className="db-table-card">
                    <h4><i className="fa-solid fa-flask"></i> Ingredients_Mapping (식약처 영양소 매칭)</h4>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>성분 키</th>
                            <th>식약처 기능성 공인 요약</th>
                            <th>쿠팡 검색 연동어</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(ingredientsMapping).map(key => {
                            const ing = ingredientsMapping[key];
                            return (
                              <tr key={key}>
                                <td><strong>{key}</strong></td>
                                <td>{ing.desc}</td>
                                <td><span className="keyword-badge">{ing.keyword}</span></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB 2: ADD DYNAMIC CATEGORY & LINKINGS */}
            {activeAdminTab === 'add-category' && (
              <div className="tab-content active">
                <form className="admin-form" onSubmit={handleAddCategorySubmit}>
                  
                  <div className="form-group">
                    <label>새 카테고리 이름 (예: 눈 건강, 관절 건강, 숙취해소)</label>
                    <input 
                      type="text" 
                      placeholder="카테고리명을 입력하세요" 
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>설명</label>
                    <input 
                      type="text" 
                      placeholder="예: 건조하고 피로한 눈을 위한 맞춤 매칭" 
                      value={newCatDesc}
                      onChange={e => setNewCatDesc(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>아이콘 (FontAwesome 아이콘선택)</label>
                    <select 
                      value={newCatIcon}
                      onChange={e => setNewCatIcon(e.target.value)}
                    >
                      <option value="fa-eye">👁️ 눈 (fa-eye)</option>
                      <option value="fa-beer-mug-empty">🍺 술/간 (fa-beer-mug-empty)</option>
                      <option value="fa-brain">🧠 두뇌/기억력 (fa-brain)</option>
                      <option value="fa-heart">❤️ 심장/혈관 (fa-heart)</option>
                      <option value="fa-shield-halved">🛡️ 면역력 (fa-shield-halved)</option>
                      <option value="fa-bone">🦴 관절/뼈 (fa-bone)</option>
                    </select>
                  </div>

                  <div className="divider">설문 선택지 및 식약처 성분 연동 정보</div>

                  <div className="form-group">
                    <label>선택지 질문 (예: 건조하고 뻑뻑한 느낌이 자주 들어요)</label>
                    <input 
                      type="text" 
                      placeholder="설문 화면에 표시될 불편 증상 문구" 
                      value={newSymptomText}
                      onChange={e => setNewSymptomText(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>추천 영양소 (식약처 인정 원료)</label>
                    <input 
                      type="text" 
                      placeholder="예: 루테인 지아잔틴" 
                      value={newIngredientName}
                      onChange={e => setNewIngredientName(e.target.value)}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label>식약처 고시 기능성 내용</label>
                    <textarea 
                      rows="3" 
                      placeholder="예: 황반색소밀도를 유지하여 눈 건강에 도움을 줄 수 있음" 
                      value={newIngredientDesc}
                      onChange={e => setNewIngredientDesc(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>쿠팡 검색 최적화 키워드 (딥링크 연동어)</label>
                    <input 
                      type="text" 
                      placeholder="예: 루테인지아잔틴 직구 추천" 
                      value={newCoupangKeyword}
                      onChange={e => setNewCoupangKeyword(e.target.value)}
                      required 
                    />
                  </div>

                  <button type="submit" className="submit-btn" style={{ width: '100%', marginTop: '16px' }}>
                    <i className="fa-solid fa-save"></i> DB 저장 및 모바일 즉시 반영
                  </button>

                </form>
              </div>
            )}

          </div>
        </section>

      </main>

      {/* Decorative page footer */}
      <footer className="footer">
        <p>© 2026 PillSync React System. 개발 프로세스 검증용 대화형 웹 데모.</p>
      </footer>
    </div>
  );
}

export default App;
