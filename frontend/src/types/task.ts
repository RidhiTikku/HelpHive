export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  location: {
    address: string;
  };
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  estimatedDuration: number; // hours
  poster: {
    name: string;
    rating: number;
    avatar?: string;
  };
  bidCount: number;
  postedAt: string;
  // New fields
  skills: string[];
  deadline: string; // ISO or human readable
  images?: string[];
  contactPreference?: 'chat' | 'call' | 'either';
  status?: 'open' | 'assigned' | 'completed';
}

