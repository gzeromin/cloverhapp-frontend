import { computed, makeObservable, observable, action } from 'mobx';
import merge from 'deepmerge';

import labelEn from '@public/locales/en/label.json';
import messageEn from '@public/locales/en/message.json';
import labelKr from '@public/locales/kr/label.json';
import messageKr from '@public/locales/kr/message.json';
import labelJp from '@public/locales/jp/label.json';
import messageJp from '@public/locales/jp/message.json';
import { dancingScript, singleDay, slacksideOne } from '@/styles/fonts';
import { Locale } from '@/types/User';
import { BUCKET_URL } from '@/utils/api.util';

const kr = merge(labelKr, messageKr) as any;
const en = merge(labelEn, messageEn) as any;
const jp = merge(labelJp, messageJp) as any;

class language {
  flagKr = BUCKET_URL + '/public/flags/south-korea.png';
  flagEn = BUCKET_URL + '/public/flags/united-states.png';
  flagJp = BUCKET_URL + '/public/flags/japan.png';

  type: Locale = Locale.Kr;

  constructor() {
    makeObservable(this, {
      type: observable,
      flag: computed,
      $t: computed,
      logoFont: computed,
      setLanguage: action,
    });
  }

  setLanguage = (type: Locale) => {
    this.type = type;
  };

  get flag() {
    switch (this.type) {
    case Locale.Kr:
      return this.flagKr;
    case Locale.Jp:
      return this.flagJp;
    case Locale.En:
      return this.flagEn;
    default:
      return this.flagKr;
    }
  }

  get $t() {
    switch (this.type) {
    case Locale.Kr:
      return kr;
    case Locale.Jp:
      return jp;
    case Locale.En:
      return en;
    default:
      return kr;
    }
  }

  get logoFont() {
    switch (this.type) {
    case Locale.Kr:
      return singleDay.className;
    case Locale.Jp:
      return slacksideOne.className;
    case Locale.En:
      return dancingScript.className;
    default:
      return singleDay.className;
    }
  }
}

export default language;
