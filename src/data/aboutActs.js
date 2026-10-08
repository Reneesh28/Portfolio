// =========================================================
// CHAPTER 02: ABOUT / CHARACTER PROFILE DATA SOURCE
// Series: Ippiki Ōkami (一匹狼)
// Protagonist Alias: Kokurō (黒狼)
// Tagline: "One wolf. Every trade."
// =========================================================

// Treated WebP Image Imports
import portraitSoft from '../assets/about/manga_about_portrait.soft.webp';
import portraitNoir from '../assets/about/manga_about_portrait.noir.webp';
import sliceOfLifeSoft from '../assets/about/manga_protagonist_slice_of_life.soft.webp';
import buildTech from '../assets/about/manga_about_build.tech.webp';
import leadSharp from '../assets/about/manga_about_lead_explore.sharp.webp';
import shonenSharp from '../assets/about/manga_protagonist_shonen.sharp.webp';
import createNoir from '../assets/about/manga_about_create.noir.webp';
import worldbuildingNoir from '../assets/about/manga_creative_worldbuilding.noir.webp';
import isekaiNoir from '../assets/about/manga_protagonist_isekai.noir.webp';
import darkFantasyNegative from '../assets/about/manga_protagonist_dark_fantasy.negative.webp';
import psychologicalNegative from '../assets/about/manga_protagonist_psychological.negative.webp';
import aiArchitectureTech from '../assets/about/manga_ai_architecture.tech.webp';
import scifiSharp from '../assets/about/manga_protagonist_scifi.sharp.webp';

export const SERIES_INFO = {
  series: 'Ippiki Ōkami',
  seriesKanji: '一匹狼',
  alias: 'Kokurō',
  aliasKanji: '黒狼',
  tagline: 'One wolf. Every trade.',
  chapterNum: '02',
  chapterKanji: '第弐話',
  title: 'CHARACTER PROFILE',
  titleJp: '人物紹介',
  romaji: 'JINBUTSU SHŌKAI',
  pages: 'P. 018-019',
};

// =========================================================
// 1. THE FOUR ACTS (A Day in the Life: 06:00 → 01:00)
// =========================================================
export const ABOUT_ACTS = [
  {
    id: 'act1',
    actNum: '01',
    hour: 6.0,
    timeDisplay: '06:00',
    timePeriod: '朝',
    timePeriodEn: 'DAWN // MORNING',
    traitId: 'build',
    traitTitle: 'BUILD',
    traitKanji: '構築',
    screentoneStyle: 'fine',
    moodDescription: 'Soft light, thin lines, fine light screentone.',
    panels: [
      {
        num: '①',
        type: 'image',
        image: portraitSoft,
        treatment: 'soft',
        alt: 'Balam Reneesh at desk with laptop, notebook, and tea in morning light',
        caption: 'A desk, a laptop, a notebook. This is where systems start.',
      },
      {
        num: '②',
        type: 'thought',
        image: sliceOfLifeSoft,
        treatment: 'soft',
        alt: 'Kokuro in quiet slice-of-life contemplation',
        thoughtText: 'Building systems that learn, remember, and respond.',
      },
      {
        num: '③',
        type: 'image-stamp',
        image: buildTech,
        treatment: 'tech',
        alt: 'Technical machine learning and predictive model architecture',
        caption:
          'ML Intern, MacBease Connections Pvt. Ltd. Data preprocessing pipelines, predictive model evaluation, analytics-driven intelligence.',
        seal: '実習',
        sealLabel: 'INTERN',
      },
      {
        num: '④',
        type: 'dialogue',
        speechBubbles: [
          { speaker: 'QUESTION', text: 'Can you build this?', style: 'shout' },
          { speaker: 'RESPONSE', text: 'Full-stack. Interfaces. Intelligent backends.', style: 'direct' },
        ],
        seal: '独立',
        sealLabel: 'FREELANCE',
      },
    ],
  },
  {
    id: 'act2',
    actNum: '02',
    hour: 12.5,
    timeDisplay: '12:30',
    timePeriod: '昼',
    timePeriodEn: 'NOON // MIDDAY',
    traitId: 'lead',
    traitTitle: 'LEAD',
    traitKanji: '牽引',
    screentoneStyle: 'speedlines',
    moodDescription: 'Sharp, high contrast, bold gutters, speed lines.',
    panels: [
      {
        num: '①',
        type: 'image',
        image: leadSharp,
        treatment: 'sharp',
        alt: 'Leading cross-functional operations and community coordination',
        caption: 'Led operations, large-scale community events, and cross-functional student teams.',
      },
      {
        num: '②',
        type: 'image-sfx',
        image: shonenSharp,
        treatment: 'sharp',
        alt: 'Dynamic CEO protagonist panel with speed lines burst',
        sfx: 'ドンッ',
        sfxMeaning: 'Impact / Boom',
        caption: 'CEO, AniCos Student Organization.',
      },
      {
        num: '③',
        type: 'staircase',
        steps: [
          { rank: '01', title: 'VOLUNTEER', jp: '奉仕' },
          { rank: '02', title: 'BOARD MEMBER', jp: '役員' },
          { rank: '03', title: 'CEO', jp: '統括代表' },
        ],
        seal: '統括',
        sealLabel: 'CEO LEADERSHIP',
      },
      {
        num: '④',
        type: 'placeholder-slot',
        slotId: 'act2-cofounder',
        placeholderTitle: 'CO-FOUNDER SYSTEM ARCHITECTURE',
        caption:
          'Co-founding an upcoming startup. Architecting core features, deployment pipelines, and rapid product iteration.',
        seal: '共同',
        sealLabel: 'CO-FOUNDER',
      },
    ],
  },
  {
    id: 'act3',
    actNum: '03',
    hour: 20.0,
    timeDisplay: '20:00',
    timePeriod: '夜',
    timePeriodEn: 'NIGHT // DUSK',
    traitId: 'create',
    traitTitle: 'CREATE',
    traitKanji: '創造',
    screentoneStyle: 'coarse-halftone',
    moodDescription: 'Noir, heavy blacks, halftone plus pixel-tone texture.',
    panels: [
      {
        num: '①',
        type: 'image',
        image: createNoir,
        treatment: 'noir',
        alt: 'Worldbuilding and interactive game forge sketches',
        caption: 'Worldbuilding, game mechanics, and interactive environments.',
      },
      {
        num: '②',
        type: 'image-sfx',
        image: worldbuildingNoir,
        treatment: 'noir',
        alt: 'Atmospheric creative worldbuilding environments',
        sfx: 'ゴゴゴ',
        sfxMeaning: 'Menacing Rumble / Atmosphere',
        caption: 'Designing worlds that spark curiosity and computational wonder.',
      },
      {
        num: '③',
        type: 'image-stamp',
        image: isekaiNoir,
        treatment: 'noir',
        alt: 'Game systems blending story with procedural computational design',
        caption: 'Gameplay systems that blend storytelling with computational design.',
        seal: '遊戯',
        sealLabel: 'GAME DEV',
      },
    ],
  },
  {
    id: 'act4',
    actNum: '04',
    hour: 25.0, // 01:00 deep night represented as 25.0
    timeDisplay: '01:00',
    timePeriod: '深夜',
    timePeriodEn: 'MIDNIGHT // 憧れ DRIVE',
    traitId: 'explore',
    traitTitle: 'EXPLORE',
    traitKanji: '探求',
    screentoneStyle: 'negative-ink',
    isNegative: true,
    moodDescription: 'NEGATIVE page: deep night background (#0A0A0E), white ink, ink-wash tone.',
    panels: [
      {
        num: '①',
        type: 'placeholder-slot',
        slotId: 'act4-rooftop',
        placeholderTitle: 'LONE WOLF ROOFTOP SILHOUETTE UNDER MOON',
        caption: 'Continuous experimentation.',
      },
      {
        num: '②',
        type: 'image',
        image: darkFantasyNegative,
        treatment: 'negative',
        alt: 'Deep night research, rapid learning, exploring computational frontiers',
        caption: 'Research. Rapid learning. New horizons.',
      },
      {
        num: '③',
        type: 'akogare-spread',
        bgImage: psychologicalNegative,
        glyph: '憧れ',
        subCaption: 'ASPIRATION · YEARNING FOR MASTERY',
        statement:
          'In Japanese manga philosophy, every enduring protagonist is propelled by an innate, quiet aspiration—憧れ (Akogare). It is not the pursuit of empty accolades, but an unrelenting yearning to master the craft: to engineer systems that run with elegance, to forge worlds that spark imagination, and to turn raw curiosity into enduring software.',
        signature: {
          kanji: '一匹狼の道',
          name: 'BALAM RENEESH',
          year: '2026',
        },
        seal: '憧れ',
        sealLabel: 'AKOGARE',
      },
    ],
  },
];

// =========================================================
// 2. THE SIX IDENTITY MARKS (Dial Notches & Spreads)
// =========================================================
export const IDENTITY_MARKS = [
  {
    id: 'intern',
    hour: 7.0,
    angle: 105,
    kanji: '実習',
    name: 'STARTUP INTERN',
    shortName: 'ML INTERN',
    subtitle: 'MACHINE LEARNING & ANALYTICS',
    description:
      'Worked as a Machine Learning Intern at MacBease Connections Pvt. Ltd., building data preprocessing pipelines, evaluating predictive models, and delivering analytics-driven intelligence for real-world use cases.',
    tags: ['MACHINE LEARNING', 'DATA PIPELINES', 'SCIKIT-LEARN', 'ANALYTICS'],
    spreadImage: aiArchitectureTech,
    caption: 'DATA PREPROCESSING · PREDICTIVE EVALUATION · PIPELINE CRAFT',
    stats: { BUILD: 'Core', CREATE: 'Exploring', LEAD: 'Exploring', EXPLORE: 'Applied' },
  },
  {
    id: 'freelancer',
    hour: 10.0,
    angle: 150,
    kanji: '独立',
    name: 'FREELANCER',
    shortName: 'FREELANCE',
    subtitle: 'FULL-STACK & CLIENT SYSTEMS',
    description:
      'Built customized full-stack web applications, interactive interfaces, and intelligent backends for independent clients, translating specific requirements into dependable software.',
    tags: ['FULL-STACK', 'REACT ARCHITECTURE', 'API INTEGRATION', 'CLIENT WORK'],
    spreadImage: portraitNoir,
    isPlaceholderSlot: 'spread-freelance',
    caption: 'CUSTOM CLIENT SOFTWARE · REACT ARCHITECTURES · DEPENDABLE APIS',
    stats: { BUILD: 'Core', CREATE: 'Applied', LEAD: 'Applied', EXPLORE: 'Applied' },
  },
  {
    id: 'ceo',
    hour: 13.0,
    angle: 195,
    kanji: '統括',
    name: 'CEO',
    shortName: 'CLUB CEO',
    subtitle: 'STUDENT ORGANIZATION LEADERSHIP',
    description:
      'Advanced from Volunteer to Board Member and ultimately CEO of AniCos Student Organization. Led organizational operations, managed large-scale community events, and coordinated cross-functional student teams.',
    tags: ['LEADERSHIP', 'OPERATIONS', 'TEAM COORDINATION', 'COMMUNITY'],
    spreadImage: shonenSharp,
    caption: 'ORGANIZATIONAL OPERATIONS · EVENT EXECUTION · CROSS-FUNCTIONAL TEAMS',
    stats: { BUILD: 'Applied', CREATE: 'Applied', LEAD: 'Core', EXPLORE: 'Applied' },
  },
  {
    id: 'cofounder',
    hour: 16.0,
    angle: 240,
    kanji: '共同',
    name: 'CO-FOUNDER',
    shortName: 'CO-FOUNDER',
    subtitle: 'TECHNICAL INITIATIVES & PROJECTS',
    description:
      'Collaborated with engineering peers to co-found and build early-stage technical projects, architecting core features, setting up deployment pipelines, and managing rapid product iterations.',
    tags: ['SYSTEM ARCHITECTURE', 'PRODUCT LAUNCH', 'DEV COLLABORATION'],
    spreadImage: scifiSharp,
    isPlaceholderSlot: 'spread-cofounder',
    caption: 'RAPID PRODUCT ITERATION · CORE ARCHITECTURE · DEPLOYMENT PIPELINES',
    stats: { BUILD: 'Core', CREATE: 'Applied', LEAD: 'Applied', EXPLORE: 'Applied' },
  },
  {
    id: 'gamedev',
    hour: 20.0,
    angle: 300,
    kanji: '遊戯',
    name: 'INDIE GAME DEVELOPER',
    shortName: 'GAME DEV',
    subtitle: 'WORLDBUILDING & SIMULATION',
    description:
      'Dedicated to creative worldbuilding, designing game mechanics, 3D/2D interactive environments, and gameplay systems that blend storytelling with computational design.',
    tags: ['GAME MECHANICS', 'WORLDBUILDING', 'INTERACTIVE MEDIA', 'CREATIVE FORGE'],
    spreadImage: worldbuildingNoir,
    caption: 'INTERACTIVE MECHANICS · 3D/2D WORLDBUILDING · COMPUTATIONAL AESTHETICS',
    stats: { BUILD: 'Applied', CREATE: 'Core', LEAD: 'Exploring', EXPLORE: 'Applied' },
  },
  {
    id: 'akogare',
    hour: 25.0, // 01:00
    angle: 375, // 15° past 360°
    kanji: '憧れ',
    name: '憧れ · AKOGARE',
    shortName: 'AKOGARE',
    subtitle: 'ASPIRATION · YEARNING FOR MASTERY',
    description:
      'The fundamental philosophical engine of the portfolio: an unyielding aspiration and yearning for craft mastery that drives every line of code, system architecture, and creative pursuit.',
    tags: ['CORE PHILOSOPHY', 'YEARNING FOR MASTERY', 'CREATIVE DRIVE'],
    spreadImage: darkFantasyNegative,
    caption: 'UNYIELDING DRIVE · ELEVATED STANDARDS · ENDURING MASTERY',
    isSpecial: true,
    stats: { BUILD: 'Applied', CREATE: 'Applied', LEAD: 'Applied', EXPLORE: 'Core' },
  },
];

// =========================================================
// 3. STAT MATRIX (OWNER-EDITABLE)
// Length values: Core = 100%, Applied = 66%, Exploring = 33%
// =========================================================
export const STAT_DIMENSIONS = [
  { key: 'BUILD', kanji: '構築', label: 'SYSTEMS & AI' },
  { key: 'CREATE', kanji: '創造', label: 'WORLDBUILDING & ART' },
  { key: 'LEAD', kanji: '牽引', label: 'OPERATIONS & TEAMS' },
  { key: 'EXPLORE', kanji: '探求', label: 'EXPERIMENTATION' },
];

export const STAT_LEVEL_PERCENT = {
  Core: 100,
  Applied: 66,
  Exploring: 33,
};

// =========================================================
// 4. CORE TRAITS (Verbatim from CoreTraitsPanels.jsx)
// =========================================================
export const CORE_TRAITS = [
  {
    id: 'build',
    num: '01',
    kanji: '構築',
    title: 'BUILD',
    headline: 'SYSTEMS & AI ARCHITECTURE',
    description:
      'Turning complex mathematical models, machine learning pipelines, and generative AI into practical, responsive software that people rely on.',
    tag: 'CODE · AI · LOGIC',
  },
  {
    id: 'create',
    num: '02',
    kanji: '創造',
    title: 'CREATE',
    headline: 'WORLDBUILDING & GAME FORGE',
    description:
      'Designing interactive game environments, mechanics, and visual narratives where creative aesthetics and computational logic intersect.',
    tag: 'WORLDBUILDING · GAMES · ART',
  },
  {
    id: 'lead',
    num: '03',
    kanji: '牽引',
    title: 'LEAD',
    headline: 'COLLABORATION & COMMUNITY',
    description:
      'Bringing multidisciplinary builders and student communities together, coordinating complex operations, and aligning collective energy toward a shared goal.',
    tag: 'COMMUNITY · COORDINATION · EXECUTION',
  },
  {
    id: 'explore',
    num: '04',
    kanji: '探求',
    title: 'EXPLORE',
    headline: 'CONTINUOUS EXPERIMENTATION',
    description:
      'Pushing past established comfort zones to test nascent technologies, unproven concepts, and discover what lies on the next frontier.',
    tag: 'RESEARCH · RAPID LEARNING · HORIZONS',
  },
];
