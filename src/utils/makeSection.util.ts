import { Stamp } from '@/types/Stamp';
import dateUtil from './date.util';

export default function makeSection(stamps: Stamp[]) {
  const sections: { [key: string]: Stamp[] } = {};
  stamps.forEach((stamp: Stamp) => {
    if (stamp.id) {
      const monthDate = dateUtil.getFormatDate(new Date(stamp.createdAt));
      if (Array.isArray(sections[monthDate])) {
        sections[monthDate].push(stamp);
      } else {
        sections[monthDate] = [stamp];
      }
    }
  });
  return sections;
}
