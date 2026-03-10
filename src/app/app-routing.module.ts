import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'cours',
        loadChildren: () => import('./pages/cours/cours.module').then(m => m.CoursModule)
      },
      {
        path: 'syllabus',
        loadChildren: () => import('./pages/syllabus/syllabus.module').then(m => m.SyllabusModule)
      },
      {
        path: 'progressions',
        loadChildren: () => import('./pages/progressions/progressions.module').then(m => m.ProgressionsModule)
      },
      {
        path: 'reunions',
        loadChildren: () => import('./pages/reunions/reunions.module').then(m => m.ReunionsModule)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsModule)
      },
      {
        path: 'enseignants',
        canActivate: [AuthGuard],
        data: { roles: ['CHEF_SERVICE', 'DIRECTEUR'] },
        loadChildren: () => import('./pages/enseignants/enseignants.module').then(m => m.EnseignantsModule)
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
