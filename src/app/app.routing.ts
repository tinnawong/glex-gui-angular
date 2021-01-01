import { Routes } from '@angular/router';

import { FullComponent } from './layouts/full/full.component';

export const AppRoutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/segment',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren:
          () => import('./additional-component/additional.module').then(m => m.MaterialComponentsModule)
      },
      {
        path: 'segment',
        loadChildren: () => import('./segment/segment.module').then(m => m.DashboardModule)
      }
    ]
  }
];
