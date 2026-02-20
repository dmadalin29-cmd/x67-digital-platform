import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    // Navbar
    competitions: "Competitions",
    winners: "Winners",
    faq: "FAQ",
    login: "Login",
    register: "Register",
    dashboard: "Dashboard",
    adminPanel: "Admin Panel",
    logout: "Logout",
    
    // Hero
    featuredCompetition: "Featured Competition",
    winA: "WIN A",
    enterNow: "Enter Now",
    viewAllCompetitions: "View All Competitions",
    prizeValue: "Prize Value",
    from: "From",
    
    // Competitions
    liveCompetitions: "Live Competitions",
    enterBeforeSellOut: "Enter now before they sell out",
    viewAll: "View All",
    allCompetitions: "All Competitions",
    browseCompetitions: "Browse our live competitions and enter for your chance to win incredible prizes",
    searchCompetitions: "Search competitions...",
    category: "Category",
    allCategories: "All Competitions",
    cars: "Cars",
    electronics: "Electronics",
    cash: "Cash Prizes",
    sortBy: "Sort by",
    endingSoon: "Ending Soon",
    priceLowHigh: "Price: Low to High",
    priceHighLow: "Price: High to Low",
    prizeValueHighLow: "Prize Value: High to Low",
    ticketsLeft: "tickets left",
    sold: "sold",
    noCompetitionsFound: "No competitions found",
    clearFilters: "Clear filters",
    competitionsFound: "competitions found",
    
    // Competition Detail
    backToCompetitions: "Back to Competitions",
    totalTickets: "Total Tickets",
    drawDate: "Draw Date",
    drawEndsIn: "Draw ends in:",
    days: "Days",
    hours: "Hours",
    mins: "Mins",
    secs: "Secs",
    ticketsRemaining: "tickets remaining",
    ticketPrice: "Ticket Price",
    total: "Total",
    buyTicket: "Buy",
    ticket: "Ticket",
    tickets: "Tickets",
    securePayment: "Secure Payment",
    instantEntry: "Instant Entry",
    soldOut: "Sold Out!",
    competitionEnded: "Competition Ended",
    winnerDrawn: "Winner has been drawn.",
    noLongerAccepting: "This competition is no longer accepting entries.",
    winningTicket: "Winning Ticket",
    
    // Status
    live: "Live",
    ending_soon: "Ending Soon",
    sold_out: "Sold Out",
    completed: "Completed",
    
    // Auth
    signInToAccount: "Sign in to your account",
    continueWithGoogle: "Continue with Google",
    orContinueWithEmail: "Or continue with email",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    dontHaveAccount: "Don't have an account?",
    createAccount: "Create account",
    createFreeAccount: "Create your free account",
    signUpWithGoogle: "Sign up with Google",
    orRegisterWithEmail: "Or register with email",
    fullName: "Full Name",
    phoneOptional: "Phone (Optional)",
    confirmPassword: "Confirm Password",
    creatingAccount: "Creating account...",
    alreadyHaveAccount: "Already have an account?",
    bySigningIn: "By signing in, you agree to our",
    byCreatingAccount: "By creating an account, you agree to our",
    terms: "Terms",
    and: "and",
    privacyPolicy: "Privacy Policy",
    
    // Dashboard
    welcome: "Welcome",
    totalTicketsOwned: "Total Tickets",
    activeEntries: "Active Entries",
    totalOrders: "Total Orders",
    endingSoonCount: "Ending Soon",
    myTickets: "My Tickets",
    orderHistory: "Order History",
    noTicketsYet: "No tickets yet",
    enterCompetitionsToGetTickets: "Enter competitions to get your tickets",
    browseCompetitionsBtn: "Browse Competitions",
    noOrdersYet: "No orders yet",
    purchaseHistoryHere: "Your purchase history will appear here",
    
    // Winners
    ourWinners: "Our Winners",
    realPeopleRealPrizes: "Real people, real prizes",
    noWinnersYet: "No winners yet",
    beFirstToWin: "Be the first to win! Check out our live competitions.",
    youCouldBeNext: "You Could Be Next!",
    everyTicketChance: "Every ticket is a chance to win. Enter our competitions today and join our winners' circle.",
    viewCompetitions: "View Competitions",
    
    // FAQ
    frequentlyAskedQuestions: "Frequently Asked Questions",
    gotQuestionsWeGotAnswers: "Got questions? We've got answers. Find everything you need to know about x67 Digital competitions.",
    stillHaveQuestions: "Still Have Questions?",
    cantFindWhatLooking: "Can't find what you're looking for? Our support team is here to help.",
    contactSupport: "Contact Support",
    
    // Footer
    footerDescription: "The UK's premier competition platform. Win luxury cars, electronics, and cash prizes with verified draws and guaranteed winners.",
    quickLinks: "Quick Links",
    allCompetitionsLink: "All Competitions",
    previousWinners: "Previous Winners",
    termsConditions: "Terms & Conditions",
    categories: "Categories",
    carCompetitions: "Car Competitions",
    cashPrizes: "Cash Prizes",
    contactUs: "Contact Us",
    sslSecured: "SSL Secured",
    responsibleGaming: "Responsible Gaming",
    allRightsReserved: "All rights reserved.",
    registeredEngland: "Registered in England & Wales.",
    operatesPrizeCompetitions: "x67digital.co.uk operates prize competitions under UK gambling regulations.",
    
    // Trust Badges
    encryption: "256-bit Encryption",
    verified: "Verified",
    members: "Members",
    prizesAwarded: "Prizes Awarded",
    
    // CTA
    readyToWinBig: "Ready to Win Big?",
    joinThousandsWinners: "Join thousands of winners. Enter our competitions today and you could be driving away in your dream car.",
    
    // Admin
    adminDashboard: "Admin Panel",
    overview: "Overview",
    users: "Users",
    orders: "Orders",
    dashboardOverview: "Dashboard Overview",
    seedDemoData: "Seed Demo Data",
    totalRevenue: "Total Revenue",
    totalUsers: "Total Users",
    activeCompetitions: "Active Competitions",
    ticketsToday: "Tickets Today",
    addCompetition: "Add Competition",
    editCompetition: "Edit Competition",
    title: "Title",
    description: "Description",
    featured: "Featured",
    autoDraw: "Auto Draw",
    visible: "Visible",
    save: "Save",
    saving: "Saving...",
    update: "Update",
    create: "Create",
    delete: "Delete",
    refund: "Refund",
    promote: "Promote",
    demote: "Demote",
    draw: "Draw Winner",
    actions: "Actions",
    status: "Status",
    amount: "Amount",
    date: "Date",
    role: "Role",
    joined: "Joined",
    name: "Name",
    price: "Price",
    
    // Misc
    purchaseSuccessful: "Purchase Successful!",
    youGotTickets: "You got tickets",
    pleaseLoginToPurchase: "Please login to purchase tickets",
    welcomeBack: "Welcome back!",
    accountCreatedSuccessfully: "Account created successfully!",
    passwordsDoNotMatch: "Passwords do not match",
    passwordMinLength: "Password must be at least 6 characters",
  },
  
  ro: {
    // Navbar
    competitions: "Competiții",
    winners: "Câștigători",
    faq: "Întrebări",
    login: "Autentificare",
    register: "Înregistrare",
    dashboard: "Panou",
    adminPanel: "Admin",
    logout: "Deconectare",
    
    // Hero
    featuredCompetition: "Competiție Recomandată",
    winA: "CÂȘTIGĂ UN",
    enterNow: "Participă Acum",
    viewAllCompetitions: "Vezi Toate Competițiile",
    prizeValue: "Valoare Premiu",
    from: "De la",
    
    // Competitions
    liveCompetitions: "Competiții Active",
    enterBeforeSellOut: "Participă acum înainte să se epuizeze",
    viewAll: "Vezi Tot",
    allCompetitions: "Toate Competițiile",
    browseCompetitions: "Explorează competițiile noastre active și participă pentru șansa de a câștiga premii incredibile",
    searchCompetitions: "Caută competiții...",
    category: "Categorie",
    allCategories: "Toate Competițiile",
    cars: "Mașini",
    electronics: "Electronice",
    cash: "Premii Cash",
    sortBy: "Sortează după",
    endingSoon: "Se Termină Curând",
    priceLowHigh: "Preț: Mic la Mare",
    priceHighLow: "Preț: Mare la Mic",
    prizeValueHighLow: "Valoare Premiu: Mare la Mic",
    ticketsLeft: "bilete rămase",
    sold: "vândute",
    noCompetitionsFound: "Nu s-au găsit competiții",
    clearFilters: "Șterge filtrele",
    competitionsFound: "competiții găsite",
    
    // Competition Detail
    backToCompetitions: "Înapoi la Competiții",
    totalTickets: "Total Bilete",
    drawDate: "Data Extragerii",
    drawEndsIn: "Extragerea se încheie în:",
    days: "Zile",
    hours: "Ore",
    mins: "Min",
    secs: "Sec",
    ticketsRemaining: "bilete rămase",
    ticketPrice: "Preț Bilet",
    total: "Total",
    buyTicket: "Cumpără",
    ticket: "Bilet",
    tickets: "Bilete",
    securePayment: "Plată Securizată",
    instantEntry: "Înregistrare Instant",
    soldOut: "Epuizat!",
    competitionEnded: "Competiție Încheiată",
    winnerDrawn: "Câștigătorul a fost extras.",
    noLongerAccepting: "Această competiție nu mai acceptă participări.",
    winningTicket: "Bilet Câștigător",
    
    // Status
    live: "Activ",
    ending_soon: "Se Termină",
    sold_out: "Epuizat",
    completed: "Încheiat",
    
    // Auth
    signInToAccount: "Autentifică-te în contul tău",
    continueWithGoogle: "Continuă cu Google",
    orContinueWithEmail: "Sau continuă cu email",
    email: "Email",
    password: "Parolă",
    signIn: "Autentificare",
    signingIn: "Se autentifică...",
    dontHaveAccount: "Nu ai cont?",
    createAccount: "Creează cont",
    createFreeAccount: "Creează-ți contul gratuit",
    signUpWithGoogle: "Înregistrează-te cu Google",
    orRegisterWithEmail: "Sau înregistrează-te cu email",
    fullName: "Nume Complet",
    phoneOptional: "Telefon (Opțional)",
    confirmPassword: "Confirmă Parola",
    creatingAccount: "Se creează contul...",
    alreadyHaveAccount: "Ai deja cont?",
    bySigningIn: "Prin autentificare, ești de acord cu",
    byCreatingAccount: "Prin crearea contului, ești de acord cu",
    terms: "Termenii",
    and: "și",
    privacyPolicy: "Politica de Confidențialitate",
    
    // Dashboard
    welcome: "Bine ai venit",
    totalTicketsOwned: "Total Bilete",
    activeEntries: "Participări Active",
    totalOrders: "Total Comenzi",
    endingSoonCount: "Se Termină Curând",
    myTickets: "Biletele Mele",
    orderHistory: "Istoric Comenzi",
    noTicketsYet: "Nu ai bilete încă",
    enterCompetitionsToGetTickets: "Participă la competiții pentru a obține bilete",
    browseCompetitionsBtn: "Explorează Competițiile",
    noOrdersYet: "Nu ai comenzi încă",
    purchaseHistoryHere: "Istoricul achizițiilor tale va apărea aici",
    
    // Winners
    ourWinners: "Câștigătorii Noștri",
    realPeopleRealPrizes: "Oameni reali, premii reale",
    noWinnersYet: "Nu sunt câștigători încă",
    beFirstToWin: "Fii primul care câștigă! Verifică competițiile noastre active.",
    youCouldBeNext: "Tu Poți Fi Următorul!",
    everyTicketChance: "Fiecare bilet este o șansă de a câștiga. Participă la competițiile noastre astăzi și alătură-te câștigătorilor.",
    viewCompetitions: "Vezi Competițiile",
    
    // FAQ
    frequentlyAskedQuestions: "Întrebări Frecvente",
    gotQuestionsWeGotAnswers: "Ai întrebări? Avem răspunsuri. Găsește tot ce trebuie să știi despre competițiile x67 Digital.",
    stillHaveQuestions: "Mai Ai Întrebări?",
    cantFindWhatLooking: "Nu găsești ce cauți? Echipa noastră de suport este aici să te ajute.",
    contactSupport: "Contactează Suportul",
    
    // Footer
    footerDescription: "Platforma de competiții premium din UK. Câștigă mașini de lux, electronice și premii cash cu extrageri verificate și câștigători garantați.",
    quickLinks: "Link-uri Rapide",
    allCompetitionsLink: "Toate Competițiile",
    previousWinners: "Câștigători Anteriori",
    termsConditions: "Termeni și Condiții",
    categories: "Categorii",
    carCompetitions: "Competiții Mașini",
    cashPrizes: "Premii Cash",
    contactUs: "Contactează-ne",
    sslSecured: "SSL Securizat",
    responsibleGaming: "Joc Responsabil",
    allRightsReserved: "Toate drepturile rezervate.",
    registeredEngland: "Înregistrat în Anglia & Wales.",
    operatesPrizeCompetitions: "x67digital.co.uk operează competiții cu premii conform reglementărilor din UK.",
    
    // Trust Badges
    encryption: "Criptare 256-bit",
    verified: "Verificați",
    members: "Membri",
    prizesAwarded: "Premii Acordate",
    
    // CTA
    readyToWinBig: "Gata să Câștigi Mare?",
    joinThousandsWinners: "Alătură-te miilor de câștigători. Participă la competițiile noastre astăzi și ai putea pleca cu mașina visurilor tale.",
    
    // Admin
    adminDashboard: "Panou Admin",
    overview: "Prezentare",
    users: "Utilizatori",
    orders: "Comenzi",
    dashboardOverview: "Prezentare Panou",
    seedDemoData: "Încarcă Date Demo",
    totalRevenue: "Venit Total",
    totalUsers: "Total Utilizatori",
    activeCompetitions: "Competiții Active",
    ticketsToday: "Bilete Astăzi",
    addCompetition: "Adaugă Competiție",
    editCompetition: "Editează Competiție",
    title: "Titlu",
    description: "Descriere",
    featured: "Recomandat",
    autoDraw: "Extragere Automată",
    visible: "Vizibil",
    save: "Salvează",
    saving: "Se salvează...",
    update: "Actualizează",
    create: "Creează",
    delete: "Șterge",
    refund: "Rambursare",
    promote: "Promovează",
    demote: "Retrogradează",
    draw: "Extrage Câștigător",
    actions: "Acțiuni",
    status: "Status",
    amount: "Sumă",
    date: "Data",
    role: "Rol",
    joined: "Înregistrat",
    name: "Nume",
    price: "Preț",
    
    // Misc
    purchaseSuccessful: "Achiziție Reușită!",
    youGotTickets: "Ai primit biletele",
    pleaseLoginToPurchase: "Te rugăm să te autentifici pentru a cumpăra bilete",
    welcomeBack: "Bine ai revenit!",
    accountCreatedSuccessfully: "Cont creat cu succes!",
    passwordsDoNotMatch: "Parolele nu se potrivesc",
    passwordMinLength: "Parola trebuie să aibă cel puțin 6 caractere",
  }
};

const LanguageContext = createContext(null);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("x67_language") || "ro";
  });

  useEffect(() => {
    localStorage.setItem("x67_language", language);
  }, [language]);

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === "en" ? "ro" : "en");
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
