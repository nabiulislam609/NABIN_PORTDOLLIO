import { ProfileConfig, Project, ServiceItem } from '../types.ts';

export const DEFAULT_PROFILE: ProfileConfig = {
  name: 'Nabiul Islam Nabin',
  title: 'Data-Driven Digital Marketer | Paid Advertising & SEO Specialist',
  themeColor: '#06B6D4',
  heroDescription:
    'I help businesses improve their online visibility, reach the right audience, and achieve measurable growth through effective digital marketing strategies.',
  aboutBio:
    'I am a passionate digital marketer focused on helping businesses build a strong online presence through SEO, paid advertising, social media management, and analytics. I combine creative strategy with data-driven insights to improve visibility, engagement, and business growth.',
  workApproach:
    'Every campaign begins with in-depth audience research, competitive gap analysis, and robust conversion tracking. I execute high-velocity testing across creatives, bids, and landing pages to ensure maximum ROI and predictable scaling.',
  mainStrengths: [
    'Performance Paid Advertising (Meta & Google Ads)',
    'Data-Driven Technical & Local SEO',
    'Full-Funnel Analytics (GA4, GTM, CAPI)',
    'Conversion Rate Optimization (CRO)',
    'Multi-Location Google Map Citations',
    'Audience Segmentation & Retargeting Loops',
  ],
  careerFocus:
    'Partnering with forward-thinking e-commerce brands, high-growth tech startups, and ambitious local businesses to turn digital touchpoints into revenue engines.',
  heroImage:
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1800&auto=format&fit=crop',
  heroImageOpacity: 75,
  profileImage:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=900&auto=format&fit=crop',
  email: 'nabiulislam609@gmail.com',
  phone: '+880156009961',
  whatsapp: '+8801560009961',
  location: 'Joypurhat, Rajshahi, Bangladesh',
  socials: {
    linkedin: 'https://www.linkedin.com/company/agencydatadrivendigital',
    twitter: '',
    facebook: 'https://www.facebook.com/nabiulislam609/',
    instagram: 'https://www.instagram.com/nabiulislam609/',
    github: 'https://github.com/nabiulislam609',
  },
  stats: {
    yearsExperience: '6+ Years',
    adSpendManaged: '$1.4M+',
    avgRoi: '3.8x ROAS',
    completedProjects: '45+ Projects',
  },
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'meta-ads',
    title: 'Meta Ads',
    category: 'Meta Ads',
    shortDescription:
      'Create and optimize targeted Meta advertising campaigns to improve reach, engagement, leads, and conversions.',
    fullDescription:
      'End-to-end Meta (Facebook & Instagram) paid campaigns from creative angle ideation and audience persona modeling to dynamic catalog retargeting and automated rule-based bid scaling.',
    iconName: 'Megaphone',
    brandLogo: 'https://cdn.simpleicons.org/meta/0081FB',
    brandColor: '#0081FB',
    deliverables: [
      'Full-funnel TOFU/MOFU/BOFU campaign structure',
      'Lookalike, custom, and interest audience research',
      'Dynamic creative optimization & high-converting ad copy',
      'Conversions API (CAPI) deduplication setup',
      'Weekly performance reporting & budget allocation',
    ],
    tools: ['Meta Ads Manager', 'Canva Pro', 'Figma', 'AdEspresso', 'Meta Pixel'],
    typicalOutcomes: '2.5x - 4.5x ROAS with 35% lower cost-per-acquisition (CPA)',
  },
  {
    id: 'google-ads',
    title: 'Google Ads',
    category: 'Google Ads',
    shortDescription:
      'Drive high-intent commercial traffic and qualified leads through Google Search, Performance Max, and YouTube campaigns.',
    fullDescription:
      'Precision search engine marketing targeting purchase-intent keywords, automated bidding strategies, negative keyword negative pruning, and Performance Max asset optimization.',
    iconName: 'Search',
    brandLogo: 'https://cdn.simpleicons.org/googleads/EA4335',
    brandColor: '#EA4335',
    deliverables: [
      'Single-keyword or tightly clustered ad groups (STAGs)',
      'Performance Max (PMax) feed configuration',
      'Responsive Search Ads with dynamic keyword insertion',
      'Comprehensive negative keyword exclusion lists',
      'Value-based smart bidding calibration (tROAS & tCPA)',
    ],
    tools: ['Google Ads', 'Google Keyword Planner', 'SpyFu', 'Google Merchant Center'],
    typicalOutcomes: '+180% Qualified inbound leads with 28% decrease in CPC',
  },
  {
    id: 'local-seo',
    title: 'Local SEO',
    category: 'Local SEO',
    shortDescription:
      'Improve local search visibility and help businesses reach nearby customers through local SEO strategies.',
    fullDescription:
      'Dominate the local map pack (3-pack) and organic neighborhood queries with localized keyword architecture, schema markup, and geo-targeted landing page optimization.',
    iconName: 'MapPin',
    brandLogo: 'https://cdn.simpleicons.org/googlemaps/34A853',
    brandColor: '#34A853',
    deliverables: [
      'Google Business Profile (GBP) audit and 100% completion',
      'Local schema markup (LocalBusiness, GeoCoordinates)',
      'Location-specific landing pages and local keyword targeting',
      'Review generation strategies and sentiment response templates',
      'Local competitor proximity and ranking heatmap tracking',
    ],
    tools: ['BrightLocal', 'Whitespark', 'Google Business Profile', 'SurferSEO'],
    typicalOutcomes: 'Top 3 Map Pack rankings for primary transactional keywords within 90 days',
  },
  {
    id: 'google-map-citation',
    title: 'Google Map Citation',
    category: 'Google Map Citation',
    shortDescription:
      'Build consistent NAP citations across high-authority directories and custom geo-tagged map markers to establish local prominence.',
    fullDescription:
      'Systematic citation building across tier-1 directories, niche local citation registries, and multi-point geo-coordinates to anchor entity prominence in Google algorithms.',
    iconName: 'Navigation',
    brandLogo: 'https://cdn.simpleicons.org/googlemaps/4285F4',
    brandColor: '#4285F4',
    deliverables: [
      '100% NAP (Name, Address, Phone) consistency audit',
      'Tier 1 directory submissions (Yelp, YellowPages, Bing Places, Apple Maps)',
      'Custom geo-tagged Google My Maps citation layers',
      'Duplicate citation discovery, suppression, and cleansing',
      'Verification index report with live URLs',
    ],
    tools: ['Yext', 'Moz Local', 'Google My Maps', 'CitationTracker'],
    typicalOutcomes: '+65% Local organic discoverability and citation authority score',
  },
  {
    id: 'facebook-page-optimization',
    title: 'Facebook Page Optimization',
    category: 'Facebook Page Optimization',
    shortDescription:
      'Transform business pages into high-converting storefronts with professional branding, automated messenger flows, and SEO-friendly info.',
    fullDescription:
      'Complete optimization of Facebook Business Page assets, call-to-action routing, vanity URLs, tab hierarchies, product catalog integrations, and automated messenger bots.',
    iconName: 'Share2',
    brandLogo: 'https://cdn.simpleicons.org/facebook/1877F2',
    brandColor: '#1877F2',
    deliverables: [
      'Custom branded cover video/banner with mobile-safe zone',
      'Automated FAQ greeting & lead capture Messenger flow',
      'Product catalogue and service menu integration',
      'Keyword-optimized About, Bio, and category classifications',
      'Community moderation guidelines and pinned offer posts',
    ],
    tools: ['Meta Business Suite', 'ManyChat', 'Photoshop', 'Canva'],
    typicalOutcomes: '+45% Messenger inquiries and 3x higher direct profile conversions',
  },
  {
    id: 'social-media-management',
    title: 'Social Media Management',
    category: 'Social Media Management',
    shortDescription:
      'Consistent, cohesive content strategy across LinkedIn, Instagram, and Facebook to foster brand loyalty and audience growth.',
    fullDescription:
      'Strategic organic social management connecting visual storytelling, educational carousel sequences, trend alignment, and active community engagement to nurture prospects.',
    iconName: 'Users',
    brandLogo: 'https://cdn.simpleicons.org/instagram/E4405F',
    brandColor: '#E4405F',
    deliverables: [
      'Monthly editorial calendar with theme-based content pillars',
      'Graphic carousels, short-form reels scripts, and copy',
      'Proactive comment replies, DM management, and brand monitoring',
      'Hashtag architecture and trend monitoring',
      'Monthly reach, engagement, and follower growth audits',
    ],
    tools: ['Buffer', 'Later', 'Notion', 'CapCut', 'Figma'],
    typicalOutcomes: '4x Organic engagement rate and consistent monthly follower expansion',
  },
  {
    id: 'pixel-setup-tracking',
    title: 'Pixel Setup and Tracking',
    category: 'Pixel Setup and Tracking',
    shortDescription:
      'Implement bulletproof event tracking with Meta Pixel, Server-side Conversions API (CAPI), and custom conversion events.',
    fullDescription:
      'Ensure every micro and macro conversion is accurately tracked, deduplicated, and attributed amidst iOS 14+ privacy and third-party cookie restrictions.',
    iconName: 'Target',
    brandLogo: 'https://cdn.simpleicons.org/meta/0668E1',
    brandColor: '#0668E1',
    deliverables: [
      'Meta Pixel + Conversions API (CAPI) dual tagging',
      'Event deduplication via unique event_id pairing',
      'Custom standard events (ViewContent, AddToCart, Purchase, Lead)',
      'Aggregated Event Measurement priority configuration',
      'Real-time event testing via Meta Events Manager',
    ],
    tools: ['Meta Pixel Helper', 'Google Tag Manager', 'Stape.io / AWS', 'Shopify / WooCommerce'],
    typicalOutcomes: '98%+ Event Match Quality score on Meta Events Manager',
  },
  {
    id: 'google-analytics',
    title: 'Google Analytics',
    category: 'Google Analytics',
    shortDescription:
      'Deploy, calibrate, and analyze Google Analytics 4 (GA4) with custom exploration reports, user journey funnels, and attribution modeling.',
    fullDescription:
      'Custom GA4 architecture designed to answer real business questions: lead source attribution, user drop-off bottlenecks, e-commerce revenue streams, and cohort retention.',
    iconName: 'BarChart3',
    brandLogo: 'https://cdn.simpleicons.org/googleanalytics/E37400',
    brandColor: '#E37400',
    deliverables: [
      'GA4 property provisioning, data stream setup, and retention tuning',
      'Custom event parameters, user properties, and calculated metrics',
      'Conversion and revenue event mapping',
      'Exploration funnel reports, path analysis, and cohort retention',
      'Cross-domain tracking and internal IP filtering',
    ],
    tools: ['Google Analytics 4', 'Looker Studio', 'BigQuery', 'Google Sheets'],
    typicalOutcomes: '100% Accurate conversion attribution and transparent executive dashboards',
  },
  {
    id: 'google-tag-manager',
    title: 'Google Tag Manager',
    category: 'Google Tag Manager',
    shortDescription:
      'Organize all third-party marketing tags, data layer variables, and triggers in a clean, scalable container.',
    fullDescription:
      'Streamlined implementation of Google Tag Manager (Web & Server-side), eliminating code bloat, speeding up page performance, and enabling rapid ad tag deployments.',
    iconName: 'Code',
    brandLogo: 'https://cdn.simpleicons.org/googletagmanager/246FDB',
    brandColor: '#246FDB',
    deliverables: [
      'Client-side and Server-side GTM container configuration',
      'Custom Data Layer specifications for development teams',
      'Scroll depth, video play, click-to-call, and form submission triggers',
      'Consent Mode v2 implementation for GDPR/CCPA compliance',
      'Container versioning, workspace hygiene, and tag QA debugging',
    ],
    tools: ['Google Tag Manager', 'GTM Preview Mode', 'Omnibug', 'JavaScript'],
    typicalOutcomes: 'Zero code dependencies for marketing launches with sub-second script execution',
  },
  {
    id: 'on-page-seo',
    title: 'On-Page SEO',
    category: 'On-Page SEO',
    shortDescription:
      'Optimize content, semantic structure, internal links, and Core Web Vitals to earn top organic search engine rankings.',
    fullDescription:
      'Comprehensive content and semantic code refinement: H-tag hierarchies, NLP keyword coverage, search intent alignment, schema microdata, and image optimizations.',
    iconName: 'FileText',
    brandLogo: 'https://cdn.simpleicons.org/semrush/FF642D',
    brandColor: '#FF642D',
    deliverables: [
      'In-depth search intent keyword mapping for all target pages',
      'Title tag, meta description, and header (H1-H4) optimization',
      'Content enhancement guided by TF-IDF and NLP semantic scoring',
      'Internal linking silo architecture to channel page authority',
      'Image compression, descriptive alt text, and WebP conversion',
    ],
    tools: ['Ahrefs', 'SurferSEO', 'Clearscope', 'Yoast / RankMath'],
    typicalOutcomes: '+120% Non-branded organic impressions within 60-90 days',
  },
  {
    id: 'off-page-seo',
    title: 'Off-Page SEO',
    category: 'Off-Page SEO',
    shortDescription:
      'Build domain authority and trusted backlinks through white-hat digital PR, editorial outreach, and strategic partner mentions.',
    fullDescription:
      'Sustainable domain rating growth via genuine editorial mentions, guest contributions on industry publications, brand reclamation, and competitor backlink gap replication.',
    iconName: 'ExternalLink',
    brandLogo: 'https://cdn.simpleicons.org/googlesearchconsole/458CF5',
    brandColor: '#458CF5',
    deliverables: [
      'Competitor backlink profile gap analysis',
      'Custom digital PR campaign pitches & journalist outreach',
      'Contextual editorial placements on high DA/DR industry sites',
      'Broken link building and unlinked brand mention reclamation',
      'Disavow analysis to protect against toxic spam backlinks',
    ],
    tools: ['Ahrefs', 'Semrush', 'Pitchbox', 'Hunter.io', 'HARO / Connectively'],
    typicalOutcomes: 'Domain Rating (DR) jump from 18 to 44+ with 30+ contextual referring domains',
  },
  {
    id: 'lead-generation',
    title: 'Lead Generation',
    category: 'Lead Generation',
    shortDescription:
      'Generate high-quality, sales-qualified B2B and B2C leads using targeted funnels, automated outreach, and conversion systems.',
    fullDescription:
      'End-to-end inbound and outbound lead generation systems designed to capture high-intent prospects, qualify leads with custom funnels, and feed automated appointment pipelines.',
    iconName: 'UserCheck',
    brandLogo: 'https://cdn.simpleicons.org/hubspot/FF7A59',
    brandColor: '#FF7A59',
    deliverables: [
      'High-converting landing page & lead capture funnel design',
      'Targeted B2B decision-maker list building and data enrichment',
      'Automated email nurture sequences & appointment booking workflows',
      'Multi-channel retargeting (Meta, LinkedIn & Google Ads)',
      'CRM integration, lead scoring, and pipeline tracking (HubSpot / Zapier)',
    ],
    tools: ['HubSpot', 'Apollo.io', 'LinkedIn Sales Navigator', 'Zapier', 'Typeform'],
    typicalOutcomes: '+240% Increase in qualified sales meetings with 40% reduction in Cost Per Lead (CPL)',
  },
];

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-meta-1',
    title: 'E-Commerce Fashion Brand Scale-Up',
    category: 'Meta Ads',
    image:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'Transformed a boutique apparel brand into an international direct-to-consumer powerhouse using full-funnel Meta advertising and dynamic catalog ads.',
    goals:
      'Overcome rising ad fatigue, diversify creative hooks, and achieve a consistent 3.5x+ return on ad spend (ROAS) while doubling monthly ad spend.',
    workCompleted: [
      'Built a 3-tier campaign architecture (Broad Prospecting, Dynamic Lookalikes, High-Intent Retargeting)',
      'Tested 24 creative angles including UGC video hooks, carousel unboxings, and split-screen comparisons',
      'Configured Meta Conversions API (CAPI) with 9.2/10 Event Quality Score',
      'Implemented automated value-based bidding rules to scale winning ad sets during peak conversion hours',
    ],
    results: '+310% Revenue Growth | 4.1x Blended ROAS | -34% Customer Acquisition Cost',
    projectUrl: 'https://example.com/case-study/fashion-scale',
    date: '2025',
    clientIndustry: 'Direct-to-Consumer Fashion & Apparel',
    strategy:
      'Shifted from narrow interest targeting to broad lifestyle angles powered by AI creative testing and automated retargeting.',
    toolsUsed: ['Meta Ads Manager', 'Canva Pro', 'Shopify Plus', 'Triple Whale', 'Meta CAPI'],
    featured: true,
  },
  {
    id: 'proj-google-1',
    title: 'B2B SaaS Lead Generation Search Campaign',
    category: 'Google Ads',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'Designed high-intent Google Search and Performance Max campaigns for an enterprise cloud collaboration software provider.',
    goals:
      'Eliminate wasted spend on generic informational queries, generate qualified enterprise demo requests, and reduce cost-per-lead below $85.',
    workCompleted: [
      'Rebuilt account structure using Single-Intent Keyword Clusters and aggressive negative keyword lists',
      'Introduced targeted competitor comparison search ads with custom landing page query parameter routing',
      'Created Performance Max campaigns with tightly segmented audience signals',
      'Integrated Google Ads offline conversion tracking via HubSpot webhook',
    ],
    results: '+240% Demo Bookings | Cost Per Lead slashed from $142 to $61 | 5.2x Pipeline Value',
    projectUrl: 'https://example.com/case-study/b2b-saas',
    date: '2025',
    clientIndustry: 'Enterprise B2B Software',
    strategy:
      'High-intent commercial keywords combined with value-based tCPA bidding and hyper-focused landing pages.',
    toolsUsed: ['Google Ads', 'HubSpot CRM', 'SpyFu', 'Google Tag Manager', 'Unbounce'],
    featured: true,
  },
  {
    id: 'proj-local-seo-1',
    title: 'Multi-Location Dental Clinic Local Dominance',
    category: 'Local SEO',
    image:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop',
    ],
    description:
      'Executed a hyper-local SEO & Google Business Profile revitalization across 4 clinic branches in a highly competitive metro area.',
    goals:
      'Secure top-3 Google 3-Pack placements for high-value transactional queries (e.g., "emergency dental care", "invisalign provider near me").',
    workCompleted: [
      'Optimized and verified 4 Google Business Profiles with accurate categories, geocoded photo assets, and localized Q&A',
      'Engineered localized schema markup and unique location service landing pages',
      'Implemented automated post-appointment SMS review generation workflow',
      'Tracked grid rank improvements using local geo-grid heatmap tracking',
    ],
    results: '#1 - #3 Map Pack Rankings for 85% of target keywords | +180% Phone Call Leads | 4.9 Star Rating (380+ reviews)',
    projectUrl: 'https://example.com/case-study/dental-local-seo',
    date: '2024',
    clientIndustry: 'Healthcare & Dentistry',
    strategy:
      'Local schema architecture, proximity-tailored content clusters, and consistent reputation velocity.',
    toolsUsed: ['Google Business Profile', 'BrightLocal', 'SurferSEO', 'Podium SMS', 'Schema.org'],
    featured: true,
  },
  {
    id: 'proj-analytics-1',
    title: 'Enterprise GA4 & Server-Side GTM Migration',
    category: 'Google Analytics',
    image:
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1200&auto=format&fit=crop',
    description:
      'Architected end-to-end Google Analytics 4 tracking and server-side Google Tag Manager infrastructure for a multi-country e-commerce portal.',
    goals:
      'Replace sunsetted Universal Analytics, overcome ad blockers, and provide clean first-party data to paid advertising platforms.',
    workCompleted: [
      'Deployed server-side GTM container on private Cloud Run proxy domain',
      'Configured custom enhanced e-commerce events (view_item_list, select_promotion, begin_checkout, purchase)',
      'Implemented Consent Mode v2 with regional compliance banners',
      'Built automated Looker Studio executive dashboards for cross-channel attribution',
    ],
    results: '99.4% Tracking Accuracy | 0% Data Loss from Browser Ad Blockers | 15 Looker Studio Automated Dashboards',
    projectUrl: 'https://example.com/case-study/ga4-server-tracking',
    date: '2024',
    clientIndustry: 'Omnichannel Retail & E-Commerce',
    strategy:
      'First-party server-side tagging with custom data layers and automated BigQuery event export.',
    toolsUsed: ['Google Analytics 4', 'Google Tag Manager', 'Looker Studio', 'Stape.io', 'BigQuery'],
    featured: true,
  },
  {
    id: 'proj-map-citation-1',
    title: 'Franchise Chain 250+ Google Map Citation Campaign',
    category: 'Google Map Citation',
    image:
      'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=1200&auto=format&fit=crop',
    description:
      'Built, verified, and audited over 250 high-authority NAP citations and multi-tier geo-tagged map pins for a regional home services contractor.',
    goals:
      'Establish unshakeable local prominence across 12 suburban zones and resolve conflicting legacy NAP listings.',
    workCompleted: [
      'Scrubbed and updated inconsistent legacy address & phone citations across 60+ directories',
      'Constructed geo-tagged Google My Maps custom route and landmark layers',
      'Submitted verified citations to tier-1 platforms (Yelp, Apple Maps, Bing, YellowPages, Chamber of Commerce)',
      'Created systematic location citation tracking index with verified live links',
    ],
    results: '100% NAP Consistency Score | +92% Discovery Searches in Google Maps | +140% Monthly Direction Requests',
    projectUrl: 'https://example.com/case-study/map-citations',
    date: '2024',
    clientIndustry: 'Home Services & HVAC Contracting',
    strategy:
      'Systematic cleanup of duplicate records followed by authoritative tiered citations with exact coordinate mapping.',
    toolsUsed: ['Google My Maps', 'Whitespark', 'Yext', 'Moz Local', 'Excel Data Cleaning'],
    featured: false,
  },
  {
    id: 'proj-onpage-1',
    title: 'Organic Content Silo & On-Page SEO Overhaul',
    category: 'On-Page SEO',
    image:
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop',
    description:
      'Revamped 65 cornerstone articles, product categories, and internal link architecture for a FinTech wealth management portal.',
    goals:
      'Rank in the top 5 for high-volume informational & transactional queries in personal finance and retirement planning.',
    workCompleted: [
      'Engineered a topic cluster structure with 4 pillar guides and 60 supporting sub-topic articles',
      'Optimized on-page semantic entities, schema microdata (FAQPage, Article, FinancialProduct), and metadata',
      'Resolved keyword cannibalization issues across 18 overlapping URLs',
      'Improved mobile Core Web Vitals (LCP reduced from 3.8s to 1.4s)',
    ],
    results: '+280% Organic Search Traffic (from 14k to 53k monthly visits) | 42 Keywords in Top 3 Positions',
    projectUrl: 'https://example.com/case-study/fintech-seo',
    date: '2024',
    clientIndustry: 'FinTech & Personal Wealth',
    strategy:
      'Topic cluster authority modeling, search intent re-alignment, and semantic NLP entity optimization.',
    toolsUsed: ['SurferSEO', 'Ahrefs', 'Screaming Frog', 'Google Search Console', 'RankMath'],
    featured: false,
  },
  {
    id: 'proj-social-1',
    title: 'Brand Growth & Viral Social Media Management',
    category: 'Social Media Management',
    image:
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1200&auto=format&fit=crop',
    description:
      'Crafted and executed a high-engagement organic content machine across Instagram, LinkedIn, and Facebook for a premium coffee roastery.',
    goals:
      'Build an active lifestyle community, establish thought leadership in specialty brewing, and drive repeat subscriptions.',
    workCompleted: [
      'Developed 4 weekly content pillars: Coffee Science, Barista Behind-The-Scenes, Customer Spotlights, and Roasting Tips',
      'Designed high-aesthetic educational carousel graphics and curated video reels',
      'Active daily community engagement and influencer co-collaborations',
      'Integrated shop product tagging directly into Instagram posts and stories',
    ],
    results: '4.8x Follower Growth (from 6.2k to 36k) | 7.4% Organic Engagement Rate | +62% Repeat Web Subscriptions',
    projectUrl: 'https://example.com/case-study/specialty-coffee',
    date: '2024',
    clientIndustry: 'Food & Specialty Beverage',
    strategy:
      'Story-driven visual consistency, high-utility carousel guides, and community-first interactive stories.',
    toolsUsed: ['Figma', 'CapCut', 'Notion Content OS', 'Later Scheduler', 'Instagram Insights'],
    featured: false,
  },
  {
    id: 'proj-pixel-1',
    title: 'Cross-Domain Pixel & CAPI Deduplication Architecture',
    category: 'Pixel Setup and Tracking',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    description:
      'Implemented robust client-side and server-side tracking across multiple subdomains and checkout payment gateways.',
    goals:
      'Recover missing attribution data caused by browser restrictions and eliminate duplicate purchase reporting.',
    workCompleted: [
      'Constructed a unified GTM container passing consistent event_id hashes to both browser Pixel and server CAPI',
      'Configured custom user data parameters (hashed email, phone, city, zip) for maximum Match Quality',
      'Tested event firing across all edge cases (Stripe redirects, PayPal popups, manual bank transfers)',
      'Trained internal marketing team on reading Attribution Windows in Ads Manager',
    ],
    results: 'Event Match Quality raised from 4.8 to 9.4/10 | 100% Attribution Accuracy | 22% ROAS Improvement via better bidding',
    projectUrl: 'https://example.com/case-study/pixel-capi-setup',
    date: '2024',
    clientIndustry: 'Global Education & Online Course Academy',
    strategy:
      'Redundant client and server event delivery with cryptographically unique deduplication keys.',
    toolsUsed: ['Meta Pixel Helper', 'Google Tag Manager', 'Stape Server', 'JavaScript', 'Meta Events Manager'],
    featured: false,
  },
];
