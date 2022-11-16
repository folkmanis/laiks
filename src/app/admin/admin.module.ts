import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AppliancesComponent } from './appliances/appliances.component';
import { ApplianceEditComponent } from './appliances/appliance-edit/appliance-edit.component';
import { PowerCyclesComponent } from './appliances/appliance-edit/power-cycles/power-cycles.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';


@NgModule({
  declarations: [
    AppliancesComponent,
    ApplianceEditComponent,
    PowerCyclesComponent,
    UsersListComponent,
    UserEditComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }