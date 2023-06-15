import { Injectable, inject } from '@angular/core';
import { DocumentReference, Firestore, doc, docData } from '@angular/fire/firestore';
import { Observable, map, of, switchMap } from 'rxjs';
import { DEFAULT_PERMISSIONS, Permissions } from './permissions';
import { UserService } from './user.service';

const PERMISSIONS = 'permissions';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  private userService = inject(UserService);
  private firestore = inject(Firestore);

  isAdmin(): Observable<boolean> {
    return this.getPermissions().pipe(
      map(data => !!data?.admin)
    );
  }

  isNpAllowed(): Observable<boolean> {
    return this.getPermissions().pipe(
      map(data => !!data?.npUser)
    );
  }

  getPermissions(): Observable<Permissions> {
    return this.userService.getUser().pipe(
      switchMap(user => this.permissionData(user?.uid)),
    );

  }

  private permissionData(id: string | undefined): Observable<Permissions> {

    if (!id) {
      return of(DEFAULT_PERMISSIONS);
    }

    const docRef = doc(this.firestore, PERMISSIONS, id) as DocumentReference<Permissions>;
    return docData(docRef).pipe(
      map(data => data || DEFAULT_PERMISSIONS)
    );
  }

}
