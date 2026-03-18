const translations = {
    zh: {
        title: '霍尔木兹扫雷',
        beginner: '初级',
        intermediate: '中级',
        expert: '高级',
        minesLeft: '剩余雷数',
        time: '时间',
        close: '关闭',
        failTitle: '💥 川普被炸',
        successTitle: '🚢 油轮通过海峡',
        gameOver: '游戏结束',
        gameWin: '胜利！',
        language: '语言'
    },
    en: {
        title: 'Hormuz Minesweeper',
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        expert: 'Expert',
        minesLeft: 'Mines',
        time: 'Time',
        close: 'Close',
        failTitle: '💥 Trump Bombed',
        successTitle: '🚢 Tanker Crossed',
        gameOver: 'Game Over',
        gameWin: 'You Win!',
        language: 'Language'
    },
    ja: {
        title: 'ホルムズマインスイーパー',
        beginner: '初級',
        intermediate: '中級',
        expert: '上級',
        minesLeft: '地雷',
        time: '時間',
        close: '閉じる',
        failTitle: '💥 トループ炸死',
        successTitle: '🚢 タンカー海峡通過',
        gameOver: 'ゲームオーバー',
        gameWin: '勝利！',
        language: '言語'
    },
    ko: {
        title: '호르무즈 지뢰 찾기',
        beginner: '초급',
        intermediate: '중급',
        expert: '고급',
        minesLeft: '지뢰',
        time: '시간',
        close: '닫기',
        failTitle: '💥 트럼프 폭격',
        successTitle: '🚢 유조선 해협 통과',
        gameOver: '게임 오버',
        gameWin: '승리!',
        language: '언어'
    },
    fr: {
        title: 'Démineur de Hormuz',
        beginner: 'Débutant',
        intermediate: 'Intermédiaire',
        expert: 'Expert',
        minesLeft: 'Mines',
        time: 'Temps',
        close: 'Fermer',
        failTitle: '💥 Trump Bombardé',
        successTitle: '🚢 Pétrolier Traversé',
        gameOver: 'Perdu',
        gameWin: 'Gagné!',
        language: 'Langue'
    },
    es: {
        title: 'Buscaminas de Hormuz',
        beginner: 'Principiante',
        intermediate: 'Intermedio',
        expert: 'Experto',
        minesLeft: 'Minas',
        time: 'Tiempo',
        close: 'Cerrar',
        failTitle: '💥 Trump Bombardead',
        successTitle: '🚢 Petrolero Cruzado',
        gameOver: 'Fin del Juego',
        gameWin: '¡Ganaste!',
        language: 'Idioma'
    },
    ar: {
        title: 'لعبة الغوم في هرمز',
        beginner: 'مبتدئ',
        intermediate: 'متوسط',
        expert: 'خبير',
        minesLeft: 'الألغام',
        time: 'الوقت',
        close: 'إغلاق',
        failTitle: '💥 ترمب ينفجر',
        successTitle: '🚢 ناقلة تعبر المضيق',
        gameOver: 'انتهت اللعبة',
        gameWin: 'فزت!',
        language: 'اللغة'
    },
    fa: {
        title: 'مین‌گذاری هرمز',
        beginner: 'مبتدی',
        intermediate: 'متوسط',
        expert: 'حرفه‌ای',
        minesLeft: 'مین‌ها',
        time: 'زمان',
        close: 'بستن',
        failTitle: '💥 ترامپ بمب‌گذاری شد',
        successTitle: '🚢 نفتکش از تنگه عبور کرد',
        gameOver: 'بازی تمام شد',
        gameWin: 'برنده شدید!',
        language: 'زبان'
    }
};

let currentLang = localStorage.getItem('lang') || 'zh';

function t(key) {
    return translations[currentLang]?.[key] || translations.zh[key] || key;
}

function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        updateLanguageDisplay();
        updateUIText();
    }
}

function updateLanguageDisplay() {
    const langNames = {
        zh: '中文', en: 'English', ja: '日本語', ko: '한국어',
        fr: 'Français', es: 'Español', ar: 'العربية', fa: 'فارسی'
    };
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
}

function updateUIText() {
    document.querySelectorAll('[data-i18]').forEach(el => {
        const key = el.dataset.i18;
        el.textContent = t(key);
    });

    const langNames = {
        zh: '中文', en: 'English', ja: '日本語', ko: '한국어',
        fr: 'Français', es: 'Español', ar: 'العربية', fa: 'فارسی'
    };
    
    document.querySelectorAll('.lang-current').forEach(el => {
        el.textContent = langNames[currentLang];
    });
}

function initI18n() {
    updateUIText();
}
