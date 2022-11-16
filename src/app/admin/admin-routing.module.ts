import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppliancesComponent } from './appliances/appliances.component';
import { ApplianceEditComponent } from './appliances/appliance-edit/appliance-edit.component';
import { ApplianceGuard } from './lib/appliance.guard';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserResolverService } from './lib/user-resolver.service';
import { UserEditComponent } from './users/user-edit/user-edit.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'appliances',
        children: [
          {
            path: 'list',
            component: AppliancesComponent,
          },
          {
            path: ':id',
            component: ApplianceEditComponent,
            canDeactivate: [ApplianceGuard]
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
