import * as logger from 'firebase-functions/logger';
import { IncomingMessage } from 'node:http';
import { get } from 'node:https';
import { plainToInstance } from 'class-transformer';
import { NpData } from './dto/np-data';

export async function retrieveNpData(zoneUrlStr: string): Promise<NpData> {
  logger.info(`Retrieving from ${zoneUrlStr}`);

  const url = new URL(zoneUrlStr);

  const req: IncomingMessage = await new Promise((resolve) =>
    get(url, resolve).end()
  );
  const data = await retrieveData(req);

  logger.log(`Retrieved from ${url} ${data.length} bytes of data`);

  const npData = plainToInstance(NpData, JSON.parse(data).data, {
    excludeExtraneousValues: true,
  });

  logger.log(`Parsed ${npData.getNpPrices().length} price records`);

  return npData;
}

function retrieveData(message: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let data = '';
    message.on('data', (chunk) => (data += chunk));
    message.on('end', () => resolve(data));
  });
}
