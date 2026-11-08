import manifest from './imageManifest.json';

// Alt text is the accessible description of a real photograph of real people.
// Keep it specific — "Church image 3" tells a screen-reader user nothing.
export const ALT_TEXT = {
  'neon-trio-joy':
    'Three women laughing together in front of the glowing "Home Is Where You Are" neon sign',
  'neon-embrace':
    'Two women embracing and smiling beneath the "Home Is Where You Are" neon lettering',
  'neon-celebrate':
    'A woman in a purple patterned outfit raising her hand in celebration on stage',
  'neon-family-four':
    'A family of four standing together in front of the wooden arch and floral backdrop',
  'neon-group-balcony':
    'A large group of church members gathered together under warm arch lighting',
  'neon-duo-portrait':
    'A man in traditional dress and a young woman posing together at the arch backdrop',
  'neon-agbada-portrait':
    'A man in a white agbada and woven cap standing before the neon-lit wooden arch',
  'neon-sisters-portrait':
    'Two young women standing back to back, laughing, at the floral arch backdrop',
  'neon-black-tee-portrait':
    'A young man in a black t-shirt smiling in front of the neon-lit wooden arch',
  'neon-smile-portrait':
    'A man in a black tunic smiling in front of the "Home Is Where You Are" sign',
  'neon-couple-portrait':
    'A couple standing together in front of the warm neon and dried-floral backdrop',
  'neon-five-women-lowres':
    'Five women posing together in front of the neon sign',
  'magenta-women-joy':
    'Nine women laughing and making peace signs under magenta stage lighting',
  'magenta-women-laugh':
    'Eight women laughing together against a wooden slat wall in magenta light',
  'magenta-trio-women':
    'Three women in bright dresses laughing together under warm stage lighting',
  'magenta-trio-smile':
    'Three women with arms linked, smiling, against a wooden slat wall',
  'magenta-trio-men':
    'Three men with arms around each other, smiling, under magenta stage lighting',
  'magenta-pastor-trio':
    'A woman and two men standing arm in arm in front of a lit wooden wall',
  'magenta-pastor-trio-duplicate':
    'A woman and two men standing arm in arm in front of a lit wooden wall',
  'magenta-youth-group':
    'A group of young church members standing together under warm stage lighting',
  'magenta-children':
    'A woman standing with five children in front of a wooden slat wall',
  'congregation-wide':
    'The GCCC Ibadan congregation gathered together for a group photograph after service',
  'congregation-stage':
    'Church members of all ages gathered on stage beneath warm string lights',
  'congregation-row':
    'Members of the church standing in a row, smiling, beneath festoon lighting',
  'congregation-family':
    'Families and children gathered together on stage after a service',
  'congregation-full':
    'The full church family, adults and children, gathered for a photograph',
  'worship-lead':
    'A worship leader singing into a microphone with the band playing behind her',
  'word-ministration':
    'A minister speaking from the podium during a service, bathed in blue stage light',
  'fellowship-outdoors':
    'Three church members standing together outdoors on a bright afternoon',
};

export const getImage = (name) => {
  const entry = manifest[name];
  if (!entry) {
    throw new Error(
      `[homeImages] Unknown image "${name}". Run "npm run images" if you just added it.`
    );
  }
  return { name, alt: ALT_TEXT[name] ?? '', ...entry };
};

// Render order matters — these arrays drive layout position, not just membership.

// Source order of the hero wall. Below `lg` the tiles flow in exactly this
// order; at `lg` each one is pinned to a cell by heroTiles.js. These ten are
// deliberately distinct from ABOUT_IMAGES — the two sections sit back to back,
// and a photograph repeated across the join reads as a mistake.
export const HERO_IMAGES = [
  'magenta-trio-smile',
  'neon-couple-portrait',
  'neon-black-tee-portrait',
  'neon-celebrate',
  'magenta-youth-group',
  'neon-sisters-portrait',
  'neon-duo-portrait',
  'magenta-children',
  'magenta-pastor-trio',
  'congregation-full',
];

export const ABOUT_IMAGES = [
  'congregation-wide',
  'congregation-stage',
  'congregation-row',
  'congregation-family',
  'neon-embrace',
  'neon-family-four',
  'neon-group-balcony',
  'magenta-women-laugh',
  'magenta-trio-women',
  'magenta-trio-men',
  'worship-lead',
  'fellowship-outdoors',
];

// The rail and the mosaic sit either side of the events section, far enough
// apart that a repeat between them is invisible. Neither borrows from the hero:
// with 27 usable photographs and 42 slots some reuse is unavoidable, so it is
// spent where the page is furthest apart rather than across a section join.
export const RAIL_IMAGES = [
  'neon-embrace',
  'magenta-women-joy',
  'neon-agbada-portrait',
  'congregation-family',
  'word-ministration',
  'magenta-trio-men',
  'congregation-row',
  'magenta-trio-women',
  'fellowship-outdoors',
  'congregation-wide',
  'congregation-stage',
];

export const MOSAIC_IMAGES = [
  'neon-trio-joy',
  'magenta-women-joy',
  'neon-agbada-portrait',
  'congregation-stage',
  'neon-group-balcony',
  'neon-smile-portrait',
  'worship-lead',
  'magenta-women-laugh',
  'neon-family-four',
];
