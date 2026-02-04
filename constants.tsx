
import React from 'react';
import { ToolType } from './types.ts';

export const TOOL_CONFIGS = {
  [ToolType.FACEBOOK_ADS]: {
    title: 'Facebook Ads',
    description: 'Stop the scroll with 5 high-converting ad variants.',
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  },
  [ToolType.GOOGLE_ADS]: {
    title: 'Google Ads',
    description: 'High-intent search ads (30-char headlines, 90-char desc).',
    icon: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><path d="M10 9v6m4-6v6" />
  },
  [ToolType.ADS_CREATIVE]: {
    title: 'Ads Creative',
    description: 'Generate both high-converting copy and professional ad imagery.',
    icon: <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  },
  [ToolType.VIDEO_ADS]: {
    title: 'Video Ad Scripts',
    description: 'Hook, Body, and CTA scripts for TikTok, Reels, and YouTube.',
    icon: <path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
  },
  [ToolType.BRAND_STRATEGY]: {
    title: 'Brand Strategy',
    description: 'Generate a full business idea, USP, and mission statement.',
    icon: <path d="m12 14 4-4 4 4-4 4-4-4Z" /><path d="M3.34 19a10 10 0 1 1 17.32 0" />
  },
  [ToolType.BRAND_TWIN]: {
    title: 'Brand Twin',
    description: 'Analyze writing samples to clone your unique brand voice.',
    icon: <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  },
  [ToolType.VISUAL_DNA]: {
    title: 'Visual DNA',
    description: 'Generate color palettes, typography, and mood guides.',
    icon: <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  },
  [ToolType.LOGO_GENERATOR]: {
    title: 'Logo Designer',
    description: 'Neural generation of professional brand marks and logos.',
    icon: <path d="M12 3v19" /><path d="M5 8h14" /><path d="M15 21a3 3 0 0 0-3-3 3 3 0 0 0-3 3" /><circle cx="12" cy="8" r="5" />
  },
  [ToolType.IMAGE_GENERATOR]: {
    title: 'Brand Imagery',
    description: 'Create custom photos and illustrations for your brand.',
    icon: <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" /><line x1="16" y1="5" x2="22" y2="5" /><line x1="19" y1="2" x2="19" y2="8" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  },
  [ToolType.SALES_PAGE]: {
    title: 'Sales Page',
    description: 'Long-form copy with headlines, story, benefits, and FAQ.',
    icon: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  },
  [ToolType.NEWSLETTER]: {
    title: 'Email Newsletter',
    description: 'Engaging content with multiple subject line options.',
    icon: <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
  },
  [ToolType.FOLLOWUP]: {
    title: 'Email Sequence',
    description: 'A 5-part email sequence designed to close leads.',
    icon: <path d="M15 10l5 5-5 5" /><path d="M4 4v7a4 4 0 0 0 4 4h12" />
  }
};

export const TONE_OPTIONS = [
  'Professional',
  'Friendly',
  'Bold & Disruptive',
  'Luxury & Sophisticated',
  'Direct Response (Hard Sell)',
  'Helpful & Educational',
  'Witty & Humorous'
];
