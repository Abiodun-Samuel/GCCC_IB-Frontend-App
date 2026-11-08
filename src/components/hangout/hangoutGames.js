import { Bike, Crosshair, Dices, Gamepad2, Target, WavesLadder } from 'lucide-react';
import { BowlingPinIcon, HorseshoeIcon, PaddleIcon, TrampolineIcon } from './gameIcons';

/*
 * The hangout games. To add, change or remove a game, edit this list.
 *
 * `name` must match a name in the backend's config/hangout.php `games` list:
 * the backend decides which games can be picked and stores the name with each
 * registration. A game the backend lists but this file doesn't still shows,
 * with a plain icon tile; a game here that the backend doesn't list is hidden.
 *
 *   slug         used in image paths and element ids
 *   tagline      one line on the game card
 *   description  the opening paragraph in the game's "More about" window
 *   expect       short, practical points for the day
 *   icon         a lucide-react icon, or one from ./gameIcons
 *   cover        3:2 photo for the card: public<path>-{480,800,1200}.{webp,jpg}
 *   photos       more photos for the window, shown at their own shape
 *   video        a YouTube video (id from the watch URL), shown in the window
 *
 * Photos: Pexels (free to use, pexels.com/license) and Wikimedia Commons
 * (CC BY-SA 4.0, credited where they are shown). Videos are embedded from
 * YouTube; each was checked as public and embeddable.
 */

const COVER = { width: 1200, height: 800, widths: [480, 800, 1200] };
const cover = (slug, alt, credit = null) => ({ path: `/images/hangout/games/${slug}`, alt, credit, ...COVER });

const PEXELS = { source: 'Pexels' };
const commons = (author, file) => ({
  source: 'Wikimedia Commons',
  author,
  license: 'CC BY-SA 4.0',
  licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
  url: `https://commons.wikimedia.org/wiki/File:${file}`,
});
const photo = (name, alt, width, height, credit, widths = [640, 1200]) => ({
  path: `/images/hangout/gallery/${name}`, alt, width, height, widths, credit,
});

export const HANGOUT_GAMES = [
  {
    name: 'Paintball',
    slug: 'paintball',
    tagline: 'Pick a side and battle it out in the arena.',
    description: 'Two teams, one arena and a lot of paint. Take cover behind the bunkers, work with your team and tag the other side before they tag you.',
    expect: [
      'Paintball is played in a mask and protective gear.',
      'A hit stings for a moment, so long sleeves and trousers are a good idea.',
      'Wear clothes you don’t mind getting paint on.',
    ],
    icon: Crosshair,
    cover: cover('paintball', 'Paintball players in masks and padded gear on a paintball field'),
    photos: [
      photo('paintball-1', 'Two paintball teams gathered on an outdoor field with inflatable bunkers', 1200, 900, PEXELS),
      photo('paintball-2', 'A paintball player in camouflage taking aim from behind a stack of tyres', 1200, 900, PEXELS),
    ],
    video: { id: 'jMMdQDbzcac', title: 'Paintballing in Lagos for the first time', channel: 'Lade Ibikunle' },
  },
  {
    name: 'Archery',
    slug: 'archery',
    tagline: 'Draw, aim and chase the bullseye.',
    description: 'Step up to the line, draw the bow and see how close you can get to the centre. It’s calmer than it looks, and very satisfying when an arrow lands.',
    expect: [
      'Bows and arrows are provided at the target range.',
      'No experience needed. Stand side-on to the target and keep your bow arm relaxed.',
      'Tie back long hair and avoid loose sleeves on your bow arm.',
    ],
    icon: Target,
    cover: cover('archery', 'An archer drawing a bow towards a row of round targets'),
    photos: [
      photo('archery-1', 'An archer pulling arrows out of a target after a round', 1200, 801, PEXELS),
      photo('archery-2', 'An archer in a blue top drawing a bow on an outdoor range', 1200, 801, PEXELS),
    ],
    video: { id: 'nnRkhd6DTE0', title: 'Taking an archery class at Lekki Archers Club', channel: 'Deola Adebiyi' },
  },
  {
    name: 'Horse Riding',
    slug: 'horse-riding',
    tagline: 'A guided ride on horseback through the park.',
    description: 'Climb into the saddle for a guided ride through the gardens. The handlers lead the horse, so all you need to do is sit tall and enjoy the view.',
    expect: [
      'Rides are guided, so first-time riders are welcome.',
      'Wear closed shoes and comfortable trousers.',
      'Rides are short, so there’s time left for everything else.',
    ],
    icon: HorseshoeIcon,
    cover: cover('horse-riding', 'A rider on horseback crossing a golden field'),
    photos: [
      photo('horse-riding-1', 'Two women on horseback on a Nigerian beach', 1200, 2134, commons('Elizfred', 'Horse_riding_at_the_beach.jpg')),
      photo('horse-riding-2', 'A rider on a horse at Eleko Beach, Lagos', 1200, 900, commons('JayMisra', 'Horse_Rider@Eleko_Beach,_Lagos.jpg')),
    ],
    video: { id: 'RuW61210-Hg', title: 'Horse riding gaining traction among Lagos youth', channel: 'CGTN Africa' },
  },
  {
    name: 'Swimming & Water Slides',
    slug: 'swimming',
    tagline: 'Cool off in the pools and slides.',
    description: 'Spend your game time in the water. Swim a few lengths, race your friends or take the slides down into the pool.',
    expect: [
      'Bring swimwear, a towel and a change of clothes.',
      'A waterproof pouch keeps your phone dry.',
      'Only swim where you can stand if you’re not a confident swimmer.',
    ],
    icon: WavesLadder,
    cover: cover('swimming', 'A smiling man relaxing in an outdoor swimming pool'),
    photos: [
      photo('swimming-1', 'A colourful water play structure with slides over a pool', 1200, 1600, PEXELS),
      photo('swimming-2', 'Friends swimming and playing together in a pool in Nigeria', 640, 586, commons('Yufifalato722', 'Swimming_1.jpg'), [640]),
    ],
    video: { id: 'prqWIxiFXqQ', title: 'Five swimming pools where you can swim in Ibadan', channel: 'Password TV' },
  },
  {
    name: 'Bowling',
    slug: 'bowling',
    tagline: 'Roll for a strike and keep score.',
    description: 'Line up, roll and watch the pins fall. Bowling is easy to pick up, and the friendly rivalry over the scores is half the fun.',
    expect: [
      'It’s casual bowling, so nobody needs to be good at it.',
      'Take turns in small groups and keep score together.',
      'Pick a ball you can swing comfortably rather than the heaviest one.',
    ],
    icon: BowlingPinIcon,
    cover: cover('bowling', 'Bowling pins standing at the end of a lane with a ball beside them'),
    photos: [
      photo('bowling-1', 'A bowler mid-throw, sending a ball down the lane', 1200, 801, PEXELS),
      photo('bowling-2', 'Four friends holding bowling balls at a bowling alley', 1200, 1798, PEXELS),
    ],
    video: { id: '1jQsQvpoxy0', title: 'I went bowling in Lagos', channel: 'Dise Buseri' },
  },
  {
    name: 'Trampoline & Bouncing Castle',
    slug: 'trampoline',
    tagline: 'Bounce as high as you dare.',
    description: 'Jump zones for every age and every level of bravery. Bounce, flip if you can, and laugh at whoever tries the hardest.',
    expect: [
      'One or two people per trampoline at a time keeps everyone safe.',
      'Empty your pockets before you jump.',
      'Wear socks or go barefoot, as the jump zone asks.',
    ],
    icon: TrampolineIcon,
    cover: cover('trampoline', 'A girl jumping on an enclosed garden trampoline'),
    photos: [
      photo('trampoline-1', 'A man jumping high on a garden trampoline while a friend watches', 1200, 800, PEXELS),
      photo('trampoline-2', 'Friends jumping together on a round trampoline', 1200, 800, PEXELS),
    ],
    video: { id: 'FBdCJ7319z0', title: 'The biggest trampoline park in West Africa', channel: 'The Fisayo' },
  },
  {
    name: 'Bicycle Riding',
    slug: 'bicycle',
    tagline: 'Ride the shaded paths around the gardens.',
    description: 'Take a bike and explore the 150 acres of Agodi Gardens at your own pace, past the lawns, the lake and the trees.',
    expect: [
      'Bikes are available to rent at the gardens.',
      'Ride at an easy pace and look out for people walking.',
      'Trainers and comfortable clothes work best.',
    ],
    icon: Bike,
    cover: cover('bicycle', 'A family riding bicycles along a tree-lined path'),
    photos: [
      photo('bicycle-1', 'Two friends cycling side by side along a path at sunset', 1200, 1800, PEXELS),
      photo('bicycle-2', 'Two girls helping each other learn to ride a bicycle in Nigeria', 1200, 1596, commons('Biggiepopa', 'Riding_bicycle.jpg')),
    ],
    video: { id: '1NP3cBvG09M', title: 'I spent a day at Agodi Gardens, Ibadan', channel: 'Westwinger' },
  },
  {
    name: 'Table Tennis & Badminton',
    slug: 'table-tennis',
    tagline: 'Fast rallies with a paddle or a racquet.',
    description: 'Quick reflexes and friendly trash talk. Play table tennis across the net, or swap to a racquet and keep the shuttlecock in the air.',
    expect: [
      'Play singles or doubles, and swap partners between games.',
      'Doubles is a fun way to play with friends.',
      'Trainers help you move quickly.',
    ],
    icon: PaddleIcon,
    cover: cover('table-tennis', 'Two table tennis paddles and a ball on a green table by the net'),
    photos: [
      photo('table-tennis-1', 'People playing table tennis at a social event in Nigeria', 1200, 1600, commons('Tochiprecious', 'Table_Tennis_Game.jpg')),
      photo('table-tennis-2', 'A young man leaping to smash a shuttlecock', 1200, 1797, PEXELS),
    ],
    video: { id: '7SGTfRPpXU0', title: 'A 41-shot rally: Nigeria v Singapore, Commonwealth Games 2014', channel: 'Itsrayz' },
  },
  {
    name: 'VR Games',
    slug: 'vr',
    tagline: 'Put on a headset and step into another world.',
    description: 'Put on a virtual reality headset and play your way through digital worlds: racing, flying, dodging and more, all without leaving the gardens.',
    expect: [
      'Give yourself a little space to move around while you play.',
      'If you wear glasses, most headsets fit over them.',
      'Take a break if you feel dizzy. It passes quickly.',
    ],
    icon: Gamepad2,
    cover: cover('vr', 'Two people playing a game in virtual reality headsets'),
    photos: [
      photo('vr-1', 'Senior citizens trying virtual reality headsets together in Nigeria', 640, 479, commons('Oby Ezeilo', 'Members_Of_Senior_Citizens_For_Wiki_Loves_Africa_1.jpg'), [640]),
      photo('vr-2', 'A two-seat virtual reality ride at a play park in Onitsha', 1200, 1600, commons('Confidence24', 'VR_Motion_Simulator_at_Family_Play_Park,_Onitsha.jpg')),
    ],
    video: { id: 'ldn1pl-FyDw', title: 'Regular Nigerians try VR for the first time', channel: 'Techpoint Africa' },
  },
  {
    name: 'Board Games',
    slug: 'board-games',
    tagline: 'Classic table and board games at a slower pace.',
    description: 'Pull up a seat at the games tables for a slower kind of competition. Plan your moves, outthink your friends and claim the bragging rights.',
    expect: [
      'There’s an arena of classic table and board games to choose from.',
      'A good pick if you’d rather stay cool and seated.',
      'Bring your competitive spirit.',
    ],
    icon: Dices,
    cover: cover('board-games', 'Three girls in traditional attire playing Ayo on the grass', commons('Dotun55', 'Girls_playing_ayo.jpg')),
    photos: [
      photo('board-games-1', 'Two men playing Ludo at a wooden table', 1200, 1313, commons('K2Prince', 'Men_playing_ludo.jpg')),
      photo('board-games-2', 'A three-player game of Scrabble in progress', 1200, 900, commons('dotun55 from Nigeria', 'Scrabble_game_of_three.jpg')),
    ],
    video: { id: '21JTI7_a9Bk', title: 'How to play Ayo', channel: 'City of Surrey' },
  },
];
