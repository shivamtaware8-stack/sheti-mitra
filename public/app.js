/* ============================================================================
   ShetiMitra AI - Frontend Application
   Multilingual (Marathi / Hindi / English)
   Complete Disease Scanning & Medicine Recommendation System
   ============================================================================ */

const I = {
  mr: {
    tag: 'शेतीचा स्मार्ट साथीदार',
    scanNav: 'रोग स्कॅन',
    medNav: 'औषधे',
    historyNav: 'स्कॅन इतिहास',
    aboutNav: 'माहिती व स्रोत',
    heroTitle: 'पिकाचा फोटो द्या.<br><em>रोगाची प्राथमिक माहिती</em> मिळवा.',
    heroText: 'पीक निवडा, पानाचा फोटो अपलोड करा आणि संभाव्य रोग, लक्षणे, शिफारस केलेली उत्पादने व खरेदी पर्याय पहा.',
    heroBtn: 'आता स्कॅन करा →',
    scanTitle: 'पिकाचा रोग स्कॅन करा',
    uploadTitle: 'पानाचा फोटो अपलोड करा',
    uploadText: 'JPG/PNG/WEBP • कमाल 8 MB',
    choose: 'फोटो निवडा',
    camera: 'कॅमेऱ्याने फोटो काढा',
    cropLabel: 'पीक निवडा',
    scanBtnText: 'रोग तपासा',
    scanning: 'AI तपासणी सुरू आहे…',
    scanNote: 'फोटो स्पष्ट, चांगल्या प्रकाशात आणि रोगाची लक्षणे दिसतील असा ठेवा.',
    medTitle: 'या रोगासाठी योग्य उत्पादने',
    allMedTitle: 'सर्व नोंदणीकृत कृषी-संरक्षक उत्पादने',
    medSubhead: 'केंद्रीय कीटकनाशक मंडळ (CIB&RC) आणि कृषी विद्यापीठ शिफारशींवर आधारित उत्पादने.',
    trustTitle: 'विश्वासार्ह माहिती, स्पष्ट स्रोत',
    trustText: 'रोग व्यवस्थापनासाठी उपलब्ध संदर्भ आणि उत्पादन माहिती स्रोतासह दाखवली जाते. किंमत किंवा उत्पादनाचा स्रोत सत्यापित नसल्यास तो अंदाजाने दाखवला जात नाही.',
    historyTitle: 'अलीकडील स्कॅन इतिहास',
    refreshText: 'ताजे करा',
    noHistory: 'अजून कोणताही स्कॅन इतिहास उपलब्ध नाही.',
    resultTitle: 'AI स्क्रीनिंग निकाल',
    demoNotice: 'DEMO RESULT — हे प्रात्यक्षिक (डेमो) निकाल आहे आणि प्रत्यक्ष वैद्यकीय/कृषी निदान नाही.',
    demoBannerTitle: 'DEMO RESULT — This is a demonstration fallback and not a real diagnosis.',
    demoBannerText: 'हा प्रात्यक्षिक निकाल आहे. प्रत्यक्ष रोग निदानासाठी कृषी तज्ज्ञांचा सल्ला घ्या आणि मंजूर लेबलचे पालन करा.',
    modelBannerTitle: 'AI SCREENING RESULT',
    cropLabelText: 'पीक',
    diseaseLabelText: 'रोग',
    confidence: 'विश्वास पातळी',
    symptoms: 'मुख्य लक्षणे',
    management: 'व्यवस्थापन माहिती',
    productsTitle: 'शिफारस केलेली उत्पादने',
    noProducts: 'या निकालासाठी सध्या सत्यापित उत्पादन उपलब्ध नाही.',
    noProductsFilter: 'या श्रेणीमध्ये कोणतेही उत्पादन आढळले नाही.',
    noReference: 'या रोगासाठी सध्या तपशीलवार संदर्भ उपलब्ध नाही.',
    price: 'किंमत',
    priceUnavailable: 'किंमत उपलब्ध नाही — विक्रेत्याकडे तपासा',
    priceUnavailableSub: 'सत्यापित ऑनलाइन किंमत उपलब्ध नसल्यास अंदाजे किंमत दाखवली जात नाही.',
    currentOnlinePrice: 'सध्याची ऑनलाइन किंमत',
    priceSource: 'किंमत स्रोत',
    sourceUnavailable: 'सत्यापित seller feed उपलब्ध नाही',
    activeIngredient: 'सक्रिय घटक',
    formulation: 'फॉर्म्युलेशन',
    pack: 'पॅक साईज',
    usage: 'वापर / शिफारस',
    source: 'सत्यापित स्रोत',
    registration: 'नोंदणी संदर्भ',
    verifiedSource: 'CIB&RC अधिकृत संदर्भ',
    whereToBuy: 'खरेदी पर्याय (Where to Buy)',
    searchAmazon: 'Amazon वर शोधा',
    searchFlipkart: 'Flipkart वर शोधा',
    officialSeller: 'अधिकृत नोंदणी / CIBRC',
    viewDetails: 'तपशील पहा',
    suitableFor: 'योग्य पीक',
    target: 'लक्ष्य रोग',
    brand: 'ब्रँड / उत्पादक',
    filterAll: 'सर्व उत्पादने',
    filterFungicide: 'बुरशीनाशके (Fungicides)',
    filterBactericide: 'जिवाणूनाशके (Bactericides)',
    filterBio: 'जैविक / इतर',
    scanFirst: 'फोटो निवडा आणि मग रोग तपासा.',
    scanningHint: 'कृपया थोडा वेळ थांबा, प्रतिमा तपासत आहोत…',
    apiError: 'स्कॅन करताना समस्या आली. कृपया पुन्हा प्रयत्न करा.',
    healthy: 'पीक निरोगी दिसत आहे',
    disclaimer: 'AI निकाल हा फक्त प्राथमिक screening मदत आहे. प्रत्यक्ष निदानासाठी कृषी तज्ज्ञांचा सल्ला घ्या आणि नेहमी सध्याच्या मंजूर product label नुसारच वापर करा.',
    modalTitle: 'उत्पादन सविस्तर तपशील',
    modalInstructions: 'वापर व सुरक्षितता सूचना',
    modalClose: 'बंद करा',
    uncertainTitle: 'निश्चित निदान झाले नाही',
    lowConfidenceNotice: 'AI निकालाची विश्वास पातळी 0.80 पेक्षा कमी आहे. कोणतेही औषध किंवा कीटकनाशक शिफारस केलेले नाही.',
    cropMismatchMsg: 'निवडलेले पीक आणि फोटो जुळत नाहीत.',
    cropMismatchHint: 'छोटी माहिती: model ने फोटो {detected} म्हणून ओळखला. योग्य पीक निवडून पुन्हा स्कॅन करा.',
    modelUnavailableMsg: 'या पिकासाठी सध्या AI model उपलब्ध नाही.',
    modelUnavailableHint: 'निदान सेवा सध्या उपलब्ध नाही. कृपया नंतर पुन्हा प्रयत्न करा किंवा कृषी तज्ज्ञांचा सल्ला घ्या.',
    notConfirmedMsg: 'AI screening result — not a confirmed agronomic diagnosis.',
    demoBadgeLabel: 'DEMO',
    login: 'लॉग इन',
    signup: 'साइन अप',
    logout: 'लॉग आउट',
    loginTitle: 'स्वागत आहे 👋',
    signupTitle: 'नवीन खाते तयार करा',
    authWelcome: 'स्वागत आहे 👋',
    authLoginSub: 'तुमच्या ShetiMitra खात्यात लॉगिन करा',
    authSignupSub: 'तुमचे मोफत ShetiMitra खाते तयार करा',
    authBrandTag: 'शेतीसाठी स्मार्ट साथीदार',
    authTagline: 'तुमच्या पिकांची काळजी, आता अधिक स्मार्ट पद्धतीने.',
    authPoint1: 'AI पिक रोग तपासणी',
    authPoint2: 'सत्यापित औषध मार्गदर्शन',
    authPoint3: 'तुमचा वैयक्तिक स्कॅन इतिहास',
    authIdentifier: 'मोबाइल क्रमांक किंवा ईमेल',
    authSubmitting: 'कृपया थांबा…',
    pwShow: 'पासवर्ड दाखवा',
    pwHide: 'पासवर्ड लपवा',
    fullName: 'पूर्ण नाव',
    mobile: 'मोबाइल क्रमांक',
    email: 'ईमेल (पर्यायी)',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड पुन्हा टाइप करा',
    loginBtn: 'लॉगिन करा',
    signupBtn: 'खाते तयार करा',
    noAccount: 'खाते नाही? साइन अप करा',
    haveAccount: 'आधीपासून खाते आहे? लॉग इन',
    myProfile: 'प्रोफाइल',
    myHistory: 'माझा स्कॅन इतिहास',
    loginRequiredHistory: 'स्कॅन इतिहास पाहण्यासाठी लॉग इन करा.',
    authNameRequired: 'कृपया पूर्ण नाव भरा.',
    authMobileInvalid: 'कृपया वैध 10 अंकी मोबाइल क्रमांक भरा.',
    authEmailInvalid: 'कृपया वैध ईमेल भरा.',
    authPasswordShort: 'पासवर्ड किमान 6 अक्षरांचा असावा.',
    authPasswordMismatch: 'पासवर्ड जुळत नाहीत.',
    authDuplicateMobile: 'हा मोबाइल क्रमांक आधीपासून नोंदणीकृत आहे.',
    authDuplicateEmail: 'हा ईमेल आधीपासून नोंदणीकृत आहे.',
    authInvalidCredentials: 'मोबाइल/ईमेल किंवा पासवर्ड चुकीचा आहे.',
    authSignupSuccess: 'खाते तयार झाले! स्वागत आहे.',
    authLoginSuccess: 'स्वागत आहे, ',
    authLoggedOut: 'आपण लॉग आउट झाला आहात.',
    authSomethingWentWrong: 'काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा.',
    verifiedPrice: 'सत्यापित किंमत',
    priceLastChecked: 'शेवटची तपासणी',
    priceSeller: 'विक्रेता',
    buyFromSeller: 'विक्रेत्याकडून खरेदी करा'
  },

  hi: {
    tag: 'खेती का स्मार्ट साथीदार',
    scanNav: 'रोग स्कैन',
    medNav: 'उत्पाद',
    historyNav: 'स्कैन इतिहास',
    aboutNav: 'जानकारी व स्रोत',
    heroTitle: 'फसल की फोटो दें।<br><em>रोग की प्राथमिक जानकारी</em> पाएं।',
    heroText: 'फसल चुनें, पत्ते की फोटो अपलोड करें और संभावित रोग, लक्षण, अनुशंसित उत्पाद व खरीद विकल्प देखें।',
    heroBtn: 'अभी स्कैन करें →',
    scanTitle: 'फसल रोग स्कैन करें',
    uploadTitle: 'पत्ते की फोटो अपलोड करें',
    uploadText: 'JPG/PNG/WEBP • अधिकतम 8 MB',
    choose: 'फोटो चुनें',
    camera: 'कैमरे से फोटो लें',
    cropLabel: 'फसल चुनें',
    scanBtnText: 'रोग जांचें',
    scanning: 'AI जांच चल रही है…',
    scanNote: 'फोटो साफ, अच्छी रोशनी में और रोग के लक्षण स्पष्ट दिखने वाली रखें.',
    medTitle: 'इस रोग के लिए उपयुक्त उत्पाद',
    allMedTitle: 'सभी पंजीकृत कृषि-संरक्षक उत्पाद',
    medSubhead: 'केंद्रीय कीटनाशक बोर्ड (CIB&RC) और कृषि विश्वविद्यालय की सिफारिशों पर आधारित उत्पाद।',
    trustTitle: 'विश्वसनीय जानकारी, स्पष्ट स्रोत',
    trustText: 'रोग प्रबंधन और उत्पाद जानकारी उपलब्ध स्रोतों के साथ दिखाई जाती है। सत्यापित स्रोत के बिना कीमत या उत्पाद विवरण अनुमान से नहीं दिखाया जाता।',
    historyTitle: 'हाल ही का स्कैन इतिहास',
    refreshText: 'रिफ्रेश करें',
    noHistory: 'अभी कोई स्कैन इतिहास उपलब्ध नहीं है।',
    resultTitle: 'AI स्क्रीनिंग परिणाम',
    demoNotice: 'DEMO RESULT — यह प्रदर्शन (डेमो) परिणाम है और वास्तविक कृषि निदान नहीं है।',
    demoBannerTitle: 'DEMO RESULT — This is a demonstration fallback and not a real diagnosis.',
    demoBannerText: 'यह डेमो परिणाम है। वास्तविक रोग निदान के लिए कृषि विशेषज्ञ से सलाह लें और स्वीकृत लेबल का पालन करें।',
    modelBannerTitle: 'AI SCREENING RESULT',
    cropLabelText: 'फसल',
    diseaseLabelText: 'रोग',
    confidence: 'विश्वास स्तर',
    symptoms: 'मुख्य लक्षण',
    management: 'प्रबंधन जानकारी',
    productsTitle: 'अनुशंसित उत्पाद',
    noProducts: 'इस परिणाम के लिए कोई सत्यापित उत्पाद उपलब्ध नहीं है।',
    noProductsFilter: 'इस श्रेणी में कोई उत्पाद नहीं मिला।',
    noReference: 'इस रोग के लिए अभी विस्तृत संदर्भ उपलब्ध नहीं है।',
    price: 'कीमत',
    priceUnavailable: 'कीमत उपलब्ध नहीं — विक्रेता से जांचें',
    priceUnavailableSub: 'सत्यापित ऑनलाइन मूल्य न होने पर अनुमानित कीमत नहीं दिखाई जाती।',
    currentOnlinePrice: 'वर्तमान ऑनलाइन मूल्य',
    priceSource: 'कीमत स्रोत',
    sourceUnavailable: 'सत्यापित seller feed उपलब्ध नहीं',
    activeIngredient: 'सक्रिय घटक',
    formulation: 'फॉर्म्युलेशन',
    pack: 'पैक आकार',
    usage: 'उपयोग / सिफारिश',
    source: 'सत्यापित स्रोत',
    registration: 'पंजीकरण संदर्भ',
    verifiedSource: 'CIB&RC आधिकारिक संदर्भ',
    whereToBuy: 'कहाँ से खरीदें (Where to Buy)',
    searchAmazon: 'Amazon पर खोजें',
    searchFlipkart: 'Flipkart पर खोजें',
    officialSeller: 'आधिकारिक पंजीकरण / CIBRC',
    viewDetails: 'विवरण देखें',
    suitableFor: 'उपयुक्त फसल',
    target: 'लक्षित रोग',
    brand: 'ब्रांड / निर्माता',
    filterAll: 'सभी उत्पाद',
    filterFungicide: 'फफूंदनाशक (Fungicides)',
    filterBactericide: 'जीवाणुनाशक (Bactericides)',
    filterBio: 'जैविक / अन्य',
    scanFirst: 'पहले फोटो चुनें, फिर रोग जांचें.',
    scanningHint: 'कृपया थोड़ी देर प्रतीक्षा करें, फोटो जांची जा रही है…',
    apiError: 'स्कैन करते समय समस्या आई। फिर से प्रयास करें।',
    healthy: 'फसल स्वस्थ दिख रही है',
    disclaimer: 'AI परिणाम केवल प्राथमिक screening सहायता है। विशेषज्ञ से पुष्टि करें और हमेशा वर्तमान स्वीकृत product label के अनुसार ही उपयोग करें।',
    modalTitle: 'उत्पाद विस्तृत विवरण',
    modalInstructions: 'उपयोग व सुरक्षा निर्देश',
    modalClose: 'बंद करें',
    uncertainTitle: 'निश्चित निदान नहीं हुआ',
    lowConfidenceNotice: 'AI परिणाम का विश्वास स्तर 0.80 से कम है। कोई दवा या कीटनाशक सुझाया नहीं गया है।',
    cropMismatchMsg: 'चुनी गई फसल और फोटो मेल नहीं खाते।',
    cropMismatchHint: 'जानकारी: model ने फोटो को {detected} के रूप में पहचाना। सही फसल चुनकर दोबारा स्कैन करें।',
    modelUnavailableMsg: 'इस फसल के लिए अभी AI model उपलब्ध नहीं है।',
    modelUnavailableHint: 'निदान सेवा अभी उपलब्ध नहीं है। कृपया बाद में फिर कोशिश करें या कृषि विशेषज्ञ से सलाह लें।',
    notConfirmedMsg: 'AI screening result — not a confirmed agronomic diagnosis.',
    demoBadgeLabel: 'DEMO',
    login: 'लॉग इन',
    signup: 'साइन अप',
    logout: 'लॉग आउट',
    loginTitle: 'स्वागत है 👋',
    signupTitle: 'नया खाता बनाएं',
    authWelcome: 'स्वागत है 👋',
    authLoginSub: 'अपने ShetiMitra खाते में लॉगिन करें',
    authSignupSub: 'अपना मुफ्त ShetiMitra खाता बनाएं',
    authBrandTag: 'खेती का स्मार्ट साथीदार',
    authTagline: 'आपकी फसल की देखभाल, अब और भी स्मार्ट तरीके से।',
    authPoint1: 'AI फसल रोग जांच',
    authPoint2: 'सत्यापित दवा मार्गदर्शन',
    authPoint3: 'आपका व्यक्तिगत स्कैन इतिहास',
    authIdentifier: 'मोबाइल नंबर या ईमेल',
    authSubmitting: 'कृपया रुकें…',
    pwShow: 'पासवर्ड दिखाएं',
    pwHide: 'पासवर्ड छिपाएं',
    fullName: 'पूरा नाम',
    mobile: 'मोबाइल नंबर',
    email: 'ईमेल (वैकल्पिक)',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड दोबारा लिखें',
    loginBtn: 'लॉगिन करें',
    signupBtn: 'खाता बनाएं',
    noAccount: 'खाता नहीं है? साइन अप करें',
    haveAccount: 'पहले से खाता है? लॉग इन',
    myProfile: 'प्रोफ़ाइल',
    myHistory: 'मेरा स्कैन इतिहास',
    loginRequiredHistory: 'स्कैन इतिहास देखने के लिए लॉग इन करें।',
    authNameRequired: 'कृपया पूरा नाम भरें।',
    authMobileInvalid: 'कृपया वैध 10 अंकों का मोबाइल नंबर भरें।',
    authEmailInvalid: 'कृपया वैध ईमेल भरें।',
    authPasswordShort: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
    authPasswordMismatch: 'पासवर्ड मेल नहीं खाते।',
    authDuplicateMobile: 'यह मोबाइल नंबर पहले से पंजीकृत है।',
    authDuplicateEmail: 'यह ईमेल पहले से पंजीकृत है।',
    authInvalidCredentials: 'मोबाइल/ईमेल या पासवर्ड गलत है।',
    authSignupSuccess: 'खाता बन गया! स्वागत है।',
    authLoginSuccess: 'स्वागत है, ',
    authLoggedOut: 'आप लॉग आउट हो गए हैं।',
    authSomethingWentWrong: 'कुछ गलत हो गया। कृपया फिर से कोशिश करें।',
    verifiedPrice: 'सत्यापित कीमत',
    priceLastChecked: 'अंतिम जांच',
    priceSeller: 'विक्रेता',
    buyFromSeller: 'विक्रेता से खरीदें'
  },

  en: {
    tag: 'Your smart farming companion',
    scanNav: 'Disease Scan',
    medNav: 'Products',
    historyNav: 'Scan History',
    aboutNav: 'Sources & Trust',
    heroTitle: 'Upload a crop photo.<br><em>Get a first health check</em>.',
    heroText: 'Choose a crop, upload a leaf photo, and review the screening result, symptoms, recommended products, and where to buy.',
    heroBtn: 'Scan now →',
    scanTitle: 'Scan crop disease',
    uploadTitle: 'Upload leaf photo',
    uploadText: 'JPG/PNG/WEBP • max 8 MB',
    choose: 'Choose photo',
    camera: 'Take photo with camera',
    cropLabel: 'Select Crop',
    scanBtnText: 'Check disease',
    scanning: 'AI scan in progress…',
    scanNote: 'Use a clear, well-lit photo where the disease symptoms are visible.',
    medTitle: 'Suitable Products for This Disease',
    allMedTitle: 'All Registered Crop-Protection Products',
    medSubhead: 'Products aligned with CIB&RC registration standards and agricultural university guidelines.',
    trustTitle: 'Trusted information, clear sources',
    trustText: 'Disease and product information is shown with available sources. Prices are not invented when a verified seller feed is unavailable.',
    historyTitle: 'Recent Scan History',
    refreshText: 'Refresh',
    noHistory: 'No recent scan history available yet.',
    resultTitle: 'AI screening result',
    demoNotice: 'DEMO RESULT — This is a demonstration fallback and not a real diagnosis.',
    demoBannerTitle: 'DEMO RESULT — This is a demonstration fallback and not a real diagnosis.',
    demoBannerText: 'This is a demonstration fallback. For actual disease diagnosis, consult an agronomist and always follow current approved product labels.',
    modelBannerTitle: 'AI SCREENING RESULT',
    cropLabelText: 'Crop',
    diseaseLabelText: 'Disease',
    confidence: 'Confidence',
    symptoms: 'Key symptoms',
    management: 'Management information',
    productsTitle: 'Recommended products',
    noProducts: 'No verified product is available for this result.',
    noProductsFilter: 'No products found in this category.',
    noReference: 'No detailed reference is currently available for this disease.',
    price: 'Price',
    priceUnavailable: 'Price unavailable — check seller',
    priceUnavailableSub: 'Live price unlisted. Never inventing estimated prices without verified seller feed.',
    currentOnlinePrice: 'Current online price',
    priceSource: 'Price Source',
    sourceUnavailable: 'Verified seller feed unavailable',
    activeIngredient: 'Active ingredient',
    formulation: 'Formulation',
    pack: 'Pack size',
    usage: 'Usage / details',
    source: 'Verified source',
    registration: 'Registration reference',
    verifiedSource: 'CIB&RC Registered Reference',
    whereToBuy: 'Where to Buy',
    searchAmazon: 'Search on Amazon',
    searchFlipkart: 'Search on Flipkart',
    officialSeller: 'Official Registry / CIBRC',
    viewDetails: 'View Details',
    suitableFor: 'Suitable for',
    target: 'Target disease',
    brand: 'Brand / Manufacturer',
    filterAll: 'All Products',
    filterFungicide: 'Fungicides',
    filterBactericide: 'Bactericides',
    filterBio: 'Bio / Botanical',
    scanFirst: 'Choose a photo first, then scan.',
    scanningHint: 'Please wait, analyzing crop photo…',
    apiError: 'There was a problem while scanning. Please try again.',
    healthy: 'The crop appears healthy',
    disclaimer: 'AI results are only a screening aid. Verify the diagnosis with an expert and always follow the current approved product label.',
    modalTitle: 'Product Detailed Specifications',
    modalInstructions: 'Application & Safety Directions',
    modalClose: 'Close',
    uncertainTitle: 'No confirmed diagnosis',
    lowConfidenceNotice: 'AI result confidence is below 0.80. No pesticide or medicine is recommended.',
    cropMismatchMsg: 'The selected crop and the photo do not match.',
    cropMismatchHint: 'Note: the model identified the photo as {detected}. Choose the correct crop and scan again.',
    modelUnavailableMsg: 'AI model is currently unavailable for this crop.',
    modelUnavailableHint: 'The diagnosis service is unavailable right now. Please try again later or consult an agricultural expert.',
    notConfirmedMsg: 'AI screening result — not a confirmed agronomic diagnosis.',
    demoBadgeLabel: 'DEMO',
    login: 'Log in',
    signup: 'Sign up',
    logout: 'Log out',
    loginTitle: 'Welcome 👋',
    signupTitle: 'Create a new account',
    authWelcome: 'Welcome 👋',
    authLoginSub: 'Log in to your ShetiMitra account',
    authSignupSub: 'Create your free ShetiMitra account',
    authBrandTag: 'Smart companion for farming',
    authTagline: 'Care for your crops, now in a smarter way.',
    authPoint1: 'AI crop disease scan',
    authPoint2: 'Verified medicine guidance',
    authPoint3: 'Your personal scan history',
    authIdentifier: 'Mobile number or email',
    authSubmitting: 'Please wait…',
    pwShow: 'Show password',
    pwHide: 'Hide password',
    fullName: 'Full name',
    mobile: 'Mobile number',
    email: 'Email (optional)',
    password: 'Password',
    confirmPassword: 'Confirm password',
    loginBtn: 'Log in',
    signupBtn: 'Create Account',
    noAccount: 'No account? Sign up',
    haveAccount: 'Already have an account? Log in',
    myProfile: 'Profile',
    myHistory: 'My Scan History',
    loginRequiredHistory: 'Log in to view your scan history.',
    authNameRequired: 'Please enter your full name.',
    authMobileInvalid: 'Please enter a valid 10-digit mobile number.',
    authEmailInvalid: 'Please enter a valid email address.',
    authPasswordShort: 'Password must be at least 6 characters.',
    authPasswordMismatch: 'Passwords do not match.',
    authDuplicateMobile: 'This mobile number is already registered.',
    authDuplicateEmail: 'This email is already registered.',
    authInvalidCredentials: 'Mobile/email or password is incorrect.',
    authSignupSuccess: 'Account created! Welcome.',
    authLoginSuccess: 'Welcome, ',
    authLoggedOut: 'You have been logged out.',
    authSomethingWentWrong: 'Something went wrong. Please try again.',
    verifiedPrice: 'Verified price',
    priceLastChecked: 'Last checked',
    priceSeller: 'Seller',
    buyFromSeller: 'Buy from seller'
  }
};

const cropNames = {
  tomato: { mr: 'टोमॅटो', hi: 'टमाटर', en: 'Tomato' },
  potato: { mr: 'बटाटा', hi: 'आलू', en: 'Potato' },
  grape: { mr: 'द्राक्ष', hi: 'अंगूर', en: 'Grape' },
  cotton: { mr: 'कापूस', hi: 'कपास', en: 'Cotton' },
  soybean: { mr: 'सोयाबीन', hi: 'सोयाबीन', en: 'Soybean' },
  onion: { mr: 'कांदा', hi: 'प्याज़', en: 'Onion' },
  chilli: { mr: 'मिरची', hi: 'मिर्च', en: 'Chilli' },
  pepper: { mr: 'ढोबळी मिरची', hi: 'शिमला मिर्च', en: 'Bell Pepper' },
  wheat: { mr: 'गहू', hi: 'गेहूँ', en: 'Wheat' },
  triticale: { mr: 'ट्रिटिकेल', hi: 'ट्रिटिकेल', en: 'Triticale' }
};

let lang = 'mr';
let lastScanProducts = [];
let allInitialProducts = [];
let currentCategoryFilter = 'all';
let currentScanCrop = null;
let currentScanDisease = null;
let isRecommendedMode = false;
let currentUser = null;
let authMode = 'login';

const $ = (id) => document.getElementById(id);

function escapeHtml(value) {
  return String(value ?? '').replace(
    /[&<>'"]/g,
    (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    })[char]
  );
}

function text(key) {
  return I[lang]?.[key] || I.en[key] || key;
}

function localizedName(name) {
  if (!name) return '';
  if (typeof name === 'string') return name;
  return name[lang] || name.mr || name.hi || name.en || '';
}

function localizedList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') return [value];
  return value[lang] || value.mr || value.hi || value.en || [];
}

/* ============================================================================
   LANGUAGE RENDERING
   ============================================================================ */

function renderLang() {
  const x = I[lang];

  for (const key in x) {
    const el = $(key);
    if (el) el.innerHTML = x[key];
  }

  if ($('navScan')) $('navScan').textContent = text('scanNav');
  if ($('navMed')) $('navMed').textContent = text('medNav');
  if ($('navHistory')) $('navHistory').textContent = text('historyNav');
  if ($('navAbout')) $('navAbout').textContent = text('aboutNav');
  if ($('refreshText')) $('refreshText').textContent = text('refreshText');
  if ($('scanBtnText')) $('scanBtnText').textContent = text('scanBtnText');

  // Auth modal & user area labels
  if ($('authModalTitle')) $('authModalTitle').textContent = authMode === 'signup' ? text('signupTitle') : text('loginTitle');
  if ($('authCardSub')) $('authCardSub').textContent = authMode === 'signup' ? text('authSignupSub') : text('authLoginSub');
  if ($('authBrandTag')) $('authBrandTag').textContent = text('authBrandTag');
  if ($('authTagline')) $('authTagline').textContent = text('authTagline');
  if ($('authPoint1')) $('authPoint1').textContent = text('authPoint1');
  if ($('authPoint2')) $('authPoint2').textContent = text('authPoint2');
  if ($('authPoint3')) $('authPoint3').textContent = text('authPoint3');
  const authLabels = [
    ['liIdentifierLabel', 'authIdentifier'], ['liPasswordLabel', 'password'],
    ['liSubmit', 'loginBtn'], ['toSignup', 'noAccount'],
    ['suNameLabel', 'fullName'], ['suMobileLabel', 'mobile'], ['suEmailLabel', 'email'],
    ['suPasswordLabel', 'password'], ['suConfirmLabel', 'confirmPassword'],
    ['suSubmit', 'signupBtn'], ['toLogin', 'haveAccount']
  ];
  for (const [id, key] of authLabels) {
    if ($(id)) $(id).textContent = text(key);
  }
  document.querySelectorAll('.pwToggle').forEach((btn) => {
    const input = btn.closest('.pwWrap')?.querySelector('input');
    const shown = input && input.type === 'text';
    btn.textContent = shown ? '🙈' : '👁️';
    btn.setAttribute('aria-label', text(shown ? 'pwHide' : 'pwShow'));
  });
  renderUserArea();

  $('lang').value = lang;

  renderCropOptions($('crop')?.value);

  // Update Section 02 title and subhead
  updateMedicineHeadings();

  // Re-render filters and products
  renderFilters();
  renderFilteredCards();
}

function updateMedicineHeadings() {
  const titleEl = $('medTitle');
  const subheadEl = $('medicineSubhead');

  if (isRecommendedMode && currentScanCrop && currentScanDisease) {
    const cropLabel = cropNames[currentScanCrop]?.[lang] || cropNames[currentScanCrop]?.en || currentScanCrop;
    const diseaseName = localizedName(currentScanDisease);
    if (titleEl) {
      titleEl.textContent = `${text('medTitle')} (${cropLabel} • ${diseaseName})`;
    }
    if (subheadEl) {
      subheadEl.textContent = text('medSubhead');
    }
  } else {
    if (titleEl) {
      titleEl.textContent = text('allMedTitle');
    }
    if (subheadEl) {
      subheadEl.textContent = text('medSubhead');
    }
  }
}

function renderCropOptions(selected) {
  const select = $('crop');
  if (!select) return;

  const crops = Object.keys(cropNames);
  select.innerHTML = crops.map((key) => {
    const n = cropNames[key];
    return `
      <option value="${key}">
        ${escapeHtml(n[lang])} / ${escapeHtml(n.en)}
      </option>
    `;
  }).join('');

  if (selected && crops.includes(selected)) {
    select.value = selected;
  }
}

/* ============================================================================
   HTTP UTILITY
   ============================================================================ */

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  let data = null;
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    const error = new Error(data?.error || `HTTP ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

function showMessage(message, type = '') {
  $('result').innerHTML = `
    <div class="resultCard ${type ? `result-${type}` : ''}">
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function handleFile(file) {
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showMessage(
      lang === 'mr'
        ? 'कृपया JPG, PNG किंवा WEBP फोटो निवडा.'
        : lang === 'hi'
          ? 'कृपया JPG, PNG या WEBP फोटो चुनें.'
          : 'Please choose a JPG, PNG or WEBP image.',
      'error'
    );
    return;
  }

  if (file.size > 8 * 1024 * 1024) {
    showMessage(
      lang === 'mr'
        ? 'फोटोचा आकार 8 MB पेक्षा कमी असावा.'
        : lang === 'hi'
          ? 'फोटो का आकार 8 MB से कम होना चाहिए.'
          : 'The image must be smaller than 8 MB.',
      'error'
    );
    return;
  }

  const oldUrl = $('preview').dataset.objectUrl;
  if (oldUrl) {
    URL.revokeObjectURL(oldUrl);
  }

  const url = URL.createObjectURL(file);
  $('preview').src = url;
  $('preview').dataset.objectUrl = url;
  $('preview').style.display = 'block';
  $('fileName').textContent = file.name;
  $('result').innerHTML = '';
}

function renderList(title, items) {
  if (!items || !items.length) return '';
  return `
    <div class="detailBlock">
      <h4>${escapeHtml(title)}</h4>
      <ul>
        ${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
      </ul>
    </div>
  `;
}

/* ============================================================================
   MEDICINE CATEGORY FILTERS
   ============================================================================ */

function renderFilters() {
  const container = $('medicineFilters');
  if (!container) return;

  const filters = [
    { id: 'all', label: text('filterAll') },
    { id: 'fungicide', label: text('filterFungicide') },
    { id: 'bactericide', label: text('filterBactericide') },
    { id: 'botanical', label: text('filterBio') }
  ];

  container.innerHTML = filters.map((f) => `
    <button
      type="button"
      class="filterPill ${currentCategoryFilter === f.id ? 'active' : ''}"
      onclick="setCategoryFilter('${f.id}')"
    >
      ${escapeHtml(f.label)}
    </button>
  `).join('');
}

window.setCategoryFilter = function (filterId) {
  currentCategoryFilter = filterId;
  renderFilters();
  renderFilteredCards();
};

/* ============================================================================
   PRODUCT CARDS RENDERING
   ============================================================================ */

function getActiveProductsList() {
  return isRecommendedMode ? lastScanProducts : allInitialProducts;
}

function renderFilteredCards() {
  const container = $('products');
  if (!container) return;

  const products = getActiveProductsList();
  if (!products || !products.length) {
    container.innerHTML = `
      <div class="emptyCard">
        <strong>${escapeHtml(text('noProducts'))}</strong>
        <p>${escapeHtml(text('disclaimer'))}</p>
      </div>
    `;
    return;
  }

  let filtered = products;
  if (currentCategoryFilter !== 'all') {
    filtered = products.filter((p) => {
      const cat = String(p.category || '').toLowerCase();
      if (currentCategoryFilter === 'botanical') {
        return cat.includes('bio') || cat.includes('botanical') || cat.includes('organic') || cat.includes('other');
      }
      return cat.includes(currentCategoryFilter);
    });
  }

  if (!filtered.length) {
    container.innerHTML = `
      <div class="emptyCard">
        <strong>${escapeHtml(text('noProductsFilter'))}</strong>
        <p>${escapeHtml(text('medSubhead'))}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((p) => renderSingleProductCard(p)).join('');
}

function renderSingleProductCard(p) {
  const name = p[`name_${lang}`] || p.name_mr || p.name_en || p.name;
  const brand = p.brand || p.manufacturer || 'Agricultural Grade';
  const suitableCrop = p.suitableCrop || p.suitable_crop || p.crop || 'All Crops';
  const targetDisease = p.targetDisease || p.target_disease || 'Crop Diseases';
  const activeIng = p.activeIngredient || p.active_ingredient || '—';
  const formulation = p.formulation || '—';
  const packSize = p.packSize || p.pack_size || 'Standard Pack';
  const category = p.category || 'Agricultural Input';

  const hasPrice = p.price !== null && p.price !== undefined && p.price > 0;
  const priceVal = hasPrice ? p.price : (p.price_inr || null);
  const isPriceVerified = priceVal !== null && priceVal !== undefined && priceVal > 0;
  const priceSeller = p.seller || null;
  const pricePackSize = p.packSizeVerified || p.pack_size || null;
  const priceCheckedAt = p.priceCheckedAt || p.price_updated_at || null;

  // WHERE TO BUY — only links that exist in the database (purchase_links table).
  // No URLs are invented; a seller without a stored link is simply not shown.
  const purchaseLinks = Array.isArray(p.purchaseLinks) ? p.purchaseLinks : [];
  const officialUrl = p.sourceUrl || p.source_url || null;

  const imageUrl = p.imageUrl || p.image || '/img/mix.svg';

  return `
    <article class="card productCard" id="product-${escapeHtml(p.id)}">
      <div class="cardImg">
        <img
          src="${escapeHtml(imageUrl)}"
          alt="${escapeHtml(name)}"
          loading="lazy"
          onerror="this.src='/img/mix.svg'"
        >
      </div>

      <div class="cardBody">
        <div class="cardHeaderTags">
          <span class="productTag">
            ${isRecommendedMode ? '✓ Recommended' : 'Product'}
          </span>
          <span class="categoryTag">
            ${escapeHtml(category)}
          </span>
        </div>

        <h3 class="productTitle">${escapeHtml(name)}</h3>
        <div class="productBrand"><b>${escapeHtml(text('brand'))}:</b> ${escapeHtml(brand)}</div>

        <div class="productSuitability">
          <div><b>${escapeHtml(text('suitableFor'))}:</b> ${escapeHtml(suitableCrop)}</div>
          <div><b>${escapeHtml(text('target'))}:</b> ${escapeHtml(targetDisease)}</div>
        </div>

        <div class="productSpecs">
          <div><b>${escapeHtml(text('activeIngredient'))}:</b> ${escapeHtml(activeIng)}</div>
          <div><b>${escapeHtml(text('formulation'))}:</b> ${escapeHtml(formulation)}</div>
          <div><b>${escapeHtml(text('pack'))}:</b> ${escapeHtml(packSize)}</div>
        </div>

        <!-- Price Section: verified price only, otherwise "Price unavailable" -->
        <div class="priceBox">
          <span class="priceLabel">${escapeHtml(text('price'))}</span>
          ${
            isPriceVerified
              ? `
                <div class="priceValue priceAvailable">₹${escapeHtml(priceVal)}</div>
                <span class="priceSubtext">${escapeHtml(text('verifiedPrice'))}</span>
                ${priceSeller ? `<span class="priceSubtext">${escapeHtml(text('priceSeller'))}: ${escapeHtml(priceSeller)}</span>` : ''}
                ${pricePackSize ? `<span class="priceSubtext">${escapeHtml(text('pack'))}: ${escapeHtml(pricePackSize)}</span>` : ''}
                ${priceCheckedAt ? `<span class="priceSubtext">${escapeHtml(text('priceLastChecked'))}: ${escapeHtml(priceCheckedAt)}</span>` : ''}
              `
              : `
                <div class="priceValue priceUnavailable">${escapeHtml(text('priceUnavailable'))}</div>
                <span class="priceSubtext">${escapeHtml(text('priceUnavailableSub'))}</span>
              `
          }
        </div>

        <!-- Verification & Registry Badge -->
        <div class="verificationBox">
          <span class="verifiedBadge">🛡️ ${escapeHtml(p.verificationStatus || text('verifiedSource'))}</span>
          ${
            officialUrl
              ? `
                <a
                  href="${escapeHtml(officialUrl)}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="sourceLink"
                >
                  ${escapeHtml(text('source'))} ↗
                </a>
              `
              : ''
          }
        </div>

        <!-- Where to Buy: only sellers whose links actually exist in the database -->
        <div class="whereToBuy">
          ${
            purchaseLinks.length
              ? `
                <span class="whereToBuyLabel">🛒 ${escapeHtml(text('whereToBuy'))}</span>
                <div class="buyButtons">
                  ${purchaseLinks.map((link, idx) => {
                    const label = String(link.seller || link.badge || '');
                    const cls = /amazon/i.test(label)
                      ? 'amazonBtn'
                      : /flipkart/i.test(label)
                        ? 'flipkartBtn'
                        : 'officialBtn';
                    return `
                      <a
                        href="${escapeHtml(link.url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="buyBtn ${cls}"
                        title="${escapeHtml(link.badge || label)}"
                      >
                        <span>🛒</span> ${escapeHtml(link.badge || label)}
                      </a>
                    `;
                  }).join('')}
                </div>
              `
              : ''
          }

          <button
            type="button"
            class="btn secondary viewDetailsBtn"
            onclick="openProductDetails('${escapeHtml(p.id)}')"
          >
            ℹ️ ${escapeHtml(text('viewDetails'))}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderProductCards(products, recommendedOnly = false, cropKey = null, diseaseObj = null) {
  isRecommendedMode = recommendedOnly;
  currentScanCrop = cropKey;
  currentScanDisease = diseaseObj;

  if (recommendedOnly) {
    lastScanProducts = products || [];
  } else {
    allInitialProducts = products || [];
  }

  currentCategoryFilter = 'all';
  updateMedicineHeadings();
  renderFilters();
  renderFilteredCards();
}

function renderInitialProducts(products) {
  renderProductCards(products, false);
}

/* ============================================================================
   PRODUCT DETAILS MODAL
   ============================================================================ */

window.openProductDetails = function (productId) {
  const allProds = [...lastScanProducts, ...allInitialProducts];
  const p = allProds.find((item) => String(item.id) === String(productId));

  if (!p) return;

  const name = p[`name_${lang}`] || p.name_mr || p.name_en || p.name;
  const brand = p.brand || p.manufacturer || 'Approved Manufacturer';
  const suitableCrop = p.suitableCrop || p.suitable_crop || p.crop || 'All Crops';
  const targetDisease = p.targetDisease || p.target_disease || 'Crop Diseases';
  const activeIng = p.activeIngredient || p.active_ingredient || '—';
  const formulation = p.formulation || '—';
  const packSize = p.packSize || p.pack_size || 'Standard Pack';
  const usage = p[`use_${lang}`] || p.use_mr || p.use_hi || p.use_en || p.details || 'नेहमी अधिकृत उत्पादन लेबलवरील सूचनांचे पालन करा.';

  const hasPrice = p.price !== null && p.price !== undefined && p.price > 0;
  const priceVal = hasPrice ? p.price : (p.price_inr || null);
  const isPriceVerified = priceVal !== null && priceVal !== undefined && priceVal > 0;
  const priceSeller = p.seller || null;
  const pricePackSize = p.packSizeVerified || p.pack_size || null;
  const priceCheckedAt = p.priceCheckedAt || p.price_updated_at || null;

  // WHERE TO BUY — database purchase_links only; no URLs are invented.
  const purchaseLinks = Array.isArray(p.purchaseLinks) ? p.purchaseLinks : [];
  const officialUrl = p.sourceUrl || p.source_url || null;

  $('modalProductName').textContent = `${name} (${brand})`;

  $('modalBody').innerHTML = `
    <div style="display:flex; justify-content:center; margin-bottom:12px;">
      <img
        src="${escapeHtml(p.imageUrl || p.image || '/img/mix.svg')}"
        alt="${escapeHtml(name)}"
        style="width:96px; height:96px; object-fit:contain; border-radius:12px; background:#f4f7f4; padding:8px;"
        onerror="this.src='/img/mix.svg'"
      >
    </div>

    <div class="modalSection">
      <h4>📋 ${escapeHtml(text('modalTitle'))}</h4>
      <p><b>${escapeHtml(text('brand'))}:</b> ${escapeHtml(brand)}</p>
      <p><b>${escapeHtml(text('activeIngredient'))}:</b> ${escapeHtml(activeIng)}</p>
      <p><b>${escapeHtml(text('formulation'))}:</b> ${escapeHtml(formulation)}</p>
      <p><b>${escapeHtml(text('suitableFor'))}:</b> ${escapeHtml(suitableCrop)}</p>
      <p><b>${escapeHtml(text('target'))}:</b> ${escapeHtml(targetDisease)}</p>
      <p><b>${escapeHtml(text('pack'))}:</b> ${escapeHtml(packSize)}</p>
    </div>

    <div class="modalSection">
      <h4>💰 ${escapeHtml(text('price'))}</h4>
      ${
        isPriceVerified
          ? `
            <p><b style="font-size:18px; color:#1b5e20;">₹${escapeHtml(priceVal)}</b> (${escapeHtml(text('verifiedPrice'))})</p>
            ${priceSeller ? `<p><b>${escapeHtml(text('priceSeller'))}:</b> ${escapeHtml(priceSeller)}</p>` : ''}
            ${pricePackSize ? `<p><b>${escapeHtml(text('pack'))}:</b> ${escapeHtml(pricePackSize)}</p>` : ''}
            ${priceCheckedAt ? `<p><b>${escapeHtml(text('priceLastChecked'))}:</b> ${escapeHtml(priceCheckedAt)}</p>` : ''}
          `
          : `<p style="color:#856404; font-weight:700;">${escapeHtml(text('priceUnavailable'))}</p><p class="muted" style="font-size:12px;">${escapeHtml(text('priceUnavailableSub'))}</p>`
      }
    </div>

    <div class="modalSection">
      <h4>📑 ${escapeHtml(text('modalInstructions'))}</h4>
      <p>${escapeHtml(usage)}</p>
      <p style="font-size:12px; color:#666; margin-top:8px;">
        <b>${escapeHtml(text('registration'))}:</b> ${escapeHtml(p.registration_source || 'PPQS / CIB&RC Registered Reference')}
      </p>
      <p style="font-size:11px; color:#888;">
        ${escapeHtml(p.registration_note || 'प्रत्यक्ष वापर करण्यापूर्वी पॅकवरील संपूर्ण लेबल आणि सुरक्षा सूचना काळजीपूर्वक वाचा.')}
      </p>
    </div>

    <div class="modalSection">
      <h4>🛒 ${escapeHtml(text('whereToBuy'))}</h4>
      ${
        purchaseLinks.length
          ? `
            <div class="buyButtons" style="margin-top:8px;">
              ${purchaseLinks.map((link) => {
                const label = String(link.seller || link.badge || '');
                const cls = /amazon/i.test(label)
                  ? 'amazonBtn'
                  : /flipkart/i.test(label)
                    ? 'flipkartBtn'
                    : 'officialBtn';
                return `
                  <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="buyBtn ${cls}">
                    🛒 ${escapeHtml(link.badge || label)}
                  </a>
                `;
              }).join('')}
            </div>
          `
          : `<p class="muted">${escapeHtml(text('sourceUnavailable'))}</p>`
      }
    </div>
  `;

  $('productModal').style.display = 'flex';
};

window.closeProductModal = function (event) {
  if (!event || event.target === $('productModal') || event.target.classList.contains('modalCloseBtn')) {
    $('productModal').style.display = 'none';
  }
};

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && $('productModal') && $('productModal').style.display === 'flex') {
    $('productModal').style.display = 'none';
  }
});

/* ============================================================================
   SCAN RESULT RENDERING
   ============================================================================ */

function renderStatusMessageCard(titleKey, messageKey, extraLine) {
  $('result').innerHTML = `
    <div class="resultCard result-warning">
      <div class="resultBanner banner-warning">
        <span class="bannerIcon">⚠️</span>
        <div>
          <strong>${escapeHtml(text(titleKey))}</strong>
          ${messageKey ? `<p>${escapeHtml(text(messageKey))}</p>` : ''}
        </div>
      </div>
      ${extraLine ? `<p class="muted">${escapeHtml(extraLine)}</p>` : ''}
      <div class="disclaimerBox">
        <small>${escapeHtml(text('notConfirmedMsg'))}</small>
      </div>
    </div>
  `;
  // Safety: a failed/uncertain AI result never recommends products.
  renderProductCards([], true, $('crop')?.value || null, null);
  if ($('medicines')) {
    $('medicines').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  loadScanHistory();
}

function renderScanResult(data) {
  if (!data) {
    return showMessage(text('apiError'), 'error');
  }

  const status = data.status || (data.demo === true ? 'demo' : 'diagnosed');
  const selectedCropKey = data.crop || $('crop').value;

  // STATUS HANDLING — these never become a fake confident disease:
  if (status === 'crop_mismatch') {
    const detectedRaw = data.detectedCrop || null;
    const detectedLabel = detectedRaw
      ? (cropNames[detectedRaw]?.[lang] || cropNames[detectedRaw]?.en || detectedRaw)
      : null;
    const hint = detectedLabel
      ? text('cropMismatchHint').replace('{detected}', detectedLabel)
      : '';
    return renderStatusMessageCard('cropMismatchMsg', null, hint);
  }

  if (status === 'model_unavailable' || status === 'model_unconfigured') {
    return renderStatusMessageCard('modelUnavailableMsg', 'modelUnavailableHint');
  }

  const prediction = data.prediction || data.disease;
  if (!prediction) {
    if (status === 'uncertain') {
      return renderStatusMessageCard('uncertainTitle', 'lowConfidenceNotice');
    }
    return showMessage(text('apiError'), 'error');
  }

  const isDemo = data.demo === true || data.mode === 'demo';
  const minimumConfidence = Number(data.minimumConfidence ?? 0.8);
  const confidence = Number(prediction.confidence ?? data.confidence ?? 0);
  const confidencePct = Math.round(confidence * 100);
  const diseaseName = localizedName(prediction.name);
  const healthy = prediction.healthy === true;
  const uncertain = status === 'uncertain';
  const belowMin = confidence < minimumConfidence;

  const reference = data.reference || null;
  const symptoms = reference ? localizedList(reference.symptoms) : [];
  const management = reference ? localizedList(reference.management) : [];

  const cropDisplay = cropNames[selectedCropKey]?.[lang] || cropNames[selectedCropKey]?.en || selectedCropKey;

  const tone = healthy ? 'healthy' : (uncertain ? 'warning' : 'success');

  // CLIENT-SIDE SAFETY GATE (mirrors the server): only a real model diagnosis
  // at or above minimumConfidence may recommend products.
  const allowedProducts = (status === 'diagnosed' && !healthy && !belowMin && Array.isArray(data.products))
    ? data.products
    : [];

  $('result').innerHTML = `
    <div class="resultCard result-${tone}">

      <!-- Status Banner: demo / uncertain / AI screening -->
      ${
        isDemo
          ? `
            <div class="resultBanner banner-demo">
              <span class="bannerIcon">⚠️</span>
              <div>
                <strong>DEMO RESULT — This is a demonstration fallback and not a real diagnosis.</strong>
                <p>${escapeHtml(text('demoBannerText'))}</p>
              </div>
            </div>
          `
          : uncertain
            ? `
              <div class="resultBanner banner-uncertain">
                <span class="bannerIcon">⚠️</span>
                <div>
                  <strong>${escapeHtml(text('uncertainTitle'))}</strong>
                  <p>${escapeHtml(text('lowConfidenceNotice'))}</p>
                  <small>${escapeHtml(text('notConfirmedMsg'))}</small>
                </div>
              </div>
            `
            : `
              <div class="resultBanner banner-model">
                <span class="bannerIcon">🤖</span>
                <div>
                  <strong>AI SCREENING RESULT</strong>
                  <small>Model: ${escapeHtml(data.modelVersion || 'ONNX Deep Learning')}</small>
                </div>
              </div>
            `
      }

      <!-- Result Summary Fields (Crop, Disease, Confidence) -->
      <div class="resultSummaryGrid">
        <div class="resultSummaryField">
          <span class="fieldLabel">${escapeHtml(text('cropLabelText'))}</span>
          <span class="fieldValue">${escapeHtml(cropDisplay)}</span>
        </div>
        <div class="resultSummaryField">
          <span class="fieldLabel">${escapeHtml(text('diseaseLabelText'))}</span>
          <span class="fieldValue ${healthy ? 'healthyHighlight' : uncertain ? 'uncertainHighlight' : 'diseaseHighlight'}">
            ${escapeHtml(
              healthy
                ? text('healthy')
                : uncertain
                  ? `${diseaseName} — ${text('uncertainTitle')}`
                  : diseaseName
            )}
          </span>
        </div>
        <div class="resultSummaryField">
          <span class="fieldLabel">${escapeHtml(text('confidence'))}</span>
          <span class="fieldValue">${confidencePct}%</span>
        </div>
      </div>

      <!-- Confidence Bar -->
      <div class="confidenceBar">
        <span style="width: ${Math.min(100, Math.max(0, confidencePct))}%"></span>
      </div>

      <!-- Symptoms & Management Sections -->
      ${
        reference
          ? `
            ${renderList(text('symptoms'), symptoms)}
            ${renderList(text('management'), management)}
            ${
              reference.source
                ? `
                  <div class="referenceMeta">
                    <small>📚 <b>${escapeHtml(text('source'))}:</b> ${escapeHtml(reference.source)}</small>
                  </div>
                `
                : ''
            }
          `
          : `
            <p class="muted">${escapeHtml(text('noReference'))}</p>
          `
      }

      <!-- Disclaimer Box -->
      <div class="disclaimerBox">
        <small>${escapeHtml(data.disclaimer || text('disclaimer'))}</small>
      </div>

      <!-- Recommended Products Anchor Link (only for a valid, high-confidence diagnosis) -->
      ${
        allowedProducts.length
          ? `
            <div class="recommendedHeading">
              <h4>${escapeHtml(text('productsTitle'))}</h4>
              <p>${escapeHtml(text('medSubhead'))}</p>
            </div>
          `
          : ''
      }
      ${
        !allowedProducts.length && (uncertain || isDemo)
          ? `<p class="muted"><b>${escapeHtml(text('uncertainTitle'))}</b> — ${escapeHtml(text('lowConfidenceNotice'))}</p>`
          : ''
      }
    </div>
  `;

  // CLIENT-SIDE SAFETY GATE: products are rendered only for a real model
  // diagnosis at or above minimumConfidence and never for a healthy crop —
  // even if a response erroneously contained products.
  renderProductCards(allowedProducts, true, selectedCropKey, prediction.name);

  // Smooth scroll to medicine recommendations
  if ($('medicines')) {
    $('medicines').scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  // Refresh scan history
  loadScanHistory();
}

/* ============================================================================
   SCAN HISTORY
   ============================================================================ */

async function loadScanHistory() {
  const container = $('scanHistoryList');
  if (!container) return;

  // History is per-user: anonymous visitors are asked to log in.
  if (!currentUser) {
    container.innerHTML = `<p class="muted">${escapeHtml(text('loginRequiredHistory'))}</p>
      <button type="button" class="btn secondary" onclick="openAuthModal('login')">${escapeHtml(text('login'))}</button>`;
    return;
  }

  try {
    const scans = await requestJson('/api/scans');
    if (!Array.isArray(scans) || scans.length === 0) {
      container.innerHTML = `<p class="muted">${escapeHtml(text('noHistory'))}</p>`;
      return;
    }

    container.innerHTML = scans.map((s) => {
      const cropKey = String(s.crop || '').toLowerCase();
      const cropLabel = cropNames[cropKey]?.[lang] || cropNames[cropKey]?.en || s.crop;
      const scanStatus = s.status || null;
      const isDemo = scanStatus === 'demo' || s.model_version?.includes('demo') || !s.model_version;
      const confPct = Math.round((s.confidence || 0) * 100);
      const statusBadge = scanStatus && scanStatus !== 'diagnosed'
        ? `<span class="historyMode ${scanStatus === 'uncertain' ? 'uncertain' : 'other'}">${escapeHtml(scanStatus)}</span>`
        : '';

      return `
        <div class="historyCard">
          <div class="historyTop">
            <span class="historyCrop">🌱 ${escapeHtml(cropLabel)}</span>
            <span class="historyMode ${isDemo ? 'demo' : 'model'}">
              ${isDemo ? text('demoBadgeLabel') : 'AI Model'}
            </span>
            ${statusBadge}
          </div>
          <div class="historyDisease">${escapeHtml(s.predicted_disease || 'Diagnosis')}</div>
          <div class="historyMeta">
            <span>${escapeHtml(text('confidence'))}: <b>${confPct}%</b></span>
            <span>${escapeHtml(s.created_at || '')}</span>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = `<p class="muted">${escapeHtml(text('noHistory'))}</p>`;
  }
}

/* ============================================================================
   AUTH: LOGIN / SIGNUP UI
   ============================================================================ */

function renderUserArea() {
  const area = $('userArea');
  if (!area) return;

  if (currentUser) {
    area.innerHTML = `
      <div class="userChip" id="userChip">
        <span class="userAvatar">${escapeHtml((currentUser.name || '?').charAt(0).toUpperCase())}</span>
        <span class="userName">${escapeHtml(currentUser.name)}</span>
        <button type="button" class="btn secondary tinyBtn" id="myHistoryBtn">📜 <span>${escapeHtml(text('myHistory'))}</span></button>
        <button type="button" class="btn secondary tinyBtn" id="logoutBtn">🚪 <span>${escapeHtml(text('logout'))}</span></button>
      </div>
    `;
    $('myHistoryBtn').onclick = () => {
      loadScanHistory();
      $('history')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    $('logoutBtn').onclick = logoutUser;
  } else {
    area.innerHTML = `
      <button type="button" class="btn secondary tinyBtn" id="loginOpenBtn">👤 <span>${escapeHtml(text('login'))}</span></button>
    `;
    $('loginOpenBtn').onclick = () => openAuthModal('login');
  }
}

function setAuthMode(mode) {
  authMode = mode;
  const loginForm = $('loginForm');
  const signupForm = $('signupForm');
  const title = $('authModalTitle');
  const err = $('authError');
  if (err) err.textContent = '';
  if (title) title.textContent = text(mode === 'signup' ? 'signupTitle' : 'loginTitle');
  if ($('authCardSub')) $('authCardSub').textContent = text(mode === 'signup' ? 'authSignupSub' : 'authLoginSub');

  if (mode === 'login') {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
  }

  // Focus the first visible input for keyboard users.
  const firstInput = (mode === 'login' ? loginForm : signupForm)?.querySelector('input');
  if (firstInput) setTimeout(() => firstInput.focus({ preventScroll: true }), 60);
}

window.togglePassword = function (inputId, btn) {
  const input = $(inputId);
  if (!input) return;
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  if (btn) {
    btn.textContent = show ? '🙈' : '👁️';
    btn.setAttribute('aria-pressed', String(show));
    btn.setAttribute('aria-label', text(show ? 'pwHide' : 'pwShow'));
  }
};

function setAuthSubmitting(form, submitting) {
  const button = form?.querySelector('button[type="submit"]');
  if (!button) return null;
  if (submitting) {
    if (!button.dataset.label) button.dataset.label = button.textContent;
    button.disabled = true;
    button.classList.add('loading');
    button.innerHTML = `⏳ <span>${escapeHtml(text('authSubmitting'))}</span>`;
  } else {
    button.disabled = false;
    button.classList.remove('loading');
    button.textContent = authMode === 'signup' ? text('signupBtn') : text('loginBtn');
  }
  return button;
}

window.openAuthModal = function (mode = 'login') {
  const modal = $('authModal');
  if (!modal) return;
  modal.style.display = 'flex';
  setAuthMode(mode);
  $('authError').textContent = '';
};

window.closeAuthModal = function (event) {
  const modal = $('authModal');
  if (!modal) return;
  if (!event || event.target === modal || event.target.classList.contains('authCloseBtn')) {
    modal.style.display = 'none';
  }
};

window.switchAuthMode = function (mode) {
  setAuthMode(mode);
};

function authError(messageKey) {
  const err = $('authError');
  if (err) err.textContent = text(messageKey);
}

function validateSignupInputs({ name, mobile, email, password, confirmPassword }) {
  if (!name) return 'authNameRequired';
  if (!/^\d{10}$/.test(mobile)) return 'authMobileInvalid';
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'authEmailInvalid';
  if (password.length < 6) return 'authPasswordShort';
  if (password !== confirmPassword) return 'authPasswordMismatch';
  return null;
}

async function refreshAuthUser() {
  try {
    const data = await requestJson('/api/auth/me');
    currentUser = data.user || null;
  } catch {
    currentUser = null;
  }
  renderUserArea();
}

async function logoutUser() {
  try {
    await requestJson('/api/auth/logout', { method: 'POST' });
  } catch {
    // Even on failure, clear local state.
  }
  currentUser = null;
  renderUserArea();
  loadScanHistory();
  showMessage(text('authLoggedOut'), 'success');
}

async function handleSignup(event) {
  event.preventDefault();
  const payload = {
    name: String($('suName').value || '').trim(),
    mobile: String($('suMobile').value || '').trim(),
    email: String($('suEmail').value || '').trim(),
    password: String($('suPassword').value || ''),
    confirmPassword: String($('suConfirm').value || '')
  };

  const validationError = validateSignupInputs(payload);
  if (validationError) return authError(validationError);

  const submitButton = setAuthSubmitting(event.target, true);

  try {
    const data = await requestJson('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    currentUser = data.user;
    $('authModal').style.display = 'none';
    event.target.reset();
    renderUserArea();
    loadScanHistory();
    showMessage(text('authSignupSuccess'), 'success');
    // After successful signup the user is already logged in — go to the dashboard.
    $('scan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    const map = {
      duplicate_mobile: 'authDuplicateMobile',
      duplicate_email: 'authDuplicateEmail',
      invalid_mobile: 'authMobileInvalid',
      invalid_email: 'authEmailInvalid',
      password_too_short: 'authPasswordShort',
      password_mismatch: 'authPasswordMismatch',
      name_required: 'authNameRequired'
    };
    authError(map[error.data?.error] || 'authSomethingWentWrong');
  } finally {
    setAuthSubmitting(event.target, false);
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const identifier = String($('liIdentifier').value || '').trim();
  const password = String($('liPassword').value || '');

  if (!identifier || !password) return authError('authInvalidCredentials');

  const submitButton = setAuthSubmitting(event.target, true);

  try {
    const data = await requestJson('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    currentUser = data.user;
    $('authModal').style.display = 'none';
    event.target.reset();
    renderUserArea();
    loadScanHistory();
    showMessage(`${text('authLoginSuccess')}${currentUser.name}`, 'success');
    $('scan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) {
    authError(error.data?.error === 'invalid_credentials' ? 'authInvalidCredentials' : 'authSomethingWentWrong');
  } finally {
    setAuthSubmitting(event.target, false);
  }
}

/* ============================================================================
   INITIAL DATA LOADING
   ============================================================================ */

async function loadInitialData() {
  try {
    const crops = await requestJson('/api/crops');
    const supported = Array.isArray(crops)
      ? crops.filter((c) => cropNames[c])
      : Object.keys(cropNames);

    const selected = $('crop').value;
    $('crop').innerHTML = supported.map((key) => `
      <option value="${escapeHtml(key)}">
        ${escapeHtml(cropNames[key][lang])} / ${escapeHtml(cropNames[key].en)}
      </option>
    `).join('');

    if (supported.includes(selected)) {
      $('crop').value = selected;
    }
  } catch {
    renderCropOptions($('crop')?.value);
  }

  try {
    const products = await requestJson('/api/products');
    renderInitialProducts(Array.isArray(products) ? products : []);
  } catch {
    $('products').innerHTML = `<div class="emptyCard">${escapeHtml(text('apiError'))}</div>`;
  }

  loadScanHistory();
}

/* ============================================================================
   EVENT LISTENERS
   ============================================================================ */

$('lang').onchange = (event) => {
  lang = event.target.value;
  renderLang();
  renderUserArea();
  loadScanHistory();
};

$('file').onchange = (event) => {
  handleFile(event.target.files[0]);
};

$('cameraFile').onchange = (event) => {
  handleFile(event.target.files[0]);
};

if ($('refreshHistoryBtn')) {
  $('refreshHistoryBtn').onclick = () => {
    loadScanHistory();
  };
}

$('scanBtn').onclick = async () => {
  const f = $('file').files[0] || $('cameraFile').files[0];

  if (!f) {
    showMessage(text('scanFirst'), 'warning');
    return;
  }

  const button = $('scanBtn');
  const original = button.innerHTML;

  button.disabled = true;
  button.classList.add('loading');
  button.innerHTML = `⏳ <span>${escapeHtml(text('scanning'))}</span>`;

  $('result').innerHTML = `
    <div class="resultCard result-loading">
      <div class="loader"></div>
      <strong>${escapeHtml(text('scanningHint'))}</strong>
    </div>
  `;

  try {
    const fd = new FormData();
    fd.append('image', f);
    fd.append('crop', $('crop').value);

    const data = await requestJson('/api/scan', {
      method: 'POST',
      body: fd
    });

    renderScanResult(data);
  } catch (error) {
    let message = text('apiError');

    if (error.status === 413) {
      message =
        lang === 'mr'
          ? 'फोटो 8 MB पेक्षा मोठा आहे.'
          : lang === 'hi'
            ? 'फोटो 8 MB से बड़ा है.'
            : 'The image is larger than 8 MB.';
    }

    if (error.status === 400 && error.data?.error === 'image_required') {
      message = text('scanFirst');
    }

    showMessage(message, 'error');
  } finally {
    button.disabled = false;
    button.classList.remove('loading');
    button.innerHTML = original;
  }
};

/* ============================================================================
   APP STARTUP
   ============================================================================ */

// Auth form wiring
if ($('loginForm')) $('loginForm').addEventListener('submit', handleLogin);
if ($('signupForm')) $('signupForm').addEventListener('submit', handleSignup);

renderLang();
refreshAuthUser().finally(() => {
  loadInitialData();
});

// PWA: register the service worker (static shell caching only).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {
      /* PWA caching is optional; failures are silent. */
    });
  });
}