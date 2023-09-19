import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberSign',
    standalone: true
})
export class NumberSignPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (typeof value !== 'number') {
      return value;
    }
    const str = value.toString();
    return value > 0 ? '+' + str : str;
  }

}
