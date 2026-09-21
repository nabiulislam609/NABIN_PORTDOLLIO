export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  images?: string[];
  description: string;
  goals: string;
  workCompleted: string[];
  results: string;
  projectUrl: string;
  date: string;
  clientIndustry?: string;
  strategy?: string;
  toolsUsed?: string[];
  featured?: boolean;
}

export interface ProfileConfig {
  name: string;
  title: string;
  themeColor?: string;
  backgroundColor?: string;
  heroDescription: string;
  aboutBio: string;
  workApproach: string;
  mainStrengths: string[];
  careerFocus: string;
  heroImage: string;
  heroImageOpacity?: number;
  profileImage: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  socials: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
    github: string;
  };
  stats: {
    yearsExperience: string;
    adSpendManaged: string;
    avgRoi: string;
    completedProjects: string;
  };
}

export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  brandLogo?: string;
  brandColor?: string;
  deliverables: string[];
  tools: string[];
  typicalOutcomes: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read';
}
