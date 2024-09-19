import { Happ } from '@/types/Happ';
import dateUtil from './date.util';

export default function makeSection(happs: Happ[]) {
  const sections: { [key: string]: Happ[] } = {};
  happs.forEach((happ: Happ) => {
    if (happ.id) {
      const monthDate = dateUtil.getFormatDate(new Date(happ.createdAt));
      if (Array.isArray(sections[monthDate])) {
        sections[monthDate].push(happ);
      } else {
        sections[monthDate] = [happ];
      }
    }
  });
  return sections;
}
