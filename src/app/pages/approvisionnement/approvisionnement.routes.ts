import { Routes } from '@angular/router';

import { FournisseurComponent } from './fournisseurs/fournisseur.component';
import { AchatsComponent } from './achats/achats.component';
import {AddPurchaseComponent} from "./achats/add-purchase/add-purchase.component";

export const ApprovisionnementRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'fournisseurs',
        component: FournisseurComponent,
      },
      {
        path: 'achats',
        component: AchatsComponent,
      },
      {
        path: 'achat-form',
        component: AddPurchaseComponent,
      },
    ],
  },
];
