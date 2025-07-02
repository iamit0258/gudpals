
interface VoiceCommand {
  patterns: string[];
  action: {
    type: 'navigate' | 'speak' | 'tutorial';
    path?: string;
    message: string;
  };
}

interface VoiceResponse {
  message: string;
  action?: {
    type: 'navigate' | 'tutorial';
    path?: string;
  };
}

class VoiceAssistantService {
  private commands: VoiceCommand[] = [
    // Navigation commands
    {
      patterns: ['go home', 'take me home', 'home page', 'main page'],
      action: {
        type: 'navigate',
        path: '/',
        message: 'Taking you to the home page.'
      }
    },
    {
      patterns: ['show sessions', 'go to sessions', 'view sessions', 'sessions page'],
      action: {
        type: 'navigate',
        path: '/sessions',
        message: 'Opening the sessions page where you can join activities and classes.'
      }
    },
    {
      patterns: ['show products', 'go to products', 'view products', 'products page', 'shop', 'shopping'],
      action: {
        type: 'navigate',
        path: '/products',
        message: 'Opening the products page where you can browse and buy items.'
      }
    },
    {
      patterns: ['show profile', 'go to profile', 'my profile', 'profile page'],
      action: {
        type: 'navigate',
        path: '/profile',
        message: 'Opening your profile page where you can manage your account.'
      }
    },
    {
      patterns: ['show friends', 'go to friends', 'friends page', 'find friends'],
      action: {
        type: 'navigate',
        path: '/friends',
        message: 'Opening the friends page where you can connect with other users.'
      }
    },
    {
      patterns: ['show activities', 'go to activities', 'activities page', 'what activities'],
      action: {
        type: 'navigate',
        path: '/activities',
        message: 'Opening the activities page where you can explore different activities.'
      }
    },
    {
      patterns: ['show games', 'go to games', 'games page', 'play games'],
      action: {
        type: 'navigate',
        path: '/games',
        message: 'Opening the games page where you can play fun games.'
      }
    },
    {
      patterns: ['show travel', 'go to travel', 'travel page', 'travel packages'],
      action: {
        type: 'navigate',
        path: '/travel',
        message: 'Opening the travel page where you can explore travel packages.'
      }
    },
    {
      patterns: ['show settings', 'go to settings', 'settings page', 'app settings'],
      action: {
        type: 'navigate',
        path: '/settings',
        message: 'Opening the settings page where you can customize your preferences.'
      }
    },
    
    // Help and tutorial commands
    {
      patterns: ['help', 'what can you do', 'commands', 'how to use', 'guide me'],
      action: {
        type: 'speak',
        message: 'I can help you navigate GUDPALS! You can say things like "go home", "show sessions", "take me to products", or "help with this page". I can also guide you through using different features. What would you like to do?'
      }
    },
    {
      patterns: ['how to use this app', 'app tutorial', 'teach me', 'show me around'],
      action: {
        type: 'tutorial',
        message: 'Let me give you a tour of GUDPALS! This app helps seniors stay connected and active. From the home page, you can access sessions for activities, browse products, connect with friends, and much more. Would you like me to show you a specific section?'
      }
    }
  ];

  private pageContexts: Record<string, string> = {
    '/': 'You are on the home page. From here you can access all features of GUDPALS. You can join sessions, browse products, connect with friends, or explore activities. What would you like to do?',
    '/sessions': 'You are on the sessions page. Here you can view and join various activities and classes. You can register for sessions by clicking on them. Say "register for session" or "join activity" to get started.',
    '/products': 'You are on the products page. Here you can browse and purchase items. You can add items to your cart or buy them directly. Say "add to cart" or "buy product" when you find something you like.',
    '/profile': 'You are on your profile page. Here you can view and edit your personal information, see your registered activities, and manage your account settings. You can update your details or view your activity history.',
    '/friends': 'You are on the friends page. Here you can find and connect with other GUDPALS users. You can send friend requests, view your connections, and find people nearby.',
    '/activities': 'You are on the activities page. Here you can explore different types of activities available on GUDPALS. You can filter by category and find activities that interest you.',
    '/games': 'You are on the games page. Here you can play various games designed for entertainment and mental stimulation. Choose a game and start playing!',
    '/travel': 'You are on the travel page. Here you can browse travel packages and plan trips with other GUDPALS members. Explore destinations and book travel experiences.',
    '/settings': 'You are on the settings page. Here you can customize your app preferences, manage notifications, change your language, and adjust accessibility settings.',
    '/sign-in': 'You are on the sign-in page. Please enter your credentials to access your GUDPALS account. If you need help signing in, say "help with login".',
    '/sign-up': 'You are on the registration page. Please fill in your information to create a new GUDPALS account. If you need help, say "help with registration".'
  };

  processCommand(command: string, currentPath: string): Promise<VoiceResponse> {
    return new Promise((resolve) => {
      const lowerCommand = command.toLowerCase();
      console.log('Processing command:', lowerCommand, 'on path:', currentPath);

      // Check for exact matches first
      for (const cmd of this.commands) {
        for (const pattern of cmd.patterns) {
          if (lowerCommand.includes(pattern.toLowerCase())) {
            resolve({
              message: cmd.action.message,
              action: cmd.action.type !== 'speak' ? {
                type: cmd.action.type as 'navigate' | 'tutorial',
                path: cmd.action.path
              } : undefined
            });
            return;
          }
        }
      }

      // Handle page-specific help
      if (lowerCommand.includes('help with this page') || lowerCommand.includes('what is this page')) {
        const contextHelp = this.getContextualHelp(currentPath);
        resolve({
          message: contextHelp
        });
        return;
      }

      // Default response
      resolve({
        message: "I'm not sure what you mean. You can say things like 'go home', 'show sessions', 'take me to products', or 'help' to see what I can do."
      });
    });
  }

  getContextualHelp(currentPath: string): string {
    const baseHelp = this.pageContexts[currentPath] || 'You can navigate to different sections by saying commands like "go home", "show sessions", or "take me to products".';
    
    const generalCommands = ' You can also say "help" to see all available commands, or ask me to "guide you through" any feature.';
    
    return baseHelp + generalCommands;
  }

  // Get tutorial for specific pages
  getTutorial(pagePath: string): string {
    const tutorials: Record<string, string> = {
      '/': 'Welcome to GUDPALS! This is your main dashboard. At the top, you\'ll see navigation options. The sessions section shows upcoming activities you can join. The products area lets you browse items for purchase. Use the bottom navigation to move between different sections of the app.',
      '/sessions': 'On the sessions page, you can see all available activities and classes. Each session shows the title, time, and description. To join a session, simply click on it and then click the register button. You can filter sessions by category using the tabs at the top.',
      '/products': 'The products page displays items available for purchase. You can browse different categories, view product details, and add items to your cart. Click on any product to see more information, then use the "Add to Cart" or "Buy Now" buttons to make a purchase.',
      '/profile': 'Your profile page shows your personal information and activity history. You can update your details, view your registered sessions, and manage your account settings. Click the edit button to make changes to your information.'
    };

    return tutorials[pagePath] || 'This page contains various features you can explore. Feel free to click around and discover what\'s available!';
  }
}

export const voiceAssistantService = new VoiceAssistantService();
