import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path:'home',
        loadComponent:() => import('./shared/video/video.component').then((c)=>c.VideoComponent)
    },
    {
        path:'**',
        redirectTo: '/home'
    }
];
