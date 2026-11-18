export type Language = 'uz' | 'ru' | 'en';

export interface Translations {
  common: {
    brandName: string;
    slogan: string;
    brandPhilosophy: string;
    login: string;
    register: string;
    logout: string;
    dashboard: string;
    settings: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    actions: string;
    status: string;
    date: string;
    price: string;
    search: string;
    filter: string;
    all: string;
    loading: string;
    viewDetails: string;
    noData: string;
    back: string;
    submit: string;
    send: string;
    contact: string;
    city: string;
    region: string;
    uzs: string;
    demoBadge: string;
  };
  roles: {
    CUSTOMER: string;
    CREATOR: string;
    SELLER: string;
    ADMIN: string;
  };
  orderStatuses: {
    REQUEST_SUBMITTED: string;
    UNDER_REVIEW: string;
    QUOTATION_SENT: string;
    CUSTOMER_APPROVED: string;
    IN_PROGRESS: string;
    READY: string;
    COMPLETED: string;
    CANCELLED: string;
  };
  categories: {
    FABRIC: string;
    THREAD: string;
    BUTTONS: string;
    ZIPPERS: string;
    ACCESSORIES: string;
    TRIM: string;
  };
  nav: {
    home: string;
    howItWorks: string;
    tailors: string;
    marketplace: string;
    about: string;
    socialImpact: string;
    aiStudio: string;
    myOrders: string;
    messages: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    ctaDesign: string;
    ctaTailors: string;
    problemTitle: string;
    problemDesc: string;
    forTailorsTitle: string;
    forTailorsDesc: string;
    forCustomersTitle: string;
    forCustomersDesc: string;
    forSellersTitle: string;
    forSellersDesc: string;
    aiSectionTitle: string;
    aiSectionSubtitle: string;
    aiSectionDesc: string;
    featuredTailors: string;
    featuredMaterials: string;
    impactTitle: string;
    impactDesc: string;
    impactDisclaimer: string;
    ctaRegisterTitle: string;
    ctaRegisterDesc: string;
  };
  auth: {
    welcomeBack: string;
    createAccount: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
    selectRole: string;
    customerRoleDesc: string;
    creatorRoleDesc: string;
    sellerRoleDesc: string;
    agreeTerms: string;
    haveAccount: string;
    noAccount: string;
    forgotPassword: string;
    resetPassword: string;
    errors: {
      passwordMismatch: string;
      invalidEmail: string;
      passwordShort: string;
      roleRequired: string;
      termsRequired: string;
      unauthorized: string;
      invalidCredentials: string;
      userExists: string;
    };
  };
  ai: {
    studioTitle: string;
    studioSubtitle: string;
    categoryLabel: string;
    styleLabel: string;
    seasonLabel: string;
    colorsLabel: string;
    budgetLabel: string;
    descriptionLabel: string;
    generateBtn: string;
    saveDesignBtn: string;
    orderWithDesignBtn: string;
    keyMissingTitle: string;
    keyMissingDesc: string;
    manualModePrompt: string;
    recommendedFabrics: string;
    recommendedAccessories: string;
    technicalNotes: string;
  };
  orders: {
    orderNumber: string;
    createOrderTitle: string;
    selectTailor: string;
    designNotes: string;
    measurements: string;
    deliveryAddress: string;
    sendRequestBtn: string;
    quotationReceived: string;
    offeredPrice: string;
    estimatedDays: string;
    tailorNotes: string;
    acceptQuotation: string;
    rejectQuotation: string;
    sendQuotationBtn: string;
    updateStatusBtn: string;
    noOrdersFound: string;
  };
  impact: {
    registeredTailors: string;
    activeOrders: string;
    completedOrders: string;
    marketplaceVolume: string;
    registeredSellers: string;
    verifiedDataNotice: string;
    povertyReductionMission: string;
  };
}

export const translations: Record<Language, Translations> = {
  uz: {
    common: {
      brandName: "CROOKED RIB",
      slogan: "Fashion. Tailoring. Your Rules.",
      brandPhilosophy: "Qolipga sig‘maydiganlar uchun.",
      login: "Kirish",
      register: "Ro‘yxatdan o‘tish",
      logout: "Chiqish",
      dashboard: "Boshqaruv paneli",
      settings: "Sozlamalar",
      save: "Saqlash",
      cancel: "Bekor qilish",
      edit: "Tahrirlash",
      delete: "O‘chirish",
      actions: "Amallar",
      status: "Holat",
      date: "Sana",
      price: "Narx",
      search: "Qidirish",
      filter: "Filtr",
      all: "Barchasi",
      loading: "Yuklanmoqda...",
      viewDetails: "Batafsil",
      noData: "Ma’lumot topilmadi",
      back: "Orqaga",
      submit: "Yuborish",
      send: "Jo‘natish",
      contact: "Bog‘lanish",
      city: "Shahar",
      region: "Viloyat / Hudud",
      uzs: "so‘m",
      demoBadge: "Demo / Namunaviy ma’lumot",
    },
    roles: {
      CUSTOMER: "Mijoz (Buyurtmachi)",
      CREATOR: "Tikuvchi / Dizayner",
      SELLER: "Mato va aksessuarlar sotuvchisi",
      ADMIN: "Administrator",
    },
    orderStatuses: {
      REQUEST_SUBMITTED: "So‘rov yuborildi",
      UNDER_REVIEW: "Ko‘rib chiqilmoqda",
      QUOTATION_SENT: "Narx taklifi yuborildi",
      CUSTOMER_APPROVED: "Mijoz tomonidan tasdiqlandi",
      IN_PROGRESS: "Tikish jarayonida",
      READY: "Tayyor",
      COMPLETED: "Yakunlandi",
      CANCELLED: "Bekor qilindi",
    },
    categories: {
      FABRIC: "Mato",
      THREAD: "Ip",
      BUTTONS: "Tugmalar",
      ZIPPERS: "Zamok / Molniya",
      ACCESSORIES: "Aksessuarlar",
      TRIM: "Bezak va lentalar",
    },
    nav: {
      home: "Bosh sahifa",
      howItWorks: "Qanday ishlaydi?",
      tailors: "Tikuvchilar",
      marketplace: "Mato va bezaklar",
      about: "Loyiha haqida",
      socialImpact: "Ijtimoiy ta’sir",
      aiStudio: "AI Kiyim Studio",
      myOrders: "Buyurtmalarim",
      messages: "Xabarlar",
    },
    landing: {
      heroTitle: "Sizning g‘oyangiz — ularning mahorati — yangi imkoniyatlar.",
      heroSubtitle: "Sun’iy intellekt yordamida kiyim g‘oyangizni yarating, mos materiallarni toping va mahalliy tikuvchilarga buyurtma bering.",
      ctaDesign: "Kiyim yaratish",
      ctaTailors: "Tikuvchilarni ko‘rish",
      problemTitle: "Ijtimoiy maqsadimiz",
      problemDesc: "Uyda tikuvchilik qiluvchi xotin-qizlar, ishsiz tikuvchi ayollar va kichik ustaxonalarni buyurtmachilar bilan to‘g‘ridan-to‘g‘ri bog‘lash orqali daromad olish imkoniyatlarini kengaytiramiz.",
      forTailorsTitle: "Tikuvchilar uchun",
      forTailorsDesc: "O‘z portfoliongizni ko‘rsating, qulay narx va muddat belgilang, real buyurtmalarni qabul qiling va doimiy daromad manbaiga ega bo‘ling.",
      forCustomersTitle: "Mijozlar uchun",
      forCustomersDesc: "AI yordamida o‘ziga xos kiyim dizaynini loyihalashtiring, matolarni tanlang va o‘z hududingizdagi mohir tikuvchiga buyurtma bering.",
      forSellersTitle: "Sotuvchilar uchun",
      forSellersDesc: "Mato, ip va aksessuarlaringizni tikuvchilar va buyurtmachilarga to‘g‘ridan-to‘g‘ri taklif qiling.",
      aiSectionTitle: "AI Fashion Design Studio",
      aiSectionSubtitle: "Sun’iy intellekt — kiyim g‘oyasidan real tikuvgacha ko‘prik",
      aiSectionDesc: "Kiyim turi, uslubi, fasl va ranglarini tanlang. AI mato xususiyatlari, kerakli bezaklar va tikuvchiga beriladigan texnik tavsiyalarni tuzib beradi.",
      featuredTailors: "Mahoratli tikuvchilar",
      featuredMaterials: "Mato va furnituralar",
      impactTitle: "Haqiqiy ijtimoiy natijalar",
      impactDesc: "Platformamizda soxta statistika yo‘q. Faqat ro‘yxatdan o‘tgan tikuvchilar, haqiqiy buyurtmalar va tasdiqlangan ko‘rsatkichlar hisobga olinadi.",
      impactDisclaimer: "Ko‘rsatilgan buyurtma qiymati platforma orqali amalga oshirilgan umumiy hajm bo‘lib, tikuvchining sof daromadini anglatmaydi.",
      ctaRegisterTitle: "O‘z uslubingiz yoki biznesingizni bugun boshlang",
      ctaRegisterDesc: "Mijoz, tikuvchi yoki mato sotuvchisi sifatida bepul ro‘yxatdan o‘ting.",
    },
    auth: {
      welcomeBack: "Tizimga kirish",
      createAccount: "Yangi akkaunt ochish",
      fullName: "To‘liq ismingiz",
      email: "Elektron pochta",
      password: "Parol",
      confirmPassword: "Parolni tasdiqlang",
      selectRole: "Akkaunt turini tanlang",
      customerRoleDesc: "Kiyim dizayni yaratish, tikuvchi topish va buyurtma berish uchun",
      creatorRoleDesc: "Tikuvchi yoki dizayner sifatida portfolio joylashtirish va buyurtma olish uchun",
      sellerRoleDesc: "Mato, ip, tugma va bezaklar sotish uchun",
      agreeTerms: "Foydalanish shartlari va maxfiylik siyosatiga roziman",
      haveAccount: "Akkauntingiz bormi? Kirish",
      noAccount: "Akkauntingiz yo‘qmi? Ro‘yxatdan o‘tish",
      forgotPassword: "Parolni unutdingizmi?",
      resetPassword: "Parolni tiklash",
      errors: {
        passwordMismatch: "Parollar bir-biriga mos kelmadi",
        invalidEmail: "Elektron pochta manzili noto‘g‘ri",
        passwordShort: "Parol kamida 8 ta belgidan iborat bo‘lishi kerak",
        roleRequired: "Iltimos, akkaunt turini tanlang",
        termsRequired: "Foydalanish shartlariga rozilik bildirilishi shart",
        unauthorized: "Ruxsat etilmagan kirish",
        invalidCredentials: "Email yoki parol noto‘g‘ri",
        userExists: "Bu elektron pochta orqali foydalanuvchi allaqachon mavjud",
      },
    },
    ai: {
      studioTitle: "AI Kiyim Loyihalash Studio",
      studioSubtitle: "O‘z g‘oyangizni bayon qiling va sun’iy intellekt orqali professional tikuv rejasini oling",
      categoryLabel: "Kiyim toifasi",
      styleLabel: "Uslub",
      seasonLabel: "Fasl",
      colorsLabel: "Afzal ko‘rilgan ranglar",
      budgetLabel: "Rejalashtirilgan budjet (so‘m)",
      descriptionLabel: "Kiyim g‘oyasi haqida batafsil ma’lumot",
      generateBtn: "AI Konsepsiyani yaratish",
      saveDesignBtn: "Dizaynni saqlash",
      orderWithDesignBtn: "Tikuvchiga buyurtma yuborish",
      keyMissingTitle: "AI API kaliti kiritilmagan",
      keyMissingDesc: "Tizimda tashqi AI API kaliti (OpenAI/Gemini) sozlanmagan. Soxta natijalar ko‘rsatilmaydi. Siz o‘z kiyim g‘oyangizni qo‘lda kiritishingiz yoki o‘z eskizingizni yuklab tikuvchiga yuborishingiz mumkin.",
      manualModePrompt: "Dizaynni qo‘lda to‘ldirish yoki eskiz yuklash",
      recommendedFabrics: "Tavsiya etilgan matolar",
      recommendedAccessories: "Kerakli bezak va aksessuarlar",
      technicalNotes: "Tikuvchi uchun texnik tavsiyalar",
    },
    orders: {
      orderNumber: "Buyurtma raqami",
      createOrderTitle: "Tikuvchiga yangi buyurtma so‘rovi yuborish",
      selectTailor: "Tanlangan tikuvchi",
      designNotes: "Buyurtma bo‘yicha qo‘shimcha izohlar",
      measurements: "Tana o‘lchamlari (bo‘y, ko‘krak, bel, son va h.k.)",
      deliveryAddress: "Yetkazib berish / uchrashuv manzili",
      sendRequestBtn: "Buyurtma so‘rovini yuborish",
      quotationReceived: "Tikuvchidan narx taklifi olindi",
      offeredPrice: "Taklif qilingan narx",
      estimatedDays: "Tayyor bo‘lish muddati (kun)",
      tailorNotes: "Tikuvchining izohi",
      acceptQuotation: "Taklifni tasdiqlash",
      rejectQuotation: "Taklifni rad etish",
      sendQuotationBtn: "Narx va muddat taklifini yuborish",
      updateStatusBtn: "Holatni yangilash",
      noOrdersFound: "Hozircha buyurtmalar yo‘q",
    },
    impact: {
      registeredTailors: "Ro‘yxatdan o‘tgan tikuvchilar",
      activeOrders: "Jarayondagi buyurtmalar",
      completedOrders: "Yakunlangan buyurtmalar",
      marketplaceVolume: "Tasdiqlangan buyurtmalar umumiy qiymati",
      registeredSellers: "Hamkor sotuvchilar",
      verifiedDataNotice: "Barcha ko‘rsatkichlar real ma’lumotlar bazasidan olingan bo‘lib, hech qanday soxta statistika kiritilmagan.",
      povertyReductionMission: "O‘zbekiston xotin-qizlarining bandligini oshirish va mustaqil daromad olishiga ko‘maklashish maqsadida.",
    },
  },
  ru: {
    common: {
      brandName: "CROOKED RIB",
      slogan: "Fashion. Tailoring. Your Rules.",
      brandPhilosophy: "Для тех, кто не вписывается в рамки.",
      login: "Войти",
      register: "Регистрация",
      logout: "Выйти",
      dashboard: "Панель управления",
      settings: "Настройки",
      save: "Сохранить",
      cancel: "Отмена",
      edit: "Редактировать",
      delete: "Удалить",
      actions: "Действия",
      status: "Статус",
      date: "Дата",
      price: "Цена",
      search: "Поиск",
      filter: "Фильтр",
      all: "Все",
      loading: "Загрузка...",
      viewDetails: "Подробнее",
      noData: "Данные не найдены",
      back: "Назад",
      submit: "Отправить",
      send: "Послать",
      contact: "Связаться",
      city: "Город",
      region: "Регион",
      uzs: "сум",
      demoBadge: "Демо / Примерные данные",
    },
    roles: {
      CUSTOMER: "Клиент (Заказчик)",
      CREATOR: "Портной / Дизайнер",
      SELLER: "Продавец тканей и фурнитуры",
      ADMIN: "Администратор",
    },
    orderStatuses: {
      REQUEST_SUBMITTED: "Запрос отправлен",
      UNDER_REVIEW: "На рассмотрении",
      QUOTATION_SENT: "Отправлено предложение по цене",
      CUSTOMER_APPROVED: "Подтверждено клиентом",
      IN_PROGRESS: "В процессе пошива",
      READY: "Готово",
      COMPLETED: "Завершено",
      CANCELLED: "Отменено",
    },
    categories: {
      FABRIC: "Ткани",
      THREAD: "Нитки",
      BUTTONS: "Пуговицы",
      ZIPPERS: "Молнии",
      ACCESSORIES: "Аксессуары",
      TRIM: "Тесьма и отделка",
    },
    nav: {
      home: "Главная",
      howItWorks: "Как это работает",
      tailors: "Мастера и ателье",
      marketplace: "Ткани и фурнитура",
      about: "О платформе",
      socialImpact: "Социальное влияние",
      aiStudio: "AI Студия дизайна",
      myOrders: "Мои заказы",
      messages: "Сообщения",
    },
    landing: {
      heroTitle: "Ваш стиль. Их мастерство. Новые возможности.",
      heroSubtitle: "Создайте концепцию одежды с помощью искусственного интеллекта, подберите ткани и закажите пошив у местных швей.",
      ctaDesign: "Создать дизайн",
      ctaTailors: "Найти мастера",
      problemTitle: "Наша социальная миссия",
      problemDesc: "Мы помогаем надомным швеям, безработным женщинам с навыками шитья и малым мастерским находить прямые заказы и стабильный доход.",
      forTailorsTitle: "Для портных и швей",
      forTailorsDesc: "Публикуйте портфолио, самостоятельно устанавливайте цены и сроки, получайте реальные заказы и развивайте свое дело.",
      forCustomersTitle: "Для клиентов",
      forCustomersDesc: "Проектируйте уникальную одежду с помощью AI, находите лучшие материалы и доверяйте пошив проверенным мастерицам.",
      forSellersTitle: "Для продавцов",
      forSellersDesc: "Размещайте каталоги тканей, ниток и фурнитуры для портных и прямых заказчиков.",
      aiSectionTitle: "AI Fashion Design Studio",
      aiSectionSubtitle: "Искусственный интеллект как мост от идеи к готовому изделию",
      aiSectionDesc: "Выберите категорию, стиль, сезон и бюджет. AI сформирует концепцию изделия, рекомендации по тканям и технические заметки для пошива.",
      featuredTailors: "Мастера пошива",
      featuredMaterials: "Ткани и фурнитура",
      impactTitle: "Реальные показатели социального эффекта",
      impactDesc: "На платформе нет вымышленных цифр. Отображаются только зарегистрированные мастера, реальные заявки и выполненные заказы.",
      impactDisclaimer: "Общий объем заказов отражает оборот платформы и не является чистой прибылью отдельной швеи.",
      ctaRegisterTitle: "Присоединяйтесь к CROOKED RIB уже сегодня",
      ctaRegisterDesc: "Бесплатная регистрация для заказчиков, швей и поставщиков материалов.",
    },
    auth: {
      welcomeBack: "Вход в аккаунт",
      createAccount: "Создать аккаунт",
      fullName: "Полное имя",
      email: "Электронная почта",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      selectRole: "Выберите тип аккаунта",
      customerRoleDesc: "Для создания дизайна, поиска мастеров и оформления заказов",
      creatorRoleDesc: "Для портных и дизайнеров: портфолио и прием заказов",
      sellerRoleDesc: "Для магазинов тканей, фурнитуры и швейных материалов",
      agreeTerms: "Я согласен с условиями использования и политикой конфиденциальности",
      haveAccount: "Уже есть аккаунт? Войти",
      noAccount: "Нет аккаунта? Зарегистрироваться",
      forgotPassword: "Забыли пароль?",
      resetPassword: "Сбросить пароль",
      errors: {
        passwordMismatch: "Пароли не совпадают",
        invalidEmail: "Некорректный адрес электронной почты",
        passwordShort: "Пароль должен содержать минимум 8 символов",
        roleRequired: "Пожалуйста, выберите тип аккаунта",
        termsRequired: "Необходимо согласие с условиями использования",
        unauthorized: "Доступ запрещен",
        invalidCredentials: "Неверный email или пароль",
        userExists: "Пользователь с таким email уже зарегистрирован",
      },
    },
    ai: {
      studioTitle: "AI Студия дизайна одежды",
      studioSubtitle: "Опишите вашу задумку и получите проработанный проект для пошива",
      categoryLabel: "Категория изделия",
      styleLabel: "Стиль",
      seasonLabel: "Сезон",
      colorsLabel: "Желаемые цвета",
      budgetLabel: "Ориентировочный бюджет (сум)",
      descriptionLabel: "Подробное описание фасона и пожеланий",
      generateBtn: "Сгенерировать AI-концепт",
      saveDesignBtn: "Сохранить дизайн",
      orderWithDesignBtn: "Отправить мастеру на пошив",
      keyMissingTitle: "API ключ AI не настроен",
      keyMissingDesc: "Внешний API ключ для AI не настроен на сервере. Мы не имитируем фальшивые ответы. Вы можете ввести проект вручную или прикрепить свой эскиз.",
      manualModePrompt: "Заполнить проект вручную или прикрепить эскиз",
      recommendedFabrics: "Рекомендуемые ткани",
      recommendedAccessories: "Необходимая фурнитура",
      technicalNotes: "Технические рекомендации для мастера",
    },
    orders: {
      orderNumber: "Номер заказа",
      createOrderTitle: "Отправить запрос мастеру",
      selectTailor: "Выбранный мастер",
      designNotes: "Пожелания по заказу",
      measurements: "Мерки (рост, обхват груди, талии, бедер и др.)",
      deliveryAddress: "Адрес примерки / доставки",
      sendRequestBtn: "Отправить запрос на пошив",
      quotationReceived: "Получено ценовое предложение",
      offeredPrice: "Предложенная цена",
      estimatedDays: "Срок изготовления (дней)",
      tailorNotes: "Комментарий мастера",
      acceptQuotation: "Принять предложение",
      rejectQuotation: "Отклонить предложение",
      sendQuotationBtn: "Отправить предложение по цене и сроку",
      updateStatusBtn: "Обновить статус заказа",
      noOrdersFound: "Заказов пока нет",
    },
    impact: {
      registeredTailors: "Зарегистрировано швей и портных",
      activeOrders: "Заказов в работе",
      completedOrders: "Завершенных заказов",
      marketplaceVolume: "Общая сумма подтвержденных заказов",
      registeredSellers: "Поставщиков материалов",
      verifiedDataNotice: "Все показатели рассчитаны на основе реальной базы данных без искусственных накруток.",
      povertyReductionMission: "Содействие занятости и экономической самостоятельности женщин в Узбекистане.",
    },
  },
  en: {
    common: {
      brandName: "CROOKED RIB",
      slogan: "Fashion. Tailoring. Your Rules.",
      brandPhilosophy: "For those who do not fit into molds.",
      login: "Log in",
      register: "Register",
      logout: "Log out",
      dashboard: "Dashboard",
      settings: "Settings",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      actions: "Actions",
      status: "Status",
      date: "Date",
      price: "Price",
      search: "Search",
      filter: "Filter",
      all: "All",
      loading: "Loading...",
      viewDetails: "View Details",
      noData: "No data found",
      back: "Back",
      submit: "Submit",
      send: "Send",
      contact: "Contact",
      city: "City",
      region: "Region",
      uzs: "UZS",
      demoBadge: "Demo / Sample data",
    },
    roles: {
      CUSTOMER: "Customer",
      CREATOR: "Tailor / Designer",
      SELLER: "Fabric & Trims Seller",
      ADMIN: "Administrator",
    },
    orderStatuses: {
      REQUEST_SUBMITTED: "Request Submitted",
      UNDER_REVIEW: "Under Review",
      QUOTATION_SENT: "Quotation Sent",
      CUSTOMER_APPROVED: "Customer Approved",
      IN_PROGRESS: "In Progress",
      READY: "Ready",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
    },
    categories: {
      FABRIC: "Fabric",
      THREAD: "Thread",
      BUTTONS: "Buttons",
      ZIPPERS: "Zippers",
      ACCESSORIES: "Accessories",
      TRIM: "Trims & Ribbons",
    },
    nav: {
      home: "Home",
      howItWorks: "How It Works",
      tailors: "Tailors Directory",
      marketplace: "Fabrics & Trims",
      about: "About",
      socialImpact: "Social Impact",
      aiStudio: "AI Design Studio",
      myOrders: "My Orders",
      messages: "Messages",
    },
    landing: {
      heroTitle: "Your Style. Their Skill. New Opportunities.",
      heroSubtitle: "Design clothing concepts with AI, discover matching materials, and commission local women tailors.",
      ctaDesign: "Create Design",
      ctaTailors: "Explore Tailors",
      problemTitle: "Our Social Mission",
      problemDesc: "Empowering home-based seamstresses, unemployed skilled women, and small tailoring workshops across Uzbekistan with direct client orders and steady income.",
      forTailorsTitle: "For Tailors & Creators",
      forTailorsDesc: "Showcase your portfolio, set your own pricing and timelines, receive direct client orders, and build your tailoring business.",
      forCustomersTitle: "For Customers",
      forCustomersDesc: "Design unique garments with AI, source authentic fabrics, and commission bespoke tailoring from skilled local craftswomen.",
      forSellersTitle: "For Material Sellers",
      forSellersDesc: "Offer your fabrics, threads, buttons, and accessories directly to tailors and customers.",
      aiSectionTitle: "AI Fashion Design Studio",
      aiSectionSubtitle: "Bridging the gap between idea and tailor-made garment",
      aiSectionDesc: "Select garment type, style, season, and budget. The AI generates detailed tailoring specifications, fabric recommendations, and technical notes.",
      featuredTailors: "Master Tailors",
      featuredMaterials: "Materials & Haberdashery",
      impactTitle: "Authentic Social Impact Analytics",
      impactDesc: "No fabricated metrics. Only real registered tailors, verified order workflows, and real platform data.",
      impactDisclaimer: "Gross order volume reflects platform transaction requests and does not represent net tailor profit.",
      ctaRegisterTitle: "Join CROOKED RIB Today",
      ctaRegisterDesc: "Create your free account as a customer, tailor, or fabric seller.",
    },
    auth: {
      welcomeBack: "Welcome Back",
      createAccount: "Create Your Account",
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      selectRole: "Select Account Type",
      customerRoleDesc: "Design clothes, find skilled tailors, and commission bespoke orders",
      creatorRoleDesc: "Showcase tailoring portfolio, quote pricing, and receive orders",
      sellerRoleDesc: "Sell fabrics, threads, buttons, and tailoring supplies",
      agreeTerms: "I agree to the Terms of Service and Privacy Policy",
      haveAccount: "Already have an account? Log in",
      noAccount: "Don't have an account? Sign up",
      forgotPassword: "Forgot password?",
      resetPassword: "Reset Password",
      errors: {
        passwordMismatch: "Passwords do not match",
        invalidEmail: "Invalid email address",
        passwordShort: "Password must be at least 8 characters long",
        roleRequired: "Please select an account type",
        termsRequired: "You must accept the terms of service",
        unauthorized: "Unauthorized access",
        invalidCredentials: "Invalid email or password",
        userExists: "A user with this email already exists",
      },
    },
    ai: {
      studioTitle: "AI Fashion Design Studio",
      studioSubtitle: "Describe your concept and receive a detailed tailoring specification",
      categoryLabel: "Garment Category",
      styleLabel: "Aesthetic Style",
      seasonLabel: "Season",
      colorsLabel: "Color Palette",
      budgetLabel: "Target Budget (UZS)",
      descriptionLabel: "Detailed Concept & Fit Requirements",
      generateBtn: "Generate AI Concept",
      saveDesignBtn: "Save Design",
      orderWithDesignBtn: "Commission a Tailor",
      keyMissingTitle: "External AI API Not Configured",
      keyMissingDesc: "An external AI API key (OpenAI/Gemini) has not been configured on this server. We never fake AI results. You can manually enter your tailoring specifications or upload your sketch to proceed with an order.",
      manualModePrompt: "Enter design details manually or upload sketch",
      recommendedFabrics: "Recommended Fabrics",
      recommendedAccessories: "Required Accessories & Haberdashery",
      technicalNotes: "Technical Tailoring Instructions",
    },
    orders: {
      orderNumber: "Order Number",
      createOrderTitle: "Send Order Request to Tailor",
      selectTailor: "Selected Tailor",
      designNotes: "Order Notes & Preferences",
      measurements: "Body Measurements (height, bust, waist, hips, etc.)",
      deliveryAddress: "Delivery or Fitting Address",
      sendRequestBtn: "Submit Order Request",
      quotationReceived: "Quotation Received from Tailor",
      offeredPrice: "Quoted Price",
      estimatedDays: "Estimated Turnaround (Days)",
      tailorNotes: "Tailor's Remarks",
      acceptQuotation: "Accept Quotation",
      rejectQuotation: "Decline Quotation",
      sendQuotationBtn: "Submit Quotation",
      updateStatusBtn: "Update Order Status",
      noOrdersFound: "No orders found",
    },
    impact: {
      registeredTailors: "Registered Women Tailors",
      activeOrders: "Orders In Progress",
      completedOrders: "Completed Orders",
      marketplaceVolume: "Confirmed Order Volume",
      registeredSellers: "Active Material Sellers",
      verifiedDataNotice: "All metrics reflect actual database records with no synthetic inflation.",
      povertyReductionMission: "Dedicated to expanding female employment and self-reliance in Uzbekistan.",
    },
  },
};
