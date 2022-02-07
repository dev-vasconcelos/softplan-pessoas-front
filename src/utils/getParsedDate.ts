import dayjs from 'dayjs';

export default function getParsedDate(date: string): Date {
  const day = date.split('/')[0];
  const month = date.split('/')[1];
  const year = date.split('/')[2];

  return dayjs(`${month}/${day}/${year}`).toDate();
}
