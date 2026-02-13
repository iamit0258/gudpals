export interface Intent {
    keywords: string[];
    route?: string; // Optional route for conversational intents
    response: string;
    responseHi?: string; // Hindi response
}

export const nivaIntents: Intent[] = [
    // Conversational Intents (High Priority)
    {
        keywords: ["who are you", "about yourself", "introduction", "tell me about yourself", "tell me about u"],
        response: "Hi, I am Niva, your GudPals voice assistant. How can I help you?",
        responseHi: "नमस्ते, मैं निवा हूं, आपकी गुडपाल्स वॉयस असिस्टेंट। मैं आपकी क्या मदद कर सकती हूं?"
    },
    {
        keywords: ["hello", "hi niva", "hey niva", "good morning", "good afternoon", "good evening", "नमस्ते"],
        response: "Hello! I am Niva. How can I help you today?",
        responseHi: "नमस्ते! मैं निवा हूं। आज मैं आपकी क्या मदद कर सकती हूं?"
    },
    {
        keywords: ["who created", "founder", "developer", "who made", "creator", "अमित", "किसने बनाया"],
        response: "GUDPALS was created by Amit, a final year B.Tech student, to help seniors like you stay connected and active.",
        responseHi: "गुडपाल्स को अमित द्वारा बनाया गया है, जो बी.टेक के अंतिम वर्ष के छात्र हैं।"
    },
    {
        keywords: ["what is gudpals", "tell me about gudpals", "why gudpals", "गुडपाल्स क्या है"],
        response: "GUDPALS is a safe and simple app for senior citizens to join sessions, chat with friends, find jobs, and see travel plans.",
        responseHi: "गुडपाल्स वरिष्ठ नागरिकों के लिए एक सुरक्षित और सरल ऐप है जहां आप सत्रों में शामिल हो सकते हैं, दोस्तों से बात कर सकते हैं और नौकरियां देख सकते हैं।"
    },
    {
        keywords: ["safe", "security", "is it safe", "security for seniors", "सुरक्षित"],
        response: "Yes, GUDPALS is designed to be a very safe and secure platform for seniors. Your data and privacy are our top priority.",
        responseHi: "हाँ, गुडपाल्स वरिष्ठ नागरिकों के लिए एक बहुत ही सुरक्षित मंच है। आपकी सुरक्षा हमारी प्राथमिकता है।"
    },
    {
        keywords: ["free", "cost", "charge", "payment", "is it free", "मुफ्त"],
        response: "GUDPALS is free to use for all senior citizens. Some premium services like 1-on-1 consultations may have a cost.",
        responseHi: "गुडपाल्स वरिष्ठ नागरिकों के लिए उपयोग करने के लिए बिल्कुल मुफ्त है।"
    },
    {
        keywords: ["hindi", "hindi support", "can you speak hindi", "हिंदी"],
        response: "Yes, GUDPALS supports both English and Hindi. You can change your language anytime using the button at the top.",
        responseHi: "हाँ, गुडपाल्स अंग्रेजी और हिंदी दोनों भाषाओं में उपलब्ध है।"
    },
    {
        keywords: ["amit", "final year", "student", "अमित"],
        response: "Amit is the founder of GUDPALS. He is a final year B Tech student who wanted to create something helpful for seniors.",
        responseHi: "अमित गुडपाल्स के संस्थापक हैं। वे बी.टेक के छात्र हैं।"
    },
    {
        keywords: ["why was gudpals created", "problem", "loneliness", "vision", "aim", "लक्ष्य"],
        response: "GUDPALS was created to reduce loneliness among seniors and help them lead more connected and joyful lives.",
        responseHi: "गुडपाल्स को वरिष्ठ नागरिकों के अकेलेपन को कम करने के लिए बनाया गया है।"
    },
    {
        keywords: ["available today", "sessions today", "happening now", "today's activity", "आज का कार्यक्रम"],
        response: "I can check that! Please open the Sessions page to see the full schedule for today.",
        responseHi: "मैं देख सकती हूँ! कृपया आज का पूरा कार्यक्रम देखने के लिए 'सत्र' पेज खोलें।"
    },
    {
        keywords: ["part-time jobs", "suitable for seniors", "what work", "jobs available", "काम", "नौकरी"],
        response: "There are several part-time opportunities available. You can see them all on the Employment page.",
        responseHi: "कई अंशकालिक अवसर उपलब्ध हैं। आप उन्हें 'रोजगार' पेज पर देख सकते हैं।"
    },
    {
        keywords: ["travel plans", "senior tours", "trip", "facilities", "यात्रा"],
        response: "We have special senior-friendly travel plans. Please check the Travel page for more details.",
        responseHi: "हमारे पास विशेष वरिष्ठ-अनुकूल यात्रा योजनाएं हैं। कृपया अधिक जानकारी के लिए 'यात्रा' पेज देखें।"
    },
    {
        keywords: ["how to use", "how do i", "learn", "teach me", "कैसे करें"],
        response: "GUDPALS is designed to be a very simple. You can join the Digital Literacy sessions to learn everything step-by-step!",
        responseHi: "गुडपाल्स को बहुत ही सरल बनाया गया है। आप सब कुछ सीखने के लिए 'डिजिटल साक्षरता' सत्रों में शामिल हो सकते हैं!"
    },
    {
        keywords: ["thank you", "thanks", "done", "शुक्रिया", "धन्यवाद"],
        response: "You're very welcome! Is there anything else I can help you with?",
        responseHi: "आपका स्वागत है! क्या मैं आपकी किसी और चीज़ में मदद कर सकती हूँ?"
    },
    {
        keywords: ["stop", "quiet", "shut up", "बस", "चुप"],
        response: "Understood. I'll be here if you need me again.",
        responseHi: "समझ गई। अगर आपको फिर से मेरी ज़रूरत हो तो मैं यहाँ हूँ।"
    },
    // Navigation Intents (with fallback responses)
    {
        keywords: ["home", "main menu", "dashboard", "go back home", "होम"],
        route: "/",
        response: "Taking you to the home page.",
        responseHi: "आपको होम पेज पर ले जा रही हूँ।"
    },
    {
        keywords: ["session", "sessions", "class", "classes", "upcoming sessions"],
        route: "/sessions",
        response: "Opening sessions. Here you can see upcoming events.",
        responseHi: "सत्र पेज खोल रही हूँ। यहाँ आप आने वाले कार्यक्रम देख सकते हैं।"
    },
    {
        keywords: ["activity", "activities", "game", "games", "fun"],
        route: "/activities",
        response: "Taking you to activities.",
        responseHi: "गतिविधियों पर ले जा रही हूँ।"
    },
    {
        keywords: ["digital", "literacy", "learn phone", "computer", "internet"],
        route: "/digital-literacy",
        response: "Opening digital literacy courses.",
        responseHi: "डिजिटल साक्षरता पाठ्यक्रम खोल रही हूँ।"
    },
    {
        keywords: ["profile", "my account", "me", "settings"],
        route: "/profile",
        response: "Going to your profile.",
        responseHi: "आपकी प्रोफाइल पर जा रही हूँ।"
    },
    {
        keywords: ["friend", "friends", "chat", "talk", "community"],
        route: "/friends",
        response: "Opening your friends list.",
        responseHi: "आपकी मित्र सूची खोल रही हूँ।"
    },
    {
        keywords: ["help", "support", "assist"],
        route: "/help",
        response: "I am Niva. You can ask me to open pages or answer questions.",
        responseHi: "मैं निवा हूँ। आप मुझसे पेज खोलने या सवालों के जवाब देने के लिए कह सकते हैं।"
    },
    {
        keywords: ["employment", "job", "work", "career"],
        route: "/employment",
        response: "Opening employment opportunities.",
        responseHi: "रोजगार के अवसर खोल रही हूँ।"
    },
    {
        keywords: ["travel", "trip", "tour", "vacation"],
        route: "/travel",
        response: "Showing travel plans.",
        responseHi: "यात्रा योजनाएं दिखा रही हूँ।"
    },
    {
        keywords: ["astrology", "horoscope", "stars", "zodiac"],
        route: "/astrology",
        response: "Opening astrology section.",
        responseHi: "ज्योतिष अनुभाग खोल रही हूँ।"
    },
    // E-commerce Intents (New)
    {
        keywords: ["where is my order", "track my order", "order status", "track package", "delivery status", "मेरा ऑर्डर कहां है"],
        route: "/check-order-status", // Internal route/signal
        response: "Checking your latest order status...",
        responseHi: "आपके नवीनतम ऑर्डर की स्थिति की जाँच कर रही हूँ..."
    },
    {
        keywords: ["what is in my cart", "cart items", "show cart", "cart status", "check cart", "कार्ट में क्या है"],
        route: "/check-cart", // Internal route/signal
        response: "Checking your cart...",
        responseHi: "आपके कार्ट की जाँच कर रही हूँ..."
    },
    {
        keywords: ["checkout", "buy now", "place order", "payment", "buy", "खरीदें"],
        route: "/checkout",
        response: "Taking you to checkout to complete your purchase.",
        responseHi: "खरीद पूरी करने के लिए आपको चेकआउट पर ले जा रही हूँ।"
    }
];

const ZODIAC_SIGNS = [
    'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
    'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
    'मेष', 'वृषभ', 'मिथुन', 'कर्क', 'सिंह', 'कन्या',
    'तुला', 'वृश्चिक', 'धनु', 'मकर', 'कुंभ', 'मीन'
];

export const findIntent = (text: string): Intent | null => {
    const lowerText = text.toLowerCase();

    // Check if the text contains a specific zodiac sign query
    // If so, we want to bypass simple navigation and let the AI handle it
    const hasZodiacSign = ZODIAC_SIGNS.some(sign => lowerText.includes(sign));

    const questionWords = ["who", "what", "which", "how", "tell me", "read", "किसने", "क्या", "बताओ", "पढ़ो"];
    const isQuestion = questionWords.some(word => lowerText.includes(word));

    for (const intent of nivaIntents) {
        if (intent.keywords.some(keyword => lowerText.includes(keyword))) {
            // SPECIAL CASE: If the intent is for Astrology page but the user mentioned a specific sign,
            // ignore this navigation intent and let it fall through to AI processing (which reads the horoscope).
            if (intent.route === '/astrology' && hasZodiacSign) {
                continue;
            }

            // NEW: If it's a specific question about a topic (Sessions, Jobs, etc.),
            // let the AI handle it instead of just opening the page.
            if (intent.route && isQuestion) {
                continue;
            }

            return intent;
        }
    }

    return null;
};
