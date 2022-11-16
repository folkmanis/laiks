import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppliancesListComponent } from './appliances/appliances-list/appliances-list.component';
import { ApplianceEditComponent } from './appliances/appliance-edit/appliance-edit.component';
import { ApplianceResolverService } from './lib/appliance-resolver.service';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserResolverService } from './lib/user-resolver.service';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { CanDeactivateGuard } from 'src/app/shared/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'appliances',
        children: [
          {
            path: 'list',
            component: AppliancesListComponent,
          },
          {
            path: ':id',
            component: ApplianceEditComponent,
            canDeactivate: [CanDeactivateGuard],
            resolve: {
              appliance: ApplianceResolverService,
            }
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          }
        ]
      },
      {
        path: 'users',
        children: [
          {
            path: 'list',
            component: UsersListComponent,
          },
          {
            path: ':id',
            component: UserEditComponent,
            resolve: {
              user: UserResolverService,
            },
            canDeactivate: [CanDeactivateGuard],
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          }
        ]
      },
      {
        path: 'users',
        children: [
          {
            path: 'list',
            component: UsersListComponent,
          },
          {
            path: ':id',
            component: UserEditComponent,
            resolve: {
              user: UserResolverService,
            }
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
