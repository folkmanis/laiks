import { MarketZone } from "./dto/market-zone";
import { NpData } from './dto/np-data';
import { getNpData } from "./get-np-data";
import { plainToInstance } from 'class-transformer';
import * as logger from 'firebase-functions/logger';

export async function getNpPrices(zone: MarketZone): Promise<NpData> {
    const data = await getNpData(new URL(zone.url));

    const prices = plainToInstance(NpData, JSON.parse(data).data, {
        excludeExtraneousValues: true,
    });

    logger.log(`Parsed ${prices.getNpPrices().length} price records`);

    return prices;
}
