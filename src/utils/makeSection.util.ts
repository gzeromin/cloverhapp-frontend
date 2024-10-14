import { Happ } from '@/types/Happ';
import DateUtils from './date.util';

export default function makeSection(happs: Happ[]) {
  const sections: { [key: string]: Happ[] } = {};
  happs.forEach((happ: Happ) => {
    if (happ.id) {
      const monthDate = DateUtils.getFormatDate(new Date(happ.startTime));
      if (Array.isArray(sections[monthDate])) {
        sections[monthDate].push(happ);
      } else {
        sections[monthDate] = [happ];
      }
    }
  });
  return sections;
}
