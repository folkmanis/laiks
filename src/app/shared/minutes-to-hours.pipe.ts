import { Pipe, PipeTransform } from '@angular/core';
import { minutesToHours } from 'date-fns';

@Pipe({
  name: 'minutesToHours'
})
export class MinutesToHoursPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): string | any {
    if (typeof value === 'number') {
      const hours = minutesToHours(value);
      const minutes = value % 60;
      return (hours ? `${hours} h, ` : '') + `${minutes} min`;
    }
    return value;
  }

}
