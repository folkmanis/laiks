import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AdminGuard } from './shared/admin.guard';
import { PricesComponent } from './prices/prices.component';
import { NpUserGuard } from './shared/np-user.guard';

const routes: Routes = [
    {
        path: 'clock-offset',
        component: MainComponent,
    },
    {
        path: 'prices',
        component: PricesComponent,
        canActivate: [NpUserGuard],
    },
    {
        path: 'admin',
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
        canLoad: [AdminGuard],
    },
    {
        path: '',
        redirectTo: 'clock-offset',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'clock-offset',
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
