import { WriteResult, getFirestore } from 'firebase-admin/firestore';
import { logger } from 'firebase-functions/v2';
import { HttpsError } from 'firebase-functions/v2/https';
import { getNpZone, setNpZone } from './scraper/np-zone-utilities';
import {
  pricesCollection,
  pricesDocument,
} from './scraper/prices-collection-ref';
import { assertIsDefined } from './utils/assertions';

export async function renameLaiksDb(zoneId: string, newDbName: string) {
  const sourceZone = await getNpZone(zoneId);

  assertIsDefined(sourceZone, 'sourceZone');

  logger.log(
    `For zone ${zoneId} renaming ${sourceZone.dbName} -> ${newDbName}`
  );

  const result = await movePricesCollection(sourceZone.dbName, newDbName);

  await setNpZone(zoneId, { dbName: newDbName });

  logger.log(`Zone ${zoneId} updated. Moved ${result.length} records.`);

  return {
    documents_count: result.length,
  };
}

export async function movePricesCollection(
  oldName: string,
  newName: string
): Promise<WriteResult[]> {
  await checkIfDbNameAwailable(newName);

  const sourceDocument = await pricesDocument(oldName).get();
  const sourceData = await pricesCollection(oldName).get();

  const batch = getFirestore().batch();

  const targetCollectionRef = pricesCollection(newName);
  sourceData.docs.forEach((doc) => {
    const docData = doc.data();
    const targetDocRef = targetCollectionRef.doc(doc.id);
    batch.set(targetDocRef, docData);
    batch.delete(doc.ref);
  });

  batch.set(pricesDocument(newName), sourceDocument.data());

  batch.delete(sourceDocument.ref);

  return batch.commit();
}

export async function checkIfDbNameAwailable(dbName: string) {
  const document = await pricesDocument(dbName).get();

  if (document.exists) {
    throw new HttpsError('already-exists', `${dbName} already occupied`);
  }
}
