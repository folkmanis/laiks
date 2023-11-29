import { Expose, Transform } from 'class-transformer';
import 'reflect-metadata';

export class NpColumn {
  @Expose({ name: 'Value' })
  @Transform(({ value }) => Number.parseFloat(value.replace(',', '.')))
  value!: number;

  @Expose({ name: 'Index' })
  index!: number;
}
