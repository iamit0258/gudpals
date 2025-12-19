export interface Intent {
    keywords: string[];
    route?: string; // Optional route for conversational intents
    response: string;
}

export const nivaIntents: Intent[] = [
    // Conversational Intents (High Priority)
    {
        keywords: ["who are you", "about yourself", "introduction", "tell me about yourself", "tell me about u"],
        response: "Hi, I am Niva, your GudPals voice assistant. How can I help you?"
    },
    {
        keywords: ["hello", "hi niva", "hey niva", "good morning", "good afternoon", "good evening", "नमस्ते"],
        response: "Hello! I am Niva. How can I help you today?"
    },
    {
        keywords: ["who created", "founder", "developer", "who made", "creator", "अमित", "किसने बनाया"],
        response: "GUDPALS was created by Amit, a final year B.Tech student, to help seniors like you stay connected and active."
    },
    {
        keywords: ["what is gudpals", "tell me about gudpals", "why gudpals", "गुडपाल्स क्या है"],
        response: "GUDPALS is a safe and simple app for senior citizens to join sessions, chat with friends, find jobs, and see travel plans."
    },
    {
        keywords: ["safe", "security", "is it safe", "security for seniors", "सुरक्षित"],
        response: "Yes, GUDPALS is designed to be a very safe and secure platform for seniors. Your data and privacy are our top priority."
    },
    {
        keywords: ["free", "cost", "charge", "payment", "is it free", "मुफ्त"],
        response: "GUDPALS is free to use for all senior citizens. Some premium services like 1-on-1 consultations may have a cost."
    },
    {
        keywords: ["hindi", "hindi support", "can you speak hindi", "हिंदी"],
        response: "Yes, GUDPALS supports both English and Hindi. You can change your language anytime using the button at the top."
    },
    {
        keywords: ["amit", "final year", "student", "अमित"],
        response: "Amit is the founder of GUDPALS. He is a final year B Tech student who wanted to create something helpful for seniors."
    },
    {
        keywords: ["why was gudpals created", "problem", "loneliness", "vision", "aim", "लक्ष्य"],
        response: "GUDPALS was created to reduce loneliness among seniors and help them lead more connected and joyful lives."
    },
    {
        keywords: ["available today", "sessions today", "happening now", "today's activity", "आज का कार्यक्रम"],
        response: "I can check that! Please open the Sessions page to see the full schedule for today."
    },
    {
        keywords: ["part-time jobs", "suitable for seniors", "what work", "jobs available", "काम", "नौकरी"],
        response: "There are several part-time opportunities available. You can see them all on the Employment page."
    },
    {
        keywords: ["travel plans", "senior tours", "trip", "facilities", "यात्रा"],
        response: "We have special senior-friendly travel plans. Please check the Travel page for more details."
    },
    {
        keywords: ["how to use", "how do i", "learn", "teach me", "कैसे करें"],
        response: "GUDPALS is designed to be very simple. You can join the Digital Literacy sessions to learn everything step-by-step!"
    },
    {
        keywords: ["thank you", "thanks", "done", "शुक्रिया", "धन्यवाद"],
        response: "You're very welcome! Is there anything else I can help you with?"
    },
    {
        keywords: ["stop", "quiet", "shut up", "बस", "चुप"],
        response: "Understood. I'll be here if you need me again."
    },
    // Navigation Intents (with fallback responses)
    {
        keywords: ["home", "main menu", "dashboard", "go back home", "होम"],
        route: "/",
        response: "Taking you to the home page."
    },
    {
        keywords: ["session", "sessions", "class", "classes", "upcoming sessions"],
        route: "/sessions",
        response: "Opening sessions. Here you can see upcoming events."
    },
    {
        keywords: ["activity", "activities", "game", "games", "fun"],
        route: "/activities",
        response: "Taking you to activities."
    },
    {
        keywords: ["digital", "literacy", "learn phone", "computer", "internet"],
        route: "/digital-literacy",
        response: "Opening digital literacy courses."
    },
    {
        keywords: ["profile", "my account", "me", "settings"],
        route: "/profile",
        response: "Going to your profile."
    },
    {
        keywords: ["friend", "friends", "chat", "talk", "community"],
        route: "/friends",
        response: "Opening your friends list."
    },
    {
        keywords: ["help", "support", "assist"],
        route: "/help",
        response: "I am Niva. You can ask me to open pages or answer questions."
    },
    {
        keywords: ["employment", "job", "work", "career"],
        route: "/employment",
        response: "Opening employment opportunities."
    },
    {
        keywords: ["travel", "trip", "tour", "vacation"],
        route: "/travel",
        response: "Showing travel plans."
    },
    {
        keywords: ["astrology", "horoscope", "stars", "zodiac"],
        route: "/astrology",
        response: "Opening astrology section."
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
