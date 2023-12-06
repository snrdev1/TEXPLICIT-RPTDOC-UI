import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'dateAgo',
  pure: true,
})
export class DateAgoPipe implements PipeTransform {
  private readonly intervals: [string, number][] = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
    ['second', 1],
  ];

  transform(value: any, args?: any): any {
    if (value) {
      const now = new Date();
      const givenDate = new Date(value);
      const seconds = Math.floor((now.getTime() - givenDate.getTime()) / 1000);

      if (seconds < 30) {
        return 'Just now';
      }

      for (const [unit, interval] of this.intervals) {
        const counter = Math.floor(seconds / interval);
        if (counter > 0) {
          const plural = counter !== 1 ? 's' : '';
          return `${counter} ${unit}${plural} ago`;
        }
      }
    }
    return value;
  }
}
