import { useState, useEffect, useRef } from 'react';
import { track } from '@vercel/analytics';

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { localCategories, localSymptoms, localIngredientsMapping, localSynergyCombinations } from './data/seedData';

// ==========================================================
// Offline Local Mock DB Fallback Data — 카테고리/증상/성분/시너지는 ./data/seedData.js가
// 단일 진실 소스이며, supabase_schema.sql도 거기서 자동 생성됩니다. 아래는 쿠팡 상품 목업만 유지합니다.
// ==========================================================

const initialCoupangProducts = {
  "밀크씨슬 실리마린 직구": [
    { brand: "나우푸드", title: "나우푸드 실리마린 밀크 시슬 추출물 300mg 베지 캡슐, 100정, 1개", price: 18940, rating: 5.0, reviews: 18116, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" }
  ],
  "고함량 비타민B 컴플렉스": [
    { brand: "고려은단", title: "고려은단 메가도스 B 비타민 컴플렉스 51g, 60정, 1개", price: 17900, rating: 5.0, reviews: 8880, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
  ],
  "홍경천 로디올라 스트레스": [
    { brand: "Airboy", title: "Airboy 유기농 홍경천 농축 추출물, 60정, 1개", price: 16880, rating: 5.0, reviews: 5, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
  ],
  "홍삼정 에브리타임 스틱": [
    { brand: "풍년보감", title: "풍년보감 6년근 고려홍삼정 에브리데이100, 15g, 100개", price: 24680, rating: 5.0, reviews: 18065, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" }
  ],
  "나우푸드 L테아닌 200mg": [
    { brand: "뉴트리코스트", title: "뉴트리코스트 L-테아닌 200mg 캡슐, 120정, 1개", price: 16250, rating: 5.0, reviews: 954, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
  ],
  "가르시니아 HCA 다이어트": [
    { brand: "뉴트리디데이", title: "뉴트리디데이 가르시니아 1000, 112정, 1개", price: 12900, rating: 4.5, reviews: 17504, img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=150&auto=format&fit=crop&q=60" }
  ],
  "녹차카테킨 다이어트보조제": [
    { brand: "그린몬스터", title: "그린몬스터 다이어트 녹차카테킨 플러스 28정, 1개", price: 13800, rating: 4.5, reviews: 23014, img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=150&auto=format&fit=crop&q=60" }
  ],
  "콜레우스 포스콜리 포스콜린": [
    { brand: "랩온랩", title: "랩온랩 20배 고농축 더레드 빨간 콜레우스 포스콜리 추출 캡슐, 60정, 1개", price: 12800, rating: 4.5, reviews: 2079, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
  ],
  "시서스 가루 다이어트 캡슐": [
    { brand: "마이라이프", title: "마이라이프 시서스 2500, 240정, 1개", price: 28980, rating: 4.5, reviews: 10468, img: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=150&auto=format&fit=crop&q=60" }
  ],
  "L카르니틴 1000mg 추천": [
    { brand: "나우푸드", title: "나우푸드 L-카르니틴 500mg 베지 캡슐 비건 글루텐 프리, 60정, 1개", price: 18970, rating: 5.0, reviews: 211, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
  ],
  "비오틴 5000mcg 고함량": [
    { brand: "나우푸드", title: "나우푸드 비오틴 5000mcg 베지 캡슐 비건, 120정, 1개", price: 13490, rating: 5.0, reviews: 17042, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" }
  ],
  "국산 맥주효모 환 대용량": [
    { brand: "내츄럴플러스", title: "내츄럴플러스 맥주효모 비오틴, 120정, 1개", price: 11280, rating: 4.5, reviews: 7900, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
  ],
  "아연 영양제 징크": [
    { brand: "나우푸드", title: "나우푸드 아연 50mg, 250정, 1개", price: 14400, rating: 4.5, reviews: 23197, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
  ],
  "L시스틴 500mg 직구": [
    { brand: "솔가", title: "솔가 L-시스테인 500mg 베지터블 캡슐, 90정, 1개", price: 17100, rating: 4.5, reviews: 471, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
  ],
  "판토텐산 550mg 추천": [
    { brand: "재로우", title: "재로우 펜토텐산 B5 500mg 캡슐, 100정, 1개", price: 18130, rating: 4.5, reviews: 16766, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
  ],
  "루테인지아잔틴 복합추출물 추천": [
    { brand: "아이클리어", title: "아이클리어 루테인지아잔틴, 30정, 1개", price: 8190, rating: 5.0, reviews: 178465, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" }
  ],
  "아스타잔틴 헤마토코쿠스 눈피로": [
    { brand: "리얼메디온", title: "리얼메디온 초임계 아스타잔틴 플러스 눈건강 헤마토코쿠스, 30정, 1개", price: 7040, rating: 5.0, reviews: 1695, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
  ],
  "rtg 오메가3 고함량": [
    { brand: "여에스더", title: "여에스더 초임계 알티지 오메가3 1020mg, 30정, 3박스", price: 26740, rating: 5.0, reviews: 5071, img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=60" }
  ],
  "은행잎 추출물 징코 빌로바": [
    { brand: "GNM자연의품격", title: "GNM자연의품격 징코 빌로바11, 30정, 2개", price: 15580, rating: 5.0, reviews: 1209, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
  ],
  "감태추출물 수면 영양제": [
    { brand: "뉴트리디데이", title: "뉴트리디데이 감태 드림 타블렛 영양제, 90정, 1개", price: 10900, rating: 4.5, reviews: 3340, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" }
  ],
  "락티움 수면제 대용 추천": [
    { brand: "GNM자연의품격", title: "GNM 수면건강엔 락티움 마그네슘 비타민B, 30정, 1개", price: 25380, rating: 4.5, reviews: 470, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
  ]
};

const defaultMockProducts = [
  { brand: "네이처스웨이", title: "눈건강 루테인지아잔틴 프리미엄 60소프트젤", price: 23900, rating: 4.8, reviews: 8109, img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=150&auto=format&fit=crop&q=60" },
  { brand: "나우푸드 (Now Foods)", title: "아스타잔틴 4mg 항산화 포뮬러, 90소프트젤", price: 19800, rating: 4.7, reviews: 4120, img: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=60" }
];


function App() {
  // Notification Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // DB States
  const isFirstLoadRef = useRef(true);
  const [categories, setCategories] = useState(localCategories);
  const [symptoms, setSymptoms] = useState(localSymptoms);
  const [ingredientsMapping, setIngredientsMapping] = useState(localIngredientsMapping);
  const [coupangProducts, setCoupangProducts] = useState(initialCoupangProducts);
  const [synergyCombinations, setSynergyCombinations] = useState(localSynergyCombinations);

  // UI Interactive States
  const [openGuides, setOpenGuides] = useState({}); // { [ingredientId]: boolean }
  const [checkedWarnings, setCheckedWarnings] = useState({}); // { [ingredientId]: boolean }
  const [isKfdaModalOpen, setIsKfdaModalOpen] = useState(false);
  const [systemTime, setSystemTime] = useState("12:00");
  const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  // 1. 하이브리드 앱 설치 여부 감지 (Standalone 미디어 쿼리 + LocalStorage 백업)
  const [isAppInstalled, setIsAppInstalled] = useState(() => {
    if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
      return isStandalone || localStorage.getItem('pillsync_installed') === 'true';
    }
    return false;
  });

  // 2. 배지 30일 숨김 기한 감지 및 파싱
  const [hideBadgeState, setHideBadgeState] = useState(() => {
    if (typeof window !== 'undefined') {
      const hideUntil = localStorage.getItem('pillsync_hide_badge_until');
      if (hideUntil) {
        if (Date.now() < parseInt(hideUntil, 10)) {
          return true; // 30일 경과 전이므로 숨김 유지
        } else {
          localStorage.removeItem('pillsync_hide_badge_until'); // 기한이 지났으므로 복구
        }
      }
    }
    return false;
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      console.log('[PillSync PWA] beforeinstallprompt event captured.');
    };

    const handleAppInstalled = () => {
      localStorage.setItem('pillsync_installed', 'true');
      setIsAppInstalled(true);
      setDeferredPrompt(null);
      showToast("🎉 PillSync가 홈 화면에 추가되었습니다!");
      console.log('[PillSync PWA] App installed successfully.');
    };

    // 실시간 디스플레이 모드 전환 감지 리스너
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleModeChange = (e) => {
      if (e.matches) {
        localStorage.setItem('pillsync_installed', 'true');
        setIsAppInstalled(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleModeChange);
    } else {
      mediaQuery.addListener(handleModeChange);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleModeChange);
      } else {
        mediaQuery.removeListener(handleModeChange);
      }
    };
  }, []);

  // Responsive device separation states
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'true';
    }
    return false;
  });
  const [isAdminQueryActive] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('admin') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setSystemTime(`${hours}:${minutes}`);
    };
    updateTime();
    const clockInterval = setInterval(updateTime, 60000);

    const checkDevice = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                       || window.innerWidth <= 768;
      setIsMobileDevice(isMobile);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      clearInterval(clockInterval);
    };
  }, []);

  const handleInstallApp = () => {
    // 모바일(특히 삼성 인터넷)에서는 WebAPK 설치가 Play Protect "안전하지 않은 앱 차단됨" 경고를
    // 유발하고, 사용자에게 '설치' 강요로 느껴져 거부감을 준다. 모바일은 설치 프롬프트를 띄우지 않고
    // 홈 화면 즐겨찾기(바로가기) 추가 가이드만 노출한다. 데스크톱은 경고가 없으므로 기존 원클릭 유지.
    if (deferredPrompt && !isMobileDevice) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          localStorage.setItem('pillsync_installed', 'true');
          setIsAppInstalled(true);
          console.log('[PillSync PWA] User accepted installation.');
        } else {
          console.log('[PillSync PWA] User dismissed installation.');
        }
        setDeferredPrompt(null);
      });
    } else {
      setIsBookmarkModalOpen(true);
    }
  };

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



  // Toggle guide details for ingredients
  // 기본값은 펼침(true) 상태입니다. 부작용 등 안전 고지 정보를 클릭 없이 바로 볼 수 있도록 하고,
  // 정보량이 많다고 느끼는 사용자를 위해 접을 수 있는 옵션만 남겨둡니다.
  const toggleGuide = (ingId) => {
    setOpenGuides(prev => ({
      ...prev,
      [ingId]: prev[ingId] === false ? true : false
    }));
  };

  // Toggle between Local DB fallback and Supabase Connected mode for testing/development
  const toggleDbMode = () => {
    if (dbMode === "Supabase Connected") {
      setCategories(localCategories);
      setSymptoms(localSymptoms);
      setIngredientsMapping(localIngredientsMapping);
      setSynergyCombinations(localSynergyCombinations);
      setDbMode("Local DB (Forced)");
      showToast("로컬 오프라인 모드로 강제 전환되었습니다. (식약처 권장량/시너지가 정상 작동합니다)");
    } else {
      loadDatabase(false);
    }
  };

  // Load database from Supabase or Fallback
  const loadDatabase = async (isSilent = true) => {
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

      // 3. Fetch Ingredients Mapping (including newly added columns)
      const { data: ingData, error: ingError } = await supabase
        .from('ingredients_mapping')
        .select('*');
      if (ingError) throw ingError;

      // 4. Fetch Synergy Combinations
      let transformedSynergy = localSynergyCombinations;
      try {
        const { data: synData, error: synError } = await supabase
          .from('synergy_combinations')
          .select('*');
        
        if (!synError && synData) {
          const { data: synIngData, error: synIngError } = await supabase
            .from('synergy_ingredients')
            .select('*');

          if (!synIngError && synIngData) {
            transformedSynergy = synData.map(s => {
              const relatedIngredients = synIngData
                .filter(si => si.synergy_id === s.id)
                .map(si => si.ingredient_id);
              return {
                id: s.id,
                name: s.name,
                synergy_effect: s.synergy_effect,
                recommendation_reason: s.recommendation_reason,
                ingredients: relatedIngredients
              };
            });
          }
        }
      } catch (synErr) {
        console.warn("[PillSync] Failed to fetch synergy tables. Falling back to local synergy combinations.", synErr);
      }

      console.log("[PillSync] Supabase sync completed successfully!", { catData, symData, ingData });

      // Map Supabase 'categories' columns to frontend structure
      const transformedCategories = catData.map(c => ({
        id: c.id,
        name: c.name,
        desc: (c.description || c.desc || "").replace(/\s+and\s+/g, "와 "),
        icon: c.icon_class || c.icon || "fa-capsules",
        class: c.class || (
          c.id === 1 ? 'cat-fatigue' :
          c.id === 2 ? 'cat-diet' :
          c.id === 3 ? 'cat-hair' :
          c.id === 4 ? 'cat-eye' :
          c.id === 5 ? 'cat-blood' :
          c.id === 6 ? 'cat-sleep' :
          `cat-custom-${c.id}`
        )
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
        const localIng = localIngredientsMapping[i.id] || {};
        transformedIngredientsMapping[i.id] = {
          name: i.name,
          desc: localIng.desc || i.fda_functional_summary || i.desc || "",
          keyword: i.coupang_search_keyword || i.keyword || "",
          coupang_link: i.coupang_link || localIng.coupang_link || null,
          kfda_daily_intake: i.kfda_daily_intake || "",
          high_dose_ratio: i.high_dose_ratio || "",
          high_dose_effect: localIng.high_dose_effect || i.high_dose_effect || "",
          side_effects: localIng.side_effects || i.side_effects || "",
          intake_tip: localIng.intake_tip || i.intake_tip || "",
          warning_trigger_text: localIng.warning_trigger_text || i.warning_trigger_text || null,
          alternative_ingredient_id: i.alternative_ingredient_id || null,
          alternative_reason: localIng.alternative_reason || i.alternative_reason || null
        };
      });

      setCategories(transformedCategories);
      setSymptoms(transformedSymptoms);
      setIngredientsMapping(transformedIngredientsMapping);
      setSynergyCombinations(transformedSynergy);
      setDbMode("Supabase Connected");
      if (!isSilent && !isFirstLoadRef.current) {
        showToast("Supabase 클라우드 DB 연동 완료!");
      }

    } catch (err) {
      console.warn("[PillSync] Supabase connection failed or tables missing. Falling back to Local Mock DB. Error details:", err.message || err);
      setCategories(localCategories);
      setSymptoms(localSymptoms);
      setIngredientsMapping(localIngredientsMapping);
      setSynergyCombinations(localSynergyCombinations);
      setDbMode("Local DB (Fallback)");
    } finally {
      isFirstLoadRef.current = false;
    }
  };

  useEffect(() => {
    loadDatabase(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch to category questionnaire
  const handleSelectCategory = (catId) => {
    setCurrentCategoryId(catId);
    setSelectedSymptomIds([]);
    setCheckedWarnings({});
    setOpenGuides({});
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
      setSelectedSymptomIds([]);
      setCheckedWarnings({});
      setOpenGuides({});
    } else if (activeScreen === 'result') {
      setActiveScreen('survey');
    }
  };

  const handleReset = () => {
    setActiveScreen('home');
    setCurrentCategoryId(null);
    setSelectedSymptomIds([]);
    setCheckedWarnings({});
    setOpenGuides({});
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
        keyword: newCoupangKeyword,
        coupang_link: null
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

  // Build effective ingredient list after applying warning-triggered substitutions
  const effectiveIngredientsList = matchedIngredientsList.map(ing => {
    const isWarningChecked = !!checkedWarnings[ing.id];
    const hasAlternative = ing.alternative_ingredient_id && ingredientsMapping[ing.alternative_ingredient_id];
    if (isWarningChecked && hasAlternative) {
      return { id: ing.alternative_ingredient_id, ...ingredientsMapping[ing.alternative_ingredient_id] };
    }
    return ing;
  });

  // Calculate matching synergies based on effective ingredient list (post-substitution)
  // If a warning-triggered swap removes an ingredient from a booster, that booster is deactivated;
  // a new alternative combo in synergyCombinations may activate instead.
  const activeSynergies = synergyCombinations.filter(syn =>
    syn.ingredients.every(ingId => effectiveIngredientsList.some(m => m.id === ingId))
  );

  // Reusable rendering module for the main app contents (used in both desktop 2-column & emulator mode)
  const renderAppScreen = () => {
    return (
      <div className="app-screen">
        <div className="app-nav">
          <button 
            className="back-btn" 
            onClick={handleBack} 
            style={{ visibility: (activeScreen !== 'home') ? 'visible' : 'hidden' }}
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>
          <div
            className="app-title"
            onClick={() => { setActiveScreen('home'); setCurrentCategoryId(null); }}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <i className="fa-solid fa-prescription-bottle-medical" style={{
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.4))'
            }}></i>
            <span>Pill<span style={{ color: 'var(--color-secondary)' }}>Sync</span></span>
          </div>
          <div className="app-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={handleInstallApp}
              style={{ background: 'none', border: 'none', color: '#FBBF24', fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px', marginRight: '4px' }}
              title={isMobileDevice ? "홈 화면에 추가" : "바탕화면에 추가"}
            >
              <i className="fa-solid fa-star"></i>
            </button>
            <i className="fa-regular fa-bell"></i>
          </div>
        </div>

        {/* Dynamic screen content routing based on state */}
        <div className="screen-content">
          
          {/* 1. HOME SCREEN */}
          {activeScreen === 'home' && (
            <div className="animate-fade">
              <div className="welcome-box">
                {!isAppInstalled && !hideBadgeState && (
                  <div 
                    className="bookmark-welcome-badge animate-pulse-subtle" 
                    onClick={handleInstallApp}
                    style={{ justifyContent: 'space-between', display: 'inline-flex', width: 'fit-content' }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <span className="sparkle-icon">✨</span>
                      <span>홈 화면에 추가하고 편하게 방문하기</span>
                      <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.65rem' }}></i>
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const hideDays = 30;
                        const expiryTime = Date.now() + hideDays * 24 * 60 * 60 * 1000;
                        localStorage.setItem('pillsync_hide_badge_until', expiryTime.toString());
                        setHideBadgeState(true);
                        showToast("즐겨찾기 안내가 30일간 숨겨집니다.");
                      }}
                      style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '0 4px', marginLeft: '8px', display: 'flex', alignItems: 'center' }}
                      title="30일 동안 숨기기"
                    >
                      <i className="fa-solid fa-xmark" style={{ fontSize: '0.75rem' }}></i>
                    </button>
                  </div>
                )}
                <h2>내 건강 고민 유형에 맞는<br/><span style={{ color: 'var(--color-primary)' }}>내 맞춤 영양 솔루션</span></h2>
                <p>질병 진단이나 처방이 아닌, 식약처 고시 기능성 데이터에 기반하여 건강 고민 유형별 관련 성분 정보를 안내합니다. 구체적인 섭취 여부는 전문가와 상담하시기 바랍니다.</p>
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
                해당하는 건강 고민을 모두 선택해주세요. (중복 선택 가능)
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
                성분 정보 안내 시작 <i className="fa-solid fa-wand-magic-sparkles"></i>
              </button>
            </div>
          )}

          {/* 3. RESULT SCREEN */}
          {activeScreen === 'result' && selectedCategory && (
            <div className="animate-fade">
              <div className="result-header">
                <div className="result-badge">식약처 고시 데이터 기반 안내</div>
                <h3>나를 위한 맞춤 영양 정보</h3>
                <p>{selectedCategory.name} 고민 유형 기준 관련 성분 정보입니다. 섭취 전 전문가 상담을 권장합니다.</p>
              </div>

              {!isAppInstalled && (
                <div 
                  className="bookmark-welcome-badge animate-pulse-subtle"
                  onClick={handleInstallApp}
                  style={{
                    background: 'rgba(139, 92, 246, 0.12)',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    marginTop: '12px',
                    marginBottom: '4px',
                    fontSize: '0.78rem',
                    color: '#DDD6FE',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, lineHeight: '1.45' }}>
                    <span style={{ fontSize: '0.95rem' }}>📌</span>
                    <span><strong>이 진단 결과를 나중에 다시 편하게 보려면</strong><br />지금 홈 화면에 바로 추가해 두세요!</span>
                  </span>
                  <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem', color: 'var(--color-primary)', marginLeft: '6px' }}></i>
                </div>
              )}

              <div className="section-tag">식약처 기능성 원료 분석</div>
              <div className="ingredient-analysis-card" style={{ marginTop: '8px' }}>
                {matchedIngredientsList.map(ing => {
                  const isWarningChecked = !!checkedWarnings[ing.id];
                  const hasAlternative = ing.alternative_ingredient_id && ingredientsMapping[ing.alternative_ingredient_id];
                  const targetIng = (isWarningChecked && hasAlternative) ? { id: ing.alternative_ingredient_id, ...ingredientsMapping[ing.alternative_ingredient_id] } : ing;

                  const isHighDose = targetIng.high_dose_ratio && !targetIng.high_dose_ratio.includes("100%");
                  const percentMatch = targetIng.high_dose_ratio ? targetIng.high_dose_ratio.match(/([\d,]+)%/) : null;
                  const rawPercent = percentMatch ? parseInt(percentMatch[1].replace(/,/g, ''), 10) : 100;
                  const displayPercent = Math.min(rawPercent, 100);
                  const isGuideOpen = openGuides[targetIng.id] !== false; // 기본값 펼침

                  return (
                    <div key={ing.id} className="ingredient-item">
                      <div className="swapped-header">
                        <div className="ing-name">
                          <i className="fa-solid fa-capsules"></i> {targetIng.name}
                        </div>
                        {isWarningChecked && hasAlternative && (
                          <span className="badge-alternative animate-fade">
                            <i className="fa-solid fa-triangle-exclamation"></i> 대안 성분 참고 안내
                          </span>
                        )}
                      </div>
                      <div className="ing-desc">{targetIng.desc}</div>

                      {/* 기저 질환 / 부작용 트리거 체크박스 — 체크 시 바로 아래로 대안 안내가 이어지도록 먼저 배치 */}
                      {ing.warning_trigger_text && (
                        <div>
                          <div
                            className="alternative-trigger-box"
                            onClick={() => setCheckedWarnings(prev => ({ ...prev, [ing.id]: !prev[ing.id] }))}
                          >
                            <input
                              type="checkbox"
                              className="alternative-checkbox"
                              checked={isWarningChecked}
                              onChange={() => {}}
                            />
                            <span className="alternative-label">{ing.warning_trigger_text}</span>
                          </div>
                          <p style={{ fontSize: '0.62rem', color: '#6B7280', marginTop: '4px', padding: '0 4px' }}>
                            ※ 위 정보는 브라우저 내에서만 처리되며 서버에 저장·전송되지 않습니다. 기저질환이 있는 경우 섭취 전 반드시 전문의와 상담하시기 바랍니다.
                          </p>
                        </div>
                      )}

                      {/* 대안 추천 상세 사유 출력 — 체크박스 바로 다음에 이어지도록 배치 */}
                      {isWarningChecked && hasAlternative && ing.alternative_reason && (
                        <div className="alternative-reason-box animate-fade">
                          <div className="alternative-reason-title">
                            <i className="fa-solid fa-circle-info"></i> 대안 성분 참고 정보
                          </div>
                          <div className="alternative-reason-desc">{ing.alternative_reason}</div>
                        </div>
                      )}

                      {/* 식약처 일일 권장량 및 충족율 게이지 (대안 선택 시 대안 성분 기준으로 자동 전환) */}
                      {targetIng.kfda_daily_intake && (
                        <div className="intake-meta">
                          <div className="intake-row">
                            <span className="intake-label">식약처 하루 권장량</span>
                            <span className="intake-val">{targetIng.kfda_daily_intake}</span>
                          </div>
                          {targetIng.high_dose_ratio && (
                            <>
                              <div className="intake-row">
                                <span className="intake-label">고함량 충족율</span>
                                <span className={`intake-val ${isHighDose ? 'high-dose' : ''}`}>
                                  {targetIng.high_dose_ratio}
                                </span>
                              </div>
                              <div className="progress-container">
                                <div
                                  className={`progress-bar ${isHighDose ? 'high-dose-fill' : ''}`}
                                  style={{ width: `${displayPercent}%` }}
                                ></div>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* 고함량 메리트 & 부작용 사전 가이드 아코디언 */}
                      {(targetIng.high_dose_effect || targetIng.side_effects || targetIng.intake_tip) && (
                        <div className="details-toggle">
                          <button className="details-header" onClick={() => toggleGuide(targetIng.id)}>
                            <span>섭취 메리트 & 부작용 가이드</span>
                            <i className={`fa-solid ${isGuideOpen ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                          </button>
                          {isGuideOpen && (
                            <div className="details-body animate-fade">
                              {targetIng.high_dose_effect && (
                                <div className="info-block">
                                  <div className="info-block-title benefit">
                                    <i className="fa-solid fa-circle-check"></i> 고함량 섭취 메리트
                                  </div>
                                  <p>{targetIng.high_dose_effect}</p>
                                </div>
                              )}
                              {targetIng.side_effects && (
                                <div className="info-block">
                                  <div className="info-block-title warning">
                                    <i className="fa-solid fa-triangle-exclamation"></i> 발생 가능한 부작용
                                  </div>
                                  <p>{targetIng.side_effects}</p>
                                </div>
                              )}
                              {targetIng.intake_tip && (
                                <div className="info-block">
                                  <div className="info-block-title tip">
                                    <i className="fa-solid fa-lightbulb"></i> 권장 복용 팁
                                  </div>
                                  <p>{targetIng.intake_tip}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 3a. 식약처 고시 기반 시너지 추천 패키지 */}
              {activeSynergies.length > 0 && (
                <div className="animate-fade" style={{ marginTop: '16px' }}>
                  <div className="section-tag">식약처 고시 데이터 기반 복합 성분 참고 정보</div>
                  <div className="synergy-list" style={{ marginTop: '8px' }}>
                    {activeSynergies.map(syn => (
                      <div key={syn.id} className="synergy-card">
                        <div className="synergy-glow"></div>
                        <div className="synergy-title-row">
                          <div className="synergy-title">
                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                            {syn.name}
                          </div>
                        </div>
                        <div className="synergy-badge-row">
                          {syn.ingredients.map(ingId => (
                            <span key={ingId} className="synergy-ingredient-badge">
                              💊 {ingId}
                            </span>
                          ))}
                        </div>
                        <div className="synergy-desc-text" style={{ fontWeight: '700', color: 'var(--color-secondary)', marginBottom: '4px' }}>
                          시너지 효과: {syn.synergy_effect}
                        </div>
                        <div className="synergy-desc-text">
                          {syn.recommendation_reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="fda-box" style={{ marginTop: '16px' }}>
                <i className="fa-solid fa-circle-info"></i>
                <div>본 안내는 식약처 기능성 원료 고시 데이터를 참조한 정보 제공 목적의 서비스이며, 특정 제품·성분의 효능·효과를 보장하거나 의학적 진단·처방을 대체하지 않습니다. 건강기능식품 섭취 전 전문 의료인 또는 약사와 반드시 상담하시기 바랍니다.</div>
              </div>

              <button 
                className="kfda-open-btn animate-fade" 
                onClick={() => setIsKfdaModalOpen(true)}
              >
                <i className="fa-solid fa-file-shield"></i> 식약처 고시 데이터 기반 부작용 & 대안 성분 참고 정보 보기
              </button>

              <div className="section-tag">쿠팡 관련 상품 안내</div>
              <p style={{ fontSize: '0.65rem', color: '#6B7280', margin: '4px 0 8px', padding: '0 2px' }}>
                ※ 아래 상품 정보(가격·리뷰)는 예시 데이터이며 실제와 다를 수 있습니다. 링크 클릭 시 쿠팡 페이지에서 실제 정보를 확인하세요.
              </p>
              <div className="product-grid" style={{ marginTop: '4px' }}>
                {matchedIngredientsList.map(ing => {
                  const isWarningChecked = !!checkedWarnings[ing.id];
                  const hasAlternative = ing.alternative_ingredient_id && ingredientsMapping[ing.alternative_ingredient_id];
                  const targetIng = (isWarningChecked && hasAlternative) ? { id: ing.alternative_ingredient_id, ...ingredientsMapping[ing.alternative_ingredient_id] } : ing;

                  const productsList = coupangProducts[targetIng.keyword] || defaultMockProducts;
                  return productsList.map((prod, idx) => {
                    const redirectUrl = targetIng.coupang_link || `https://www.coupang.com/np/search?q=${encodeURIComponent(targetIng.keyword)}`;
                    return (
                      <a
                        key={`${ing.id}-${targetIng.id}-${idx}`}
                        href={redirectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-card"
                        onClick={(e) => {
                          // 쿠팡 카드 클릭을 Vercel 커스텀 이벤트로 측정 → "카드를 눌렀는지" 자체를
                          // 쿠팡 집계와 별개로 확인 가능(눌렀는데 안 열림 vs 아예 안 누름 구분).
                          const ua = navigator.userAgent || '';
                          const isInAppBrowser = /Instagram|Threads|FBAN|FBAV|Line\/|KAKAOTALK|NAVER\(inapp|DaumApps|everytimeApp|Snapchat|TikTok/i.test(ua);
                          track('coupang_click', { ingredient: targetIng.id, inApp: isInAppBrowser });
                          // 쓰레드/인스타/카카오 등 인앱 브라우저는 target="_blank"(새 탭)를
                          // 차단하는 경우가 많아 탭해도 아무 동작이 없을 수 있음.
                          // 인앱 웹뷰로 감지되면 같은 탭으로 강제 이동시켜 클릭 유실을 방지.
                          if (isInAppBrowser) {
                            e.preventDefault();
                            window.location.href = redirectUrl;
                          }
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
                              <i className="fa-solid fa-shopping-cart"></i> 쿠팡 바로가기
                            </span>
                          </div>
                        </div>
                      </a>
                    );
                  });
                })}
              </div>

              <button className="reset-btn" onClick={handleReset} style={{ width: '100%', marginBottom: '70px' }}>
                <i className="fa-solid fa-house"></i> 건강고민 다시 선택
              </button>
            </div>
          )}
        </div>

        {activeScreen === 'result' && (
          <>
            {!isAppInstalled && !hideBadgeState && (
              <div className="bookmark-floating-bar animate-fade">
                <div className="floating-text">💡 영양제 새로 바꿀 때마다 바로 검사하기</div>
                <button className="floating-btn" onClick={handleInstallApp}>
                  <i className="fa-solid fa-mobile-screen"></i> {(deferredPrompt && !isMobileDevice) ? '폰 화면에 즉시 앱 추가 (1초)' : '폰 화면에 즐겨찾기 추가 (3초)'}
                </button>
              </div>
            )}
            <div className="coupang-partners-disclaimer">
              이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`app-container ${isMobileDevice ? 'is-mobile-device' : ''} ${!showAdminPanel ? 'hide-admin-layout' : ''}`}>
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
      {!isMobileDevice && (
        <header className="main-header">
          <div className="logo-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <i className="fa-solid fa-prescription-bottle-medical logo-icon"></i>
              <span className="brand-name">Pill<span>Sync</span></span>
              <span className="badge">v1.0.0 Live</span>
              <span 
                className={`badge ${dbMode.includes('Connected') ? 'badge-success' : 'badge-local'}`}
                onClick={toggleDbMode}
                style={{ cursor: 'pointer' }}
                title="클릭하여 로컬/Supabase 모드 강제 전환"
              >
                <i className={`fa-solid ${dbMode.includes('Connected') ? 'fa-cloud' : 'fa-database'}`} style={{ marginRight: '5px' }}></i>
                {dbMode}
              </span>
            </div>

            {/* 관리자 토글 스위치 (비밀 쿼리 스트링 ?admin=true 가 주소창에 있을 때만 노출) */}
            {isAdminQueryActive && (
              <div className="admin-toggle-wrapper animate-fade">
                <span className="admin-toggle-label">⚙️ 관리자 설정 패널</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={showAdminPanel} 
                    onChange={() => setShowAdminPanel(!showAdminPanel)} 
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            )}
          </div>
          <p className="subtitle">식약처 고시 데이터 기반 건강 고민 맞춤형 영양 솔루션</p>
        </header>
      )}

      {/* Dynamic Content Grid */}
      <main className={`content-grid ${!showAdminPanel || isMobileDevice ? 'single-column' : ''}`}>
        
        {/* 일반 PC 와이드 접속이고 어드민이 꺼져있을 때: 2단 분할 프리미엄 레이아웃 */}
        {!isMobileDevice && !showAdminPanel ? (
          <div className="pillsync-desktop-layout animate-fade">
            {/* 좌측: 브랜딩 및 신뢰 영역 */}
            <section className="pillsync-brand-panel animate-fade">
              <div className="brand-badge">식약처 공시 데이터 기반</div>
              <h1 className="brand-title">
                영양제 고를 때 마다<br />
                내 고민 유형별 성분 정보가<br />
                <span>한눈에</span>
              </h1>
              <p className="brand-desc">
                대한민국 식품의약품안전처(MFDS)의 건강기능식품 고시 데이터를 바탕으로, 건강 고민 유형에 맞는 관련 성분 정보와 섭취 주의사항을 안내합니다. 의학적 진단이나 처방을 대체하지 않으며, 섭취 전 전문가 상담을 권장합니다.
              </p>

              <div className="trust-points">
                <div className="trust-point">
                  <div className="point-icon"><i className="fa-solid fa-file-shield"></i></div>
                  <div className="point-info">
                    <h4>식약처 고시 공식 데이터 준수</h4>
                    <p>건강기능식품 공전 및 식약처 인허가 성분 수치를 직관적인 충족 게이지로 제공합니다.</p>
                  </div>
                </div>
                <div className="trust-point">
                  <div className="point-icon"><i className="fa-solid fa-triangle-exclamation"></i></div>
                  <div className="point-info">
                    <h4>부작용 유발 원료 필터링</h4>
                    <p>기저 질환 체크를 통해 복통, 설사, 두통을 일으킬 수 있는 유해 자극 성분을 미리 대안 추천합니다.</p>
                  </div>
                </div>
              </div>

              {!isAppInstalled && !hideBadgeState && (
                <div className="desktop-pwa-cta-card animate-pulse-subtle" onClick={handleInstallApp}>
                  <div className="cta-icon">
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <div className="cta-info">
                    <h4>PillSync 바탕화면 앱 추가</h4>
                    <p>언제든지 바탕화면에서 바로 성분 정보를 확인할 수 있도록 바로가기를 등록해 두세요.</p>
                  </div>
                  <i className="fa-solid fa-chevron-right cta-arrow"></i>
                </div>
              )}
            </section>

            {/* 우측: 실제 서비스 동작 영역 (폰 모형 테두리 없음!) */}
            <section className="pillsync-service-panel animate-fade">
              <div className="web-app-frame">
                {renderAppScreen()}
              </div>
            </section>
          </div>
        ) : (
          /* 모바일 기기이거나 어드민 패널이 켜져 있을 때: 기존 에뮬레이터/어드민 레이아웃 유지 */
          <>
            <section className="device-section">
              {!showAdminPanel && (
                <div className="section-title">
                  <i className="fa-solid fa-mobile-screen-button"></i> 모바일 서비스 화면
                </div>
              )}
              <div className="mobile-frame">
                {!isMobileDevice && (
                  <div className="status-bar">
                    <span className="time">{systemTime}</span>
                    <div className="icons">
                      <i className="fa-solid fa-signal" style={{marginRight: '4px'}}></i>
                      <i className="fa-solid fa-wifi" style={{marginRight: '4px'}}></i>
                      <i className="fa-solid fa-battery-three-quarters"></i>
                    </div>
                  </div>
                )}
                {renderAppScreen()}
              </div>
            </section>
          </>
        )}

        {/* RIGHT: Realtime Database administration view panel */}
        {!isMobileDevice && showAdminPanel && (
          <section className="admin-section animate-fade">
          <div className="section-title">
            <i className="fa-solid fa-database"></i> 실시간 DB & 관리자 설정 패널
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
                            <th>식약처 기능성 요약</th>
                            <th>일일 권장량</th>
                            <th>고함량 기준</th>
                            <th>주의 부작용</th>
                            <th>쿠팡 검색어</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.keys(ingredientsMapping).map(key => {
                            const ing = ingredientsMapping[key];
                            return (
                              <tr key={key}>
                                <td><strong>{key}</strong></td>
                                <td>{ing.desc}</td>
                                <td>{ing.kfda_daily_intake || "-"}</td>
                                <td>{ing.high_dose_ratio || "-"}</td>
                                <td>{ing.side_effects ? ing.side_effects.substring(0, 30) + "..." : "-"}</td>
                                <td><span className="keyword-badge">{ing.keyword}</span></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* synergy_combinations table */}
                  <div className="db-table-card">
                    <h4><i className="fa-solid fa-wand-magic-sparkles"></i> Synergy_Combinations (추천 시너지 조합)</h4>
                    <div className="table-container">
                      <table>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>조합명</th>
                            <th>매칭 성분 목록</th>
                            <th>시너지 효과 요약</th>
                            <th>상세 추천 사유</th>
                          </tr>
                        </thead>
                        <tbody>
                          {synergyCombinations.map(syn => (
                            <tr key={syn.id}>
                              <td>{syn.id}</td>
                              <td><strong>{syn.name}</strong></td>
                              <td>
                                {syn.ingredients.map(ingId => (
                                  <span key={ingId} className="keyword-badge" style={{ marginRight: '4px' }}>
                                    {ingId}
                                  </span>
                                ))}
                              </td>
                              <td>{syn.synergy_effect}</td>
                              <td>{syn.recommendation_reason}</td>
                            </tr>
                          ))}
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
        )}
 
      </main>

      {/* Decorative page footer */}
      {!isMobileDevice && (
        <footer className="footer">
          <p>© 2026 PillSync. All Rights Reserved. 식약처 고시 데이터 참조 건강기능식품 성분 정보 안내 서비스. 본 서비스는 의료 행위가 아니며 전문가 상담을 대체하지 않습니다.</p>
        </footer>
      )}

      {/* KFDA Report Modal Dialog Overlay */}
      <KfdaReportModal
        isOpen={isKfdaModalOpen}
        onClose={() => setIsKfdaModalOpen(false)}
        ingredientsMapping={ingredientsMapping}
        matchedIngredientIds={matchedIngredientsList.map(i => i.id)}
      />

      {/* Bookmark Guide Modal */}
      <BookmarkGuideModal
        isOpen={isBookmarkModalOpen}
        onClose={() => setIsBookmarkModalOpen(false)}
      />
    </div>
  );
}

function KfdaReportModal({ isOpen, onClose, ingredientsMapping, matchedIngredientIds }) {
  if (!isOpen) return null;

  const kfdaData = [
    {
      category: "피로 개선",
      items: [
        {
          key: "밀크씨슬",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "실리마린 기준 130 mg",
          warning: "이상사례 발생 시 섭취를 중단할 것. 위장장애, 설사가 있을 시 주의.",
          alternative: "홍경천 추출물",
          altReason: "밀크씨슬 추출물은 위와 장을 강하게 자극하여 소화기 통증이나 설사를 일으킬 수 있으므로, 부작용 없이 부신 활력을 회복하는 홍경천 추출물을 추천합니다."
        },
        {
          key: "비타민B군",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "비타민B1 기준 1.2 mg",
          warning: "고함량 섭취 시 소변이 형광 노란색으로 변하거나 일시적으로 불면증, 위장 장애가 발생할 수 있습니다.",
          alternative: null,
          altReason: null
        },
        {
          key: "홍경천 추출물",
          type: "gaebel",
          typeName: "개별인정형 원료",
          daily: "로디올라오사이드 기준 200 mg",
          warning: "임산부, 수유부, 영유아 및 어린이는 섭취에 주의할 것.",
          alternative: null,
          altReason: null
        },
        {
          key: "홍삼",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "진세노사이드 기준 3 mg",
          warning: "의약품(당뇨치료제, 혈액항응고제) 복용 시 섭취에 주의할 것. 교감신경 흥분 유발 가능.",
          alternative: "L-테아닌",
          altReason: "홍삼은 혈관을 이완시키나 체질에 따라 교감신경을 흥분시켜 혈압 상승 및 가슴 두근거림을 초래할 수 있습니다. 대신 뇌 세포를 안정시켜 스트레스 긴장을 부드럽게 이완해주는 L-테아닌을 권장합니다."
        },
        {
          key: "L-테아닌",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "L-테아닌으로서 200~250 mg",
          warning: "카페인 함유 음료(커피, 홍차, 녹차 등)와 병용 섭취에 주의할 것.",
          alternative: null,
          altReason: null
        }
      ]
    },
    {
      category: "다이어트",
      items: [
        {
          key: "가르시니아",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "HCA 기준 750~2,800 mg",
          warning: "어린이, 임산부 및 수유부는 섭취를 피할 것. 간·신장·심장질환, 알레르기 및 천식이 있거나 의약품 복용 시 전문가와 상담할 것.",
          alternative: "L-카르니틴",
          altReason: "가르시니아(HCA)는 드물게 호르몬 균형에 영향을 주어 생리불순이나 간독성을 유발할 수 있습니다. 대신 부작용 없이 체지방을 미토콘드리아로 유입하여 태우는 안전한 대사 촉진 성분인 L-카르니틴을 대안으로 추천합니다."
        },
        {
          key: "녹차카테킨",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "카테킨 기준 300~500 mg",
          warning: "카페인이 함유되어 있어 초조감, 불면 등을 나타낼 수 있음. 식사 후 섭취할 것. 간 질환이 있거나 의약품 복용 시 전문가와 상담할 것.",
          alternative: "콜레우스포스콜리",
          altReason: "녹차카테킨 제품은 녹차 유래 천연 카페인을 소량 함유하고 있어 민감한 분들께 심장 두근거림이나 불면증을 악화시킬 수 있습니다. 대신 천연 무카페인 성분으로 기초 대사를 안전하게 끌어올려주는 콜레우스포스콜리를 적극 권장합니다."
        },
        {
          key: "콜레우스포스콜리",
          type: "gaebel",
          typeName: "개별인정형 원료",
          daily: "포스콜린 기준 50 mg",
          warning: "임산부, 수유부, 영유아, 어린이 및 수술 전후 환자는 섭취를 피할 것. 항응고제 또는 혈압조절제를 복용하거나 혈압이 낮은 사람은 주의할 것.",
          alternative: null,
          altReason: null
        },
        {
          key: "시서스",
          type: "gaebel",
          typeName: "개별인정형 원료",
          daily: "시서스 추출물 기준 300 mg",
          warning: "영·유아, 어린이, 임산부 및 수유부는 섭취를 피할 것. 혈당강하제를 복용하는 사람은 전문가와 상담할 것.",
          alternative: null,
          altReason: null
        },
        {
          key: "L-카르니틴",
          type: "gaebel",
          typeName: "개별인정형 원료",
          daily: "L-카르니틴 타르트레이트 기준 2,000 mg",
          warning: "어린이, 임산부 및 수유부는 섭취를 피할 것. 특정 성분에 알레르기가 있는 사람은 주의할 것.",
          alternative: null,
          altReason: null
        }
      ]
    },
    {
      category: "탈모 & 모발 건강",
      items: [
        {
          key: "비오틴",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "에너지 생성 필수량 30 mcg",
          warning: "과량의 비오틴 섭취 시 피지 분비가 폭발하여 여드름이나 뾰루지 등 트러블이 올라올 수 있습니다.",
          alternative: "L-시스틴",
          altReason: "초고함량 비오틴은 지성 피부군에서 피지선을 과자극하여 모낭 트러블이나 뾰루지를 유발할 수 있습니다. 모발 단백질의 핵심 원료 구조를 튼튼하게 강화해주면서 피지 조절을 돕는 L-시스틴을 훌륭한 대안으로 추천합니다."
        },
        {
          key: "맥주효모",
          type: "gaebel",
          typeName: "일반식품 원료",
          daily: "건조 맥주효모 기준 3,000 mg",
          warning: "퓨린 함량이 매우 높으므로 통풍 기왕력이 있거나 요산 수치가 높은 분은 관절 통증을 발현합니다.",
          alternative: "판토텐산",
          altReason: "맥주효모는 세포 증식을 돕는 퓨린(Purine) 함량이 극도로 높아 통풍 환자에게 급성 발작을 유발할 수 있습니다. 대신 퓨린 걱정이 전혀 없으면서 두피 모근 세포의 재생과 영양을 채워주는 판토텐산을 안전한 대안으로 권장합니다."
        },
        {
          key: "아연",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "세포분열 필수량 8.5 mg",
          warning: "아연은 위장벽 자극이 심한 편이므로 반드시 식후에 충분한 물과 함께 섭취하세요.",
          alternative: "맥주효모",
          altReason: "아연은 위장 점막을 직접적으로 강하게 자극하여 고함량 섭취 시 극심한 메스꺼움이나 쓰림을 유발하기 쉽습니다. 위장에 전혀 부담을 주지 않으면서 천연 아미노산 단백질 공급원이 되는 맥주효모를 대안으로 추천합니다."
        },
        {
          key: "L-시스틴",
          type: "gosi",
          typeName: "아미노산 원료",
          daily: "L-시스틴 기준 500 mg",
          warning: "위장 장애 및 기관지 분비액 유발 우려가 있으므로 만성 천식 환자는 의사 상담이 권고됩니다.",
          alternative: null,
          altReason: null
        },
        {
          key: "판토텐산",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "판토텐산 기준 5 mg",
          warning: "수용성 비타민으로 체내 축적이 없고 부작용이 거의 없으나 간혹 가벼운 복통이 생길 수 있습니다.",
          alternative: null,
          altReason: null
        }
      ]
    },
    {
      category: "눈 건강",
      items: [
        {
          key: "루테인지아잔틴",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "루테인지아잔틴 단일/복합 기준 10~20 mg",
          warning: "과다 섭취 시 피부가 일시적으로 황색으로 변할 수 있습니다.",
          alternative: "헤마토코쿠스 추출물",
          altReason: "루테인지아잔틴은 카로티노이드 성분으로 일부 민감한 분들께 피부 황색 변색이 나타날 수 있습니다. 대신 눈의 피로도 개선에 도움을 줄 수 있는 헤마토코쿠스 추출물(아스타잔틴)을 대안으로 참고하실 수 있습니다."
        },
        {
          key: "헤마토코쿠스 추출물",
          type: "gaebel",
          typeName: "개별인정형 원료",
          daily: "아스타잔틴 기준 4~12 mg",
          warning: "과량 섭취 시 일시적으로 대변 색이 붉게 변하거나 피부가 붉어질 수 있습니다.",
          alternative: null,
          altReason: null
        }
      ]
    },
    {
      category: "혈행 개선",
      items: [
        {
          key: "오메가3",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "EPA와 DHA의 합 기준 500~2,000 mg",
          warning: "어유 특유의 생선 비린내나 소화불량이 발생할 수 있으며, 혈액 응고를 방해하므로 수술을 앞둔 분은 주의해야 합니다.",
          alternative: "은행잎 추출물",
          altReason: "동물성 오메가3는 어유 특유의 어취나 소화 불량, 혹은 혈액 응고 지연으로 인한 멍 발생 등의 부작용을 일으킬 수 있습니다. 대신 냄새 부담이 없고 혈행 개선에 도움을 줄 수 있는 은행잎 추출물을 대안으로 참고하실 수 있습니다."
        },
        {
          key: "은행잎 추출물",
          type: "gosi",
          typeName: "고시형 원료",
          daily: "플라보놀 배당체 기준 24~36 mg",
          warning: "일시적인 두통, 어지러움, 소화불량 및 출혈 경향이 증가할 수 있습니다. 수술 전후 3~4일 동안은 섭취를 중단하세요.",
          alternative: null,
          altReason: null
        }
      ]
    },
    {
      category: "수면 & 스트레스",
      items: [
        {
          key: "감태 추출물",
          type: "gaebel",
          typeName: "개별인정형 원료",
          daily: "디엑콜 기준 30 mg",
          warning: "과다 복용 시 다음날 오전까지 경미한 나른함이나 나른한 졸음이 지속될 수 있습니다. 요오드 성분 및 해조류 알레르기가 있는 분은 주의가 필요합니다.",
          alternative: "락티움",
          altReason: "감태 추출물은 요오드 성분이 소량 함유되어 갑상선 질환군 등에게 자극이 될 수 있고 해조류 알레르기로 인한 가려움이 생길 수 있습니다. 우유 유래 단백질 분해물로 수면 리듬을 편안하게 조절해주는 락티움을 대안으로 권장합니다."
        },
        {
          key: "락티움",
          type: "gaebel",
          typeName: "개별인정형 원료",
          daily: "알파에스1카제인 기준 2.2~3.2 mg",
          warning: "우유 알레르기가 있거나 유당불내증이 심한 경우 설사나 복통을 유발할 수 있습니다.",
          alternative: "L-테아닌",
          altReason: "락티움은 우유 단백질 가수분해물로서 심한 유당불내증이 있는 분들께 소화기 불편감을 유발할 수 있습니다. 대신 우유 유래 성분이 없으면서 긴장 완화에 도움을 줄 수 있는 L-테아닌을 대안으로 참고하실 수 있습니다."
        }
      ]
    }
  ];

  const filteredKfdaData = kfdaData
    .map(cat => ({ ...cat, items: cat.items.filter(item => matchedIngredientIds.includes(item.key)) }))
    .filter(cat => cat.items.length > 0);

  return (
    <div className="kfda-modal-overlay" onClick={onClose}>
      <div className="kfda-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="kfda-modal-header">
          <div className="kfda-modal-title">
            <i className="fa-solid fa-file-shield"></i> 식약처 고시 데이터 기반 부작용 & 대안 성분 참고 정보
          </div>
          <button className="kfda-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div className="kfda-modal-body">
          <div className="kfda-modal-disclaimer">
            <strong>[법적 면책 고지]</strong><br />
            본 정보는 대한민국 식품의약품안전처(MFDS) 기능성 원료 고시 및 건강기능식품 공전을 참조하여 작성된 일반 정보 제공 자료입니다. 식약처가 본 서비스의 추천 방식이나 매칭 로직을 승인·인증한 사실이 없으며, 특정 질병의 진단·치료·예방을 목적으로 하지 않습니다. 건강기능식품 섭취 전 반드시 전문 의료인 또는 약사와 상담하시기 바랍니다.
          </div>

          <div className="kfda-law-links">
            <a href="https://www.law.go.kr/행정규칙/건강기능식품의기준및규격" target="_blank" rel="noopener noreferrer" className="kfda-law-link-item">
              <span>⚖️ 식약처 건강기능식품 기준 및 규격 고시 전문</span>
              <i className="fa-solid fa-up-right-from-square"></i>
            </a>
            <a href="https://www.foodsafetykorea.go.kr" target="_blank" rel="noopener noreferrer" className="kfda-law-link-item">
              <span>🌐 식품안전나라 공식 홈페이지</span>
              <i className="fa-solid fa-up-right-from-square"></i>
            </a>
          </div>

          {filteredKfdaData.map((cat, cIdx) => (
            <div key={cIdx} className="kfda-category-section">
              <div className="kfda-category-title">
                <i className="fa-solid fa-circle-chevron-right"></i> {cat.category}
              </div>
              {cat.items.map((item, iIdx) => {
                const ingData = ingredientsMapping[item.key] || {};
                return (
                  <div key={iIdx} className="kfda-ingredient-card">
                    <div className="kfda-ing-header">
                      <span className="kfda-ing-name">{item.key} ({ingData.name || item.key})</span>
                      <span className={`kfda-ing-badge ${item.type === 'gosi' ? 'kfda-badge-gosi' : 'kfda-badge-gaebel'}`}>
                        {item.typeName}
                      </span>
                    </div>
                    <div className="kfda-ing-details">
                      <div className="kfda-ing-detail-row">
                        <span className="kfda-ing-detail-label">식약처 고시 기능성 내용</span>
                        <span className="kfda-ing-detail-value">{ingData.desc || "에너지 대사 및 건강 증진 도움"}</span>
                      </div>
                      <div className="kfda-ing-detail-row">
                        <span className="kfda-ing-detail-label">일일 권장 섭취량</span>
                        <span className="kfda-ing-detail-value">{item.daily}</span>
                      </div>
                      <div className="kfda-ing-detail-row">
                        <span className="kfda-ing-detail-label">섭취 시 주의사항 (부작용)</span>
                        <span className="kfda-ing-detail-value" style={{ color: '#F87171' }}>{item.warning}</span>
                      </div>
                      {item.alternative && (
                        <div className="kfda-ing-detail-row" style={{ marginTop: '4px', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '4px' }}>
                          <span className="kfda-ing-detail-label" style={{ color: '#FB923C' }}>💡 부작용 예방 대안 성분</span>
                          <span className="kfda-ing-detail-value">
                            <strong>{item.alternative}</strong> 로의 스왑 추천
                          </span>
                          <span className="kfda-ing-detail-value" style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '2px' }}>
                            {item.altReason}
                          </span>
                        </div>
                      )}
                      <div className="kfda-ing-link-row">
                        <a 
                          href="https://www.foodsafetykorea.go.kr" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="kfda-ing-link"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`식품안전나라 사이트로 이동합니다.\n상단 메뉴 [식품·안전 > 건강기능식품 > 건강기능식품 원료별 정보]에서 '${item.key}'를 직접 검색하시면 세션 만료 에러 없이 고시 요약본 조회가 가능합니다.`);
                          }}
                        >
                          식품안전나라 원료 검색 가이드 ➔
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// PWA / Bookmark Add to Home Screen Guide Modal Component
// ==========================================================
function getDeviceDefaultTab() {
  if (typeof window === 'undefined') return 'ios';
  const ua = navigator.userAgent || navigator.vendor || window.opera;
  if (/android/i.test(ua)) {
    return 'android';
  } else if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
    return 'ios';
  } else {
    return 'pc';
  }
}

function BookmarkGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState(getDeviceDefaultTab);

  if (!isOpen) return null;

  return (
    <div className="bookmark-modal-overlay" onClick={onClose}>
      <div className="bookmark-modal-content animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="bookmark-modal-header">
          <div className="bookmark-modal-title">
            <i className="fa-solid fa-star" style={{ color: '#FBBF24' }}></i> PillSync 즐겨찾기 추가
          </div>
          <button className="bookmark-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="bookmark-modal-body">
          <p className="bookmark-intro-text">
            영양제가 새로 바뀌거나 몸 상태가 달라졌을 때, 언제든 원클릭으로 다시 검사할 수 있도록 홈 화면에 추가해보세요!
          </p>

          {/* Device Tabs */}
          <div className="bookmark-tabs">
            <button 
              className={`bookmark-tab-btn ${activeTab === 'ios' ? 'active' : ''}`}
              onClick={() => setActiveTab('ios')}
            >
              <i className="fa-brands fa-apple"></i> iOS Safari
            </button>
            <button 
              className={`bookmark-tab-btn ${activeTab === 'android' ? 'active' : ''}`}
              onClick={() => setActiveTab('android')}
            >
              <i className="fa-brands fa-android"></i> Android
            </button>
            <button 
              className={`bookmark-tab-btn ${activeTab === 'pc' ? 'active' : ''}`}
              onClick={() => setActiveTab('pc')}
            >
              <i className="fa-solid fa-desktop"></i> PC 북마크
            </button>
          </div>

          {/* Tab Content */}
          <div className="bookmark-tab-content">
            {activeTab === 'ios' && (
              <div className="guide-steps animate-fade">
                <div className="guide-step">
                  <div className="step-num">1</div>
                  <div className="step-text">
                    아이폰/아이패드 <strong>Safari 브라우저</strong>로 접속한 후, 하단 툴바의 <strong>공유 버튼 <i className="fa-solid fa-share-from-square" style={{ color: 'var(--color-accent)' }}></i></strong>을 탭합니다.
                  </div>
                </div>
                <div className="guide-step">
                  <div className="step-num">2</div>
                  <div className="step-text">
                    공유 메뉴 리스트를 아래로 스크롤하여 <strong>'홈 화면에 추가' <i className="fa-regular fa-square-plus" style={{ color: 'var(--color-secondary)' }}></i></strong> 항목을 찾아서 탭합니다.
                  </div>
                </div>
                <div className="guide-step">
                  <div className="step-num">3</div>
                  <div className="step-text">
                    우측 상단의 <strong>'추가'</strong> 버튼을 클릭하면 폰 화면에 PillSync 바로가기 앱 아이콘이 생성됩니다.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'android' && (
              <div className="guide-steps animate-fade">
                <div className="guide-step">
                  <div className="step-num">1</div>
                  <div className="step-text">
                    <strong>Chrome</strong> 또는 <strong>삼성 인터넷</strong> 브라우저에서 우측 상단(혹은 하단)의 <strong>더보기 버튼 <i className="fa-solid fa-ellipsis-vertical" style={{ color: 'var(--text-muted)' }}></i> / <i className="fa-solid fa-bars" style={{ color: 'var(--text-muted)' }}></i></strong>을 탭합니다.
                  </div>
                </div>
                <div className="guide-step">
                  <div className="step-num">2</div>
                  <div className="step-text">
                    메뉴 리스트에서 <strong>'홈 화면에 추가'</strong>를 탭합니다. (삼성 인터넷은 <strong>'현재 페이지 추가'</strong> 누른 뒤 <strong>'홈 화면'</strong> 선택)
                  </div>
                </div>
                <div className="guide-step">
                  <div className="step-num">3</div>
                  <div className="step-text">
                    등록 확인 팝업이 뜨면 <strong>'추가'</strong> 버튼을 눌러 홈 화면 추가를 완료합니다.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pc' && (
              <div className="guide-steps animate-fade">
                <div className="guide-step">
                  <div className="step-num">1</div>
                  <div className="step-text">
                    브라우저 주소창 우측에 있는 <strong>별표(⭐) 아이콘</strong>을 클릭하여 북마크로 빠르게 등록할 수 있습니다.
                  </div>
                </div>
                <div className="guide-step">
                  <div className="step-num">2</div>
                  <div className="step-text">
                    또는 아래의 키보드 단축키를 눌러 바로 추가해보세요:
                    <div className="shortcut-box">
                      <div>Windows: <kbd>Ctrl</kbd> + <kbd>D</kbd></div>
                      <div>Mac: <kbd>Cmd</kbd> + <kbd>D</kbd></div>
                    </div>
                  </div>
                </div>
                <div className="guide-step">
                  <div className="step-num">3</div>
                  <div className="step-text">
                    <strong>북마크바 표시</strong> 단축키(<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd> / <kbd>Cmd</kbd>+<kbd>Shift</kbd>+<kbd>B</kbd>)를 누르면 상단바에서 언제든지 빠르게 원클릭 접속할 수 있습니다.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bookmark-modal-footer">
          <button className="confirm-btn" onClick={onClose}>확인했습니다</button>
        </div>
      </div>
    </div>
  );
}

export default App;
