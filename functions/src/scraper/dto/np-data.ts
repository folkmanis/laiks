import { Type, Expose } from 'class-transformer';
import { NpRow } from './np-row';
import { NpPrice } from './np-price';
import { subDays } from 'date-fns';

export class NpData {

    @Expose({ name: 'Rows' })
    @Type(() => NpRow)
    rows: NpRow[] = [];

    private cache: NpPrice[] | null = null;

    getNpPrices(): NpPrice[] {
        if (!this.cache) {
            const prices: NpPrice[] = [];
            for (const row of this.rows) {
                if (!row.isExtraRow) prices.push(...row.getNpPrices());
            }
            this.cache = prices;
        }
        return this.cache;
    }

    average(days: number): number {
        const prices = this.lastDaysPrices(days);
        if (prices.length === 0) {
            return 0;
        }
        const sum = prices.reduce((acc, curr) => acc + curr.value, 0);
        return sum / prices.length;
    }

    lastDaysPrices(days: number): NpPrice[] {
        const startDate = subDays(this.lastDate, days);
        return this.getNpPrices().filter(price => price.startTime > startDate);
    }

    stDev(days: number) {
        const prices = this.lastDaysPrices(days);
        if (prices.length < 2) {
            return 0;
        }
        const average = this.average(days);
        const sum = prices.reduce((acc, curr) => acc + Math.pow(curr.value - average, 2), 0);
        return Math.sqrt(sum / prices.length);
    }

    private get lastDate(): Date {
        let lastDate = new Date(0);
        for (const price of this.getNpPrices()) {
            if (price.startTime > lastDate) {
                lastDate = price.startTime;
            }
        }
        return lastDate;
    }


}
