import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'flagBit',
})
export class FlagBitPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): string {
    const n = value ? (value as number) : 0;
    let bit = 1;
    for (let i = 0; i < 32; i++) {
      if ((bit & n) !== 0) {
        return `${i + 1}`;
      }
      bit <<= 1;
    }
    return '';
  }
}
