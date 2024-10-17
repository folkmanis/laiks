import { formatISO } from 'date-fns';
import * as logger from 'firebase-functions/logger';
import { IncomingMessage } from 'node:http';
import { get } from 'node:https';
import { NpJson } from './dto/np-json.interface';
import { NpPrice } from './dto/np-price';

const NP_BASE_URL =
  'https://dataportal-api.nordpoolgroup.com/api/DayAheadPrices';

export async function retrieveNpData(
  date: Date,
  zones: string[],
  params: { currency: string } = { currency: 'EUR' },
): Promise<Record<string, NpPrice[]>> {
  logger.info(`Retrieving zones ${zones} for date ${formatISO(date)}`);

  const url = new URL(getScrapeUrl(date, zones, params));

  const req: IncomingMessage = await new Promise((resolve) =>
    get(url, resolve).end(),
  );
  const data = await retrieveData(req);

  logger.log(`Retrieved from ${url} ${data.length} bytes of data`);

  return parseNpJson(data);
}

function retrieveData(message: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    message.on('data', (chunk) => (data += chunk));
    message.on('end', () => resolve(data));
  });
}

export function parseNpJson(data: string): Record<string, NpPrice[]> {
  const zoneData: Record<string, NpPrice[]> = {};

  const { deliveryAreas, multiAreaEntries }: NpJson = JSON.parse(data);

  deliveryAreas.forEach((zone) => {
    zoneData[zone] = multiAreaEntries
      .filter(({ entryPerArea }) => typeof entryPerArea !== 'undefined')
      .map(({ entryPerArea, deliveryStart, deliveryEnd }) => ({
        value: entryPerArea[zone],
        startTime: new Date(deliveryStart),
        endTime: new Date(deliveryEnd),
      }));
  });

  logger.log(
    `Parsed ${multiAreaEntries.length} price records for zones ${deliveryAreas}`,
  );

  return zoneData;
}

export function getScrapeUrl(
  date: Date,
  zones: string[],
  params: { currency: string },
): string {
  return `${NP_BASE_URL}?date=${formatISO(date, { representation: 'date' })}&market=DayAhead&deliveryArea=${zones.join(',')}&currency=${params.currency}`;
}
