import { DocumentData, DocumentSnapshot } from '@angular/fire/firestore';

export function dataOrThrow<AppModelType, DbModelType extends DocumentData>(snapshot: DocumentSnapshot<AppModelType, DbModelType>, id?: string): AppModelType {
    if (snapshot.exists() === false) {
        throw new Error(`Not found ${id || ''}`);
    }
    return snapshot.data();
}