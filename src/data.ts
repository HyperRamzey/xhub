export interface ScriptDef {
  id: string;
  title: string;
  heading: string;
  description: string;
  tags: { label: string; cls: string }[];
  changelogKey?: string;
}

export const SCRIPT_URL =
  "loadstring(game:HttpGet('https://raw.githubusercontent.com/Susibaka2754/apilatest/refs/heads/main/admhub-sg.lua'))()";

export function generateRandomLoadstring(): string {
  return SCRIPT_URL;
}

export const SCRIPTS: ScriptDef[] = [
  {
    id: 'auto-farm',
    title: 'Eclipse Hub - Adopt Me Autofarm',
    heading: 'eclipse hub - adopt me autofarm',
    description:
      "This script for Adopt Me will automatically farm for you, collecting cash and helping you get your dream pets faster than ever before. It's safe, efficient, and easy to use.",
    tags: [
      { label: '✅ UPDATED', cls: 'updated' },
      { label: '⚡ WORKING', cls: 'working' },
      { label: '👑 VERIFIED', cls: 'verified' },
    ],
    changelogKey: 'autofarm',
  },
  {
    id: 'pet-spawner-visual',
    title: 'Adopt Me - Pet Spawner {FIXED, VISUAL ONLY}',
    heading: 'adopt me - pet spawner',
    description: 'Spawn and customise pets visually – no serverside.',
    tags: [
      { label: '🔧 FIXED', cls: 'fixed' },
      { label: '👀 VISUAL ONLY', cls: 'visual' },
      { label: '👑 VERIFIED', cls: 'verified' },
    ],
    changelogKey: 'pet-spawner',
  },
  {
    id: 'trade-checker',
    title: 'Adopt Me - Trade Value Checker',
    heading: 'adopt me - trade value checker',
    description: 'Check trade values instantly to avoid bad trades.',
    tags: [
      { label: '✅ UPDATED', cls: 'updated' },
      { label: '⚡ WORKING', cls: 'working' },
      { label: '👑 VERIFIED', cls: 'verified' },
    ],
  },
  {
    id: 'trade-bypass',
    title: 'Adopt Me - Trade Bypass',
    heading: 'adopt me - trade bypass',
    description: 'Bypass trade restrictions effortlessly.',
    tags: [
      { label: '✅ UPDATED', cls: 'updated' },
      { label: '⚡ WORKING', cls: 'working' },
      { label: '👑 VERIFIED', cls: 'verified' },
    ],
  },
  {
    id: 'food-money',
    title: 'Adopt Me - Food Money Exploit',
    heading: 'adopt me - food money exploit',
    description: 'Exploit food mechanics to earn cash quickly.',
    tags: [
      { label: '✅ UPDATED', cls: 'updated' },
      { label: '⚡ WORKING', cls: 'working' },
      { label: '👑 VERIFIED', cls: 'verified' },
    ],
  },
  {
    id: 'fps-boost',
    title: 'Adopt Me - FPS Boost & Unlock, Better Graphics, Shaders',
    heading: 'adopt me fps boost & unlock, better graphics, shaders',
    description:
      'Boost your FPS, unlock better graphics and add beautiful shaders to enhance your Adopt Me gaming experience.',
    tags: [
      { label: '✅ UPDATED', cls: 'updated' },
      { label: '⚡ WORKING', cls: 'working' },
      { label: '💎 PREMIUM', cls: 'premium' },
      { label: '👑 VERIFIED', cls: 'verified' },
    ],
  },
];

export interface ChangelogEntry {
  date: string;
  changes: string;
}

const CHANGELOGS: Record<string, ChangelogEntry[]> = {
  'pet-spawner': [
    { date: '2024-01-15', changes: '🆕 Initial release with basic pet spawning' },
    { date: '2024-02-20', changes: '🔧 Fixed compatibility with latest Roblox update' },
    { date: '2024-03-10', changes: '✨ Added rare pet spawning capabilities' },
    { date: '2024-04-05', changes: '🛡️ Enhanced security and anti-detection' },
    { date: '2024-05-18', changes: '🎯 Improved target pet selection UI' },
    { date: '2024-06-22', changes: '⚡ Performance optimizations for faster spawning' },
    { date: '2024-07-14', changes: '🐛 Bug fixes for mobile executor compatibility' },
    { date: '2024-08-30', changes: '🔥 Added legendary pet spawning feature' },
    { date: '2024-09-12', changes: '🎨 New GUI design with better UX' },
    { date: '2024-10-25', changes: '🚀 Major update: Serverside capabilities added' },
    { date: '2024-11-08', changes: '🔧 Compatibility fixes for new Adopt Me update' },
    { date: '2024-12-20', changes: '🎁 Holiday special: Exclusive holiday pets support' },
  ],
  autofarm: [
    { date: '2024-01-10', changes: '🆕 Eclipse Hub Autofarm initial release' },
    { date: '2024-02-15', changes: '💰 Enhanced cash collection efficiency' },
    { date: '2024-03-25', changes: '🏃 Added auto-aging and feeding features' },
    { date: '2024-04-18', changes: '🛡️ Anti-ban protection improvements' },
    { date: '2024-05-30', changes: '🎯 Smart pet task automation' },
    { date: '2024-06-12', changes: '⚡ 50% faster farming algorithms' },
    { date: '2024-07-08', changes: '🌙 Added night mode farming optimization' },
    { date: '2024-08-21', changes: '🔧 Mobile executor optimization' },
    { date: '2024-09-15', changes: '🎪 Minigame automation support' },
    { date: '2024-10-03', changes: '🏠 House decoration farming added' },
    { date: '2024-11-17', changes: '🎮 Multi-game support expansion' },
    { date: '2024-12-18', changes: '🎉 Year-end performance boost update' },
  ],
};

export function getChangelog(scriptId: string | undefined): ChangelogEntry[] {
  return (scriptId && CHANGELOGS[scriptId]) || [];
}
