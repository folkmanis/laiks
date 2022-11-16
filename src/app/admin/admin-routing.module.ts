import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppliancesComponent } from './appliances/appliances.component';
import { ApplianceEditComponent } from './appliances/appliance-edit/appliance-edit.component';
import { ApplianceGuard } from './lib/appliance.guard';
import { ApplianceResolverService } from './lib/appliance-resolver.service';

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
            canDeactivate: [ApplianceGuard],
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
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
