import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';

const routes: Routes = [
    {
        path: 'clock-offset',
        component: MainComponent,
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
