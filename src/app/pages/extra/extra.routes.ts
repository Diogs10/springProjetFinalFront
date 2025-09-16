import { Routes } from '@angular/router';


// pages
import { UsersComponent } from './users/users.component';
import { CategorieComponent } from './categories/categories.component';
import { MarqueComponent } from './marque/marque.component';
import { PureteComponent } from './purete/purete.component';
import { ModeleComponent } from './modele/modele.component';

export const ExtraRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'users',
        component: UsersComponent,
      },
      {
        path: 'categories',
        component: CategorieComponent,
      },
      {
        path:'marques',
        component: MarqueComponent
      },
      {
        path:'modeles',
        component: ModeleComponent
      },
      {
        path:'purete',
        component: PureteComponent
      },
    ],
  },
];
