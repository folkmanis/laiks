import { Expose, Transform, Type } from 'class-transformer';
import { subDays } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { NpColumn } from './np-column';
import 'reflect-metadata';

const toUTCDate = ({ value }: { value: string | number | Date }) =>
  zonedTimeToUtc(value, 'CET');

export class NpRow {
  @Expose({ name: 'Columns' })
  @Type(() => NpColumn)
  columns: NpColumn[] = [];

  @Expose({ name: 'StartTime' })
  @Transform(toUTCDate)
  startTime!: Date;

  @Expose({ name: 'EndTime' })
  @Transform(toUTCDate)
  endTime!: Date;

  @Expose({ name: 'IsExtraRow' })
  isExtraRow!: boolean;

  getNpPrices() {
    return this.columns
      .map((col) => ({
        value: col.value,
        startTime: subDays(this.startTime, col.index),
        endTime: subDays(this.endTime, col.index),
      }))
      .filter((col) => !isNaN(col.value));
  }
}
