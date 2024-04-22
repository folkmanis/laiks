import { Pipe, PipeTransform } from '@angular/core';
import { minutesToHours } from 'date-fns';

@Pipe({
  name: 'minutesToHours',
  standalone: true
})
export class MinutesToHoursPipe implements PipeTransform {

  transform(value: unknown): string | unknown {
    if (typeof value === 'number') {
      const hours = minutesToHours(value);
      const minutes = Math.round(value % 60);
      return (hours ? `${hours} h, ` : '') + `${minutes} min`;
    }
    return value;
  }

}
