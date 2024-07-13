import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    {
        path:'home',
        loadComponent:() => import('./shared/video/video.component').then((c)=>c.VideoComponent)
    },
    /* {
        path:'home',
        loadComponent:() => import('./pages/home/home.component').then((c)=>c.HomeComponent)
    },
    {
        path:'profile',
        loadComponent:() => import('./pages/profile/profile.component').then((c)=>c.ProfileComponent)
    },
    {
        path:'reto',
        loadComponent:() => import('./pages/challenge/challenge.component').then((c)=>c.ChallengeComponent)
    },
    {
        path:'base-de-datos',
        loadComponent:() => import('./pages/data-base/data-base.component').then((c)=>c.DataBaseComponent)
    },
    {
        path:'result',
        loadComponent:() => import('./pages/result/result.component').then((c)=>c.ResultComponent)
    }, */
    {
        path:'**',
        redirectTo: '/home'
    }
];
