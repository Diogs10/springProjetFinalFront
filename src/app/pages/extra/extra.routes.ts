import { Routes } from '@angular/router';


// pages
import { CategorieComponent } from './categories/categories.component';

export const ExtraRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: CategorieComponent,
      },
    ],
  },
];
