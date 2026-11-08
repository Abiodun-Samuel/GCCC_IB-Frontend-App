import { Bird, Citrus, Cookie, CupSoda, Footprints, Sailboat, Trees, Utensils } from 'lucide-react';

// The GCCC Hangout 2026 page copy. The games are in hangoutGames.js; whether
// registration is open, the support account and the counts come from the API.

export const HANGOUT = {
  title: 'GCCC Hangout 2026',
  // Shown until the API answers; the API's starts_at is used once it does.
  startsAt: '2026-11-28T10:00:00+01:00',
  // Agodi Gardens closes at 6 PM, so calendar entries end then.
  calendarEndsAt: '2026-11-28T18:00:00+01:00',
  intro: 'A Saturday of games, food and fellowship for the GCCC Ibadan family at Agodi Gardens. Pick the game you want to play and register in a minute.',
};

export const VENUE = {
  name: 'Agodi Gardens',
  // As Google Maps lists the place.
  address: 'Parliament Road, Mokola Hill, Ibadan 200285, Oyo State',
  shortAddress: 'Parliament Road, Mokola Hill, Ibadan',
  area: 'Parliament Road, Ibadan',
  directions: 'Beside the Oyo State Secretariat, between Agodi and Mokola Hill. Enter through Agodi Gate.',
  // Google resolves the named place, which lands on the gate.
  mapsQuery: 'Agodi Gardens, Parliament Road, Ibadan',
};

// Church-family photos from the site's own library (public/images/home), by
// manifest name. The hero and the gallery each use their own set, so no photo
// shows twice. Hero columns are staggered; each photo keeps its own shape.
export const HERO_PHOTOS = [
  ['neon-sisters-portrait', 'magenta-women-joy', 'magenta-pastor-trio'],
  ['neon-trio-joy', 'neon-duo-portrait', 'congregation-stage'],
  ['fellowship-outdoors', 'magenta-trio-men'],
];
// All 3:2 landscapes, so the gallery grid lines up exactly.
export const GALLERY_PHOTOS = [
  'neon-group-balcony',
  'neon-celebrate',
  'magenta-youth-group',
  'neon-embrace',
  'magenta-women-laugh',
  'neon-family-four',
  'magenta-trio-smile',
  'worship-lead',
  'magenta-children',
];

// Sources: Wikipedia (Agodi Gardens). The photo is the name sign at the gardens.
export const AGODI = {
  about: [
    'Agodi Gardens is one of Ibadan’s best-loved parks: about 150 acres of lawns, tall trees and a lake on Parliament Road, beside the Oyo State Secretariat.',
    'Beyond the games, the gardens have a water park, a mini zoo, picnic lawns and shaded paths to wander.',
  ],
  photo: {
    path: '/images/hangout/venue/agodi-sign',
    alt: 'The Agodi Gardens name sign on a stone wall',
    width: 1200,
    height: 800,
    widths: [480, 800, 1200],
    credit: {
      source: 'Wikimedia Commons',
      author: 'Eukoha',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
      url: 'https://commons.wikimedia.org/wiki/File:Agodi_Gardens,_Ibadan.jpg',
    },
  },
  video: { id: 'Y7FycPRk498', title: 'Agodi Gardens from the air', channel: 'Abinibi Hub' },
};

const attractionPhoto = (name, alt) => ({ path: `/images/hangout/attractions/${name}`, alt, width: 1200, height: 800, widths: [480, 800, 1200] });

// Laid on for the hangout. The photos show the kind of thing, not a menu.
export const FOOD_AND_DRINKS_INTRO = 'Games build an appetite. Between rounds there’ll be good food, cold drinks, snacks and refreshments, so you can refuel, cool off and catch up with the church family.';

export const FOOD_AND_DRINKS = [
  {
    title: 'Food',
    description: 'A proper meal to refuel after your game.',
    icon: Utensils,
    photo: attractionPhoto('food', 'A plate of jollof rice with fried plantain'),
  },
  {
    title: 'Snacks',
    description: 'Small chops and bites to grab between games.',
    icon: Cookie,
    photo: {
      ...attractionPhoto('snacks', 'A tray of puff-puff and samosas'),
      credit: {
        source: 'Wikimedia Commons',
        author: 'Nimah salihu',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
        url: 'https://commons.wikimedia.org/wiki/File:SmallChops.jpg',
      },
    },
  },
  {
    title: 'Drinks',
    description: 'Ice-cold drinks to beat the Ibadan heat.',
    icon: CupSoda,
    photo: attractionPhoto('drinks', 'Three glasses of chilled fruit juice with straws'),
  },
  {
    title: 'Refreshments',
    description: 'Fresh, cool treats whenever you need a breather.',
    icon: Citrus,
    photo: attractionPhoto('refreshments', 'A platter of watermelon, strawberries and blueberries'),
  },
];

// The park's own attractions, open to everyone at the gardens.
export const PARK_FEATURES = [
  {
    title: 'Mini zoo',
    description: 'Peacocks roam the grounds, with turtles and monkeys nearby.',
    icon: Bird,
    photo: attractionPhoto('zoo', 'A peacock fanning out its tail feathers'),
  },
  {
    title: 'The lake',
    description: 'A quiet lake at the heart of the gardens.',
    icon: Sailboat,
    photo: attractionPhoto('lake', 'A calm lake framed by green trees'),
  },
  {
    title: 'Picnic lawns',
    description: 'Shaded spots under the trees to sit and catch up.',
    icon: Trees,
    photo: attractionPhoto('picnic', 'Friends sharing a picnic on a blanket in a park'),
  },
  {
    title: 'Woodland walks',
    description: 'Winding paths made for a stroll and photos.',
    icon: Footprints,
    photo: attractionPhoto('walks', 'People strolling along a shaded path through the trees'),
  },
];

// 2 Corinthians 9:7 (NIV)
export const GIVING_VERSE = {
  text: 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.',
  reference: '2 Corinthians 9:7',
};

export const FAQS = [
  {
    question: 'Who is the hangout for?',
    answer: 'The hangout is for members of GCCC Ibadan. Each member registers with their own email address.',
  },
  {
    question: 'Does it cost anything to register?',
    answer: 'No, registering is free. Giving towards the day is optional, and every gift helps.',
  },
  {
    question: 'How many games can I play?',
    answer: 'You pick one game when you register, so choose the one you’d enjoy most. Food, drinks and the gardens are there for everyone.',
  },
  {
    question: 'Can I change my game or my details?',
    answer: 'Yes. Register again with the same email address and your registration is updated. Anything you leave empty, like your WhatsApp number or your pledge, stays as it was.',
  },
  {
    question: 'What should I wear and bring?',
    answer: 'Comfortable clothes and trainers. If you picked swimming, bring swimwear, a towel and a change of clothes. Sunscreen and a water bottle help on a warm day.',
  },
  {
    question: 'What time should I arrive?',
    answer: 'We start at 10:00 AM. Come a little early so you’re ready when the games begin.',
  },
  {
    question: 'How do I give towards the hangout?',
    answer: 'Enter the amount you’d like to give when you register, then transfer it to the account shown. Put the transfer description in your transfer so we can match it to you.',
  },
];
