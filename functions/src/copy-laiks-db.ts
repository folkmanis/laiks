import { getFirestore } from 'firebase-admin/firestore';
import { onRequest } from 'firebase-functions/v2/https';
import {
  getNpZone,
  getNpZoneByDbName,
  setNpZone,
} from './scraper/np-zone-utilities';
import { pricesCollection, pricesDocument } from './scraper/update-np-data';
import * as logger from 'firebase-functions/logger';
import { Response, Request } from 'firebase-functions';

export const onCopyLaiksDbRequest = onRequest(
  {
    region: 'europe-west1',
  },
  async (request: Request, response: Response) => {
    logger.log('npData collection name change requested');

    try {
      const result = await copyLaiksDb(
        request.query['zoneId'],
        request.query['newDbName']
      );

      response.status(200).json(result);
    } catch (error) {
      logger.error(error);
      const { message } = error as Error;
      response.status(400).json({ error: message });
    }
  }
);

export async function copyLaiksDb(
  zoneId: string | unknown,
  newDbName: string | unknown
) {
  assertIsString(zoneId, 'zoneId');
  assertIsString(newDbName, 'newDbName');
  await checkIfDbNameAwailable(newDbName);

  const sourceZone = await getNpZone(zoneId);

  assertIsDefined(sourceZone, 'sourceZone');

  logger.log(
    `For zone ${zoneId} renaming ${sourceZone.dbName} -> ${newDbName}`
  );

  const sourceDocument = await pricesDocument(sourceZone.dbName).get();
  const sourceData = await pricesCollection(sourceZone.dbName).get();

  const batch = getFirestore().batch();

  const targetCollectionRef = pricesCollection(newDbName);
  sourceData.docs.forEach((doc) => {
    const docData = doc.data();
    const targetDocRef = targetCollectionRef.doc(doc.id);
    batch.set(targetDocRef, docData);
    batch.delete(doc.ref);
  });

  batch.set(pricesDocument(newDbName), sourceDocument.data());

  batch.delete(sourceDocument.ref);

  const result = await batch.commit();

  await setNpZone(zoneId, { dbName: newDbName });

  logger.log(`Zone ${zoneId} updated. Moved ${result.length} records.`);

  return {
    documents_count: result.length,
  };
}

async function checkIfDbNameAwailable(dbName: string) {
  const existingZone = await getNpZoneByDbName(dbName);
  if (existingZone !== undefined) {
    throw new Error(
      `${dbName} already occupied by zone ${existingZone.description}`
    );
  }
}

function assertIsString(
  val: unknown,
  message: string = 'val'
): asserts val is string {
  if (typeof val !== 'string') {
    throw new Error(
      `Expected '${message}' to be defined, but received '${val}'`
    );
  }
}

function assertIsDefined<T>(
  val: T,
  message: string = 'val'
): asserts val is NonNullable<T> {
  if (val === undefined || val === null) {
    throw new Error(
      `Expected '${message}' to be defined, but received '${val}'`
    );
  }
}
