export const MOCK_SESSIONS = [
    {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        title: "Morning Yoga",
        title_hi: "प्रातःकालीन योग",
        instructor: "Anjali Sharma",
        instructor_hi: "अंजलि शर्मा",
        time: "8:00 AM - 9:00 AM",
        category: "Wellness",
        category_hi: "स्वास्थ्य",
        image_url: "https://images.unsplash.com/photo-1616699002805-0741e1e4a9c5?q=80&w=300&auto=format&fit=crop",
        activity_type: "session",
        start_time: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
        end_time: new Date(new Date().setHours(9, 0, 0, 0)).toISOString()
    },
    {
        id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
        title: "Smartphone Basics",
        title_hi: "स्मार्टफोन मूल बातें",
        instructor: "Raj Kumar",
        instructor_hi: "राज कुमार",
        time: "11:00 AM - 12:30 PM",
        category: "Digital Literacy",
        category_hi: "डिजिटल साक्षरता",
        image_url: "https://images.unsplash.com/photo-1601784551062-20c13f969c4c?q=80&w=300&auto=format&fit=crop",
        activity_type: "session",
        start_time: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
        end_time: new Date(new Date().setHours(12, 30, 0, 0)).toISOString()
    },
    {
        id: "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
        title: "Tambola Evening",
        title_hi: "तम्बोला शाम",
        instructor: "Meera Patel",
        instructor_hi: "मीरा पटेल",
        time: "4:00 PM - 6:00 PM",
        category: "Entertainment",
        category_hi: "मनोरंजन",
        image_url: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?q=80&w=300&auto=format&fit=crop",
        activity_type: "session",
        start_time: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
        end_time: new Date(new Date().setHours(18, 0, 0, 0)).toISOString()
    }
];
