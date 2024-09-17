import { 
  Dancing_Script,
  Inconsolata,
  Kiwi_Maru,
  Poor_Story,
  M_PLUS_1p,
  Noto_Sans,
  Noto_Sans_KR,
  Single_Day,
  Noto_Sans_JP,
  Slackside_One,
} from 'next/font/google';

// en font
const dancingScript = Dancing_Script({ subsets: ['latin']});
const inconsolata = Inconsolata({ subsets: ['latin']});
const kiwiMaru = Kiwi_Maru({ weight: '400', subsets: ['latin'] });
const poorStory = Poor_Story({ weight: '400', subsets: ['latin'] });
const mPLUS1p = M_PLUS_1p({ weight: '400', subsets: ['latin'] });
const notoSans = Noto_Sans({ subsets: ['latin']});

// kr font
const notoSansKR = Noto_Sans_KR({ subsets: ['latin']});
const singleDay = Single_Day({ weight: '400' });

// jp font
const notoSansJP = Noto_Sans_JP({ subsets: ['latin']});
const slacksideOne = Slackside_One({ weight: '400', subsets: ['latin'] });

 
export { 
  dancingScript,
  inconsolata,
  kiwiMaru,
  poorStory,
  mPLUS1p,
  notoSans,
  notoSansKR,
  singleDay,
  notoSansJP,
  slacksideOne,
};