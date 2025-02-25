import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { AccessComponent } from './views/access/access.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'access',
        component: AccessComponent
    },
    {
        path: 'home',
        component: HomeComponent
    }
];
