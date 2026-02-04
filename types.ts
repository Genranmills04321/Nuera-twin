
export enum ToolType {
  FACEBOOK_ADS = 'facebook_ads',
  GOOGLE_ADS = 'google_ads',
  ADS_CREATIVE = 'ads_creative',
  VIDEO_ADS = 'video_ads',
  SALES_PAGE = 'sales_page',
  NEWSLETTER = 'newsletter',
  FOLLOWUP = 'followup',
  LANDING_PAGE = 'landing_page',
  AGENCY_SITE = 'agency_site',
  BRAND_TWIN = 'brand_twin',
  VISUAL_DNA = 'visual_dna',
  BRAND_STRATEGY = 'brand_strategy',
  LOGO_GENERATOR = 'logo_generator',
  IMAGE_GENERATOR = 'image_generator'
}

export type ProjectType = 'sales_page' | 'landing_page' | 'agency_site';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  businessName?: string;
  niche?: string;
  defaultTone?: string;
  defaultAudience?: string;
  brandVoice?: string;
  visualDNA?: string;
  creditsRemaining: number;
  createdAt: string;
}

export interface ProjectSection {
  id: string;
  name: string;
  content: string;
  category: 'hero' | 'problem' | 'solution' | 'proof' | 'faq' | 'cta' | 'custom';
}

export interface Project {
  id: string;
  uid: string;
  projectType: ProjectType;
  title: string;
  sections: ProjectSection[];
  fromTemplateId?: string;
  isUserTemplate?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Template {
  id: string;
  title: string;
  description: string;
  type: ProjectType;
  category: 'saas' | 'ecommerce' | 'service' | 'coaching';
  thumbnail: string;
  sections: ProjectSection[];
  isSystem: boolean;
  popularityScore: number;
}

export interface Generation {
  id: string;
  uid: string;
  parentId?: string; // Links refined assets to their originals
  type: ToolType;
  inputs: any;
  output: any;
  createdAt: string;
}

export interface GenerationInput {
  businessName: string;
  niche: string;
  audience: string;
  tone: string;
  offerDetails: string;
  writingSample?: string;
  logoStyle?: string;
  logoColors?: string;
  logoIcons?: string;
  aspectRatio?: "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
  stylePreset?: string;
}
