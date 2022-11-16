import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AppliancesListComponent } from './appliances/appliances-list/appliances-list.component';
import { ApplianceEditComponent } from './appliances/appliance-edit/appliance-edit.component';
import { PowerCyclesComponent } from './appliances/appliance-edit/power-cycles/power-cycles.component';
import { UsersListComponent } from './users/users-list/users-list.component';
import { UserEditComponent } from './users/user-edit/user-edit.component';
import { AdminRemoveConfirmationComponent } from './users/admin-remove-confirmation/admin-remove-confirmation.component';


@NgModule({
  declarations: [
    AppliancesListComponent,
    ApplianceEditComponent,
    PowerCyclesComponent,
    UsersListComponent,
    UserEditComponent,
    AdminRemoveConfirmationComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }
