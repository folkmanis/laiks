import { throwIfNull } from '@shared/utils';
import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  onSnapshot,
  Query,
  QuerySnapshot,
} from 'firebase/firestore';
import { from, map, mergeMap, Observable, toArray } from 'rxjs';

export function collectionData<
  T extends DocumentData,
  U extends string = never,
>(
  query: Query<T>,
  options: { idField?: (U | keyof T) & keyof NonNullable<T> } = {},
): Observable<((T & { [T in U]: string }) | NonNullable<T>)[]> {
  return new Observable<QuerySnapshot<T>>((subscriber) =>
    onSnapshot(query, { includeMetadataChanges: true }, subscriber),
  ).pipe(
    map((snapshot: QuerySnapshot<T>) => snapshot.docs),
    mergeMap((docs) =>
      from(docs).pipe(
        map((snapshot) => snapshotToData(snapshot, options)),
        throwIfNull(),
        toArray(),
      ),
    ),
  );
}

export function docData<T extends DocumentData, R extends T = T>(
  ref: DocumentReference<T>,
  options: {
    idField?: keyof R;
  } = {},
): Observable<T | R | undefined> {
  return new Observable<DocumentSnapshot<T>>((subscriber) =>
    onSnapshot(ref, subscriber),
  ).pipe(map((snapshot) => snapshotToData(snapshot, options)));
}

function snapshotToData<T extends DocumentData, R extends T = T>(
  snapshot: DocumentSnapshot<T>,
  options: { idField?: keyof R } = {},
): T | R | undefined {
  const data = snapshot.data();

  if (
    snapshot.exists() &&
    options.idField &&
    typeof data === 'object' &&
    data !== null
  ) {
    return {
      ...data,
      [options.idField]: snapshot.id,
    };
  } else {
    return data;
  }
}
