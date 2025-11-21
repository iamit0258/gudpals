
import React, { useState } from "react";
import { Star, MessageSquare, DollarSign, Clock, Check, X } from "lucide-react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { useNavigate } from "react-router-dom";

interface Astrologer {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  initials: string;
  isPremium: boolean;
  price: number | null;
  availability: string;
  languages: string[];
}

const Astrology = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const navigate = useNavigate();

  const astrologers: Astrologer[] = [
    {
      id: "1",
      name: "Ravi Sharma",
      specialty: "Vedic Astrology",
      experience: "20+ years",
      rating: 4.8,
      initials: "RS",
      isPremium: false,
      price: null,
      availability: "Available now",
      languages: ["Hindi", "English"]
    },
    {
      id: "2",
      name: "Neha Sharma",
      specialty: "Tarot Reading",
      experience: "15+ years",
      rating: 4.7,
      initials: "NS",
      isPremium: true,
      price: 599,
      availability: "Available in 30 mins",
      languages: ["Hindi", "Gujarati", "English"]
    },
  ];

  const zodiacSigns = [
    { name: "Aries", dates: "Mar 21 - Apr 19" },
    { name: "Taurus", dates: "Apr 20 - May 20" },
    { name: "Gemini", dates: "May 21 - Jun 20" },
    { name: "Cancer", dates: "Jun 21 - Jul 22" },
    { name: "Leo", dates: "Jul 23 - Aug 22" },
    { name: "Virgo", dates: "Aug 23 - Sep 22" },
    { name: "Libra", dates: "Sep 23 - Oct 22" },
    { name: "Scorpio", dates: "Oct 23 - Nov 21" },
    { name: "Sagittarius", dates: "Nov 22 - Dec 21" },
    { name: "Capricorn", dates: "Dec 22 - Jan 19" },
    { name: "Aquarius", dates: "Jan 20 - Feb 18" },
    { name: "Pisces", dates: "Feb 19 - Mar 20" }
  ];

  const handleConsult = (astrologer: Astrologer) => {
    if (astrologer.isPremium) {
      // Store selected astrologer data for checkout
      localStorage.setItem('selectedAstrologer', JSON.stringify(astrologer));
      navigate("/astrology/payment");
    } else {
      // Store selected astrologer data for chat
      localStorage.setItem('selectedAstrologer', JSON.stringify(astrologer));
      navigate("/astrology/chat");
    }
  };

  const selectZodiacSign = (sign: string) => {
    setSelectedSign(sign);
    toast({
      title: `${sign} Selected`,
      description: `Your personalized horoscope for ${sign} is now available.`,
    });
  };

  return (
    <MobileLayout>
      <div className="relative bg-gradient-to-br from-green-900 via-green-800 to-teal-800 text-white p-6">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIca8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSJ3aGl0ZSIgLz4KPC9zdmc+')] bg-repeat"></div>
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 flex items-center">
            <Star className="w-8 h-8 mr-2 text-yellow-300" />
            Astrology Services
          </h1>
          <p className="text-white/80 mb-6">Discover your cosmic path with our expert astrologers</p>
        </div>
      </div>

      <section className="p-4">
        <h2 className="text-xl font-semibold mb-4">Select Your Zodiac Sign</h2>
        <div className="grid grid-cols-3 gap-3">
          {zodiacSigns.map((sign) => (
            <Button
              key={sign.name}
              variant={selectedSign === sign.name ? "default" : "outline"}
              className={`h-auto flex flex-col py-3 ${selectedSign === sign.name
                ? "bg-gradient-to-br from-green-600 to-teal-600"
                : ""
                }`}
              onClick={() => selectZodiacSign(sign.name)}
            >
              <span className="font-medium">{sign.name}</span>
              <span className="text-xs mt-1 opacity-80">{sign.dates}</span>
            </Button>
          ))}
        </div>
      </section>

      {selectedSign && (
        <section className="p-4 bg-gradient-to-r from-green-100/50 to-teal-100/50">
          <h2 className="text-xl font-semibold mb-3">Today's Horoscope for {selectedSign}</h2>
          <Card className="border-green-200 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <p className="italic text-gray-600 mb-3">
                "Today is a day of opportunities and reflection. The stars align to bring you clarity
                in matters of the heart. Take time to listen to your inner voice and trust your intuition."
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <Badge variant="outline" className="bg-green-50 border-green-200">
                  Lucky Number: 7
                </Badge>
                <Badge variant="outline" className="bg-green-50 border-green-200">
                  Lucky Color: Green
                </Badge>
                <Badge variant="outline" className="bg-green-50 border-green-200">
                  Compatible: Leo
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="p-4">
        <h2 className="text-xl font-semibold mb-4">Our Astrologers</h2>
        <div className="space-y-4">
          {astrologers.map((astrologer) => (
            <Card key={astrologer.id} className="overflow-hidden border-none shadow-md">
              <CardContent className="p-0">
                <div className="flex items-center p-4">
                  <div className="relative mr-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 text-white font-bold text-xl">
                      {astrologer.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                      <div className={`h-3 w-3 rounded-full ${astrologer.availability.includes("now")
                        ? "bg-green-500"
                        : "bg-amber-500"
                        }`}></div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-lg flex items-center">
                      {astrologer.name}
                      {astrologer.isPremium ? (
                        <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-amber-600">
                          Premium
                        </Badge>
                      ) : (
                        <Badge className="ml-2 bg-gradient-to-r from-green-500 to-green-600">
                          Free
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{astrologer.specialty}</p>
                    <div className="flex items-center mt-1 text-sm">
                      <Star className="h-4 w-4 text-amber-500 mr-1" />
                      <span>{astrologer.rating}</span>
                      <span className="mx-2">•</span>
                      <span>{astrologer.experience}</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 pb-2">
                  <div className="flex gap-2 flex-wrap mb-2 text-xs">
                    {astrologer.languages.map(lang => (
                      <Badge key={lang} variant="outline" className="bg-gray-50">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{astrologer.availability}</span>
                    </div>
                    <div>
                      {astrologer.isPremium ? (
                        <div className="font-semibold text-gray-800">₹{astrologer.price}</div>
                      ) : (
                        <div className="text-green-600 font-semibold">Free</div>
                      )}
                    </div>
                  </div>
                  <Button
                    className={`w-full mb-4 ${astrologer.isPremium ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-600 hover:bg-green-700'}`}
                    onClick={() => handleConsult(astrologer)}
                  >
                    {astrologer.isPremium ? (
                      <>
                        <DollarSign className="h-4 w-4 mr-1" />
                        Book Consultation
                      </>
                    ) : (
                      <>
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Chat Now (Free)
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </MobileLayout>
  );
};

export default Astrology;
