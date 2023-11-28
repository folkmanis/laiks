import { IncomingMessage } from 'node:http';
import { get } from 'node:https';
import * as logger from 'firebase-functions/logger';

export async function getNpData(url: URL): Promise<string> {
    const req: IncomingMessage = await new Promise((resolve) =>
        get(url, resolve).end(),
    );
    const data = await retrieveData(req);

    logger.log(`Retrieved from nordpool ${data.length} bytes of data`);

    return data;
}

function retrieveData(message: IncomingMessage): Promise<string> {
    return new Promise((resolve) => {
        let xml = '';
        message.on('data', (chunk) => (xml += chunk));
        message.on('end', () => resolve(xml));
    });
}
