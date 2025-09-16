import { Routes } from '@angular/router';

// ui
import { ProduitComponent } from './produit/produit.component';

export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: ProduitComponent,
      },
    ],
  },
];
