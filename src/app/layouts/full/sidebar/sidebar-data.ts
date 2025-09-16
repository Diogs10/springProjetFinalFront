import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Dashboard',
  },
  {
    displayName: 'Tableau de bord',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  },
  {
    navCap: 'Ventes et produits',
    divider: true
  },
  {
    displayName: 'Categories',
    iconName: 'solar:planet-3-line-duotone',
    route: '/categories',
  },
  {
    displayName: 'Produits',
    iconName: 'solar:archive-minimalistic-line-duotone',
    route: '/produits',
  },
  // {
  //   displayName: 'Ventes',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/ventes-produits/ventes',
  // },
  // {
  //   displayName: 'Chips',
  //   iconName: 'solar:danger-circle-line-duotone',
  //   route: '/ventes-produits/chips',
  // },
  // {
  //   displayName: 'Lists',
  //   iconName: 'solar:bookmark-square-minimalistic-line-duotone',
  //   route: '/ventes-produits/lists',
  // },
  // {
  //   displayName: 'Tooltips',
  //   iconName: 'solar:text-field-focus-line-duotone',
  //   route: '/ventes-produits/tooltips',
  // },
  // {
  //   displayName: 'Forms',
  //   iconName: 'solar:file-text-line-duotone',
  //   route: '/ventes-produits/forms',
  // },
  // {
  //   displayName: 'Tables',
  //   iconName: 'solar:tablet-line-duotone',
  //   route: '/ventes-produits/tables',
  // },
  // {
  //   navCap: 'Achat et Approvisionnemt',
  //   divider: true
  // },
  // {
  //   displayName: 'Fournisseurs',
  //   iconName: 'solar:login-3-line-duotone',
  //   route: '/approvisionnement/fournisseurs',
  // },
  // {
  //   displayName: 'Achats',
  //   iconName: 'solar:bookmark-square-minimalistic-line-duotone',
  //   route: '/approvisionnement/achats',
  // },
  // {
  //   navCap: 'Paramètrages',
  //   divider: true
  // },
  // {
  //   displayName: 'Utilisateurs',
  //   iconName: 'solar:sticker-smile-circle-2-line-duotone',
  //   route: '/settings/users',
  // },
  // {
  //   displayName: 'Categories',
  //   iconName: 'solar:planet-3-line-duotone',
  //   route: '/settings/categories',
  // },
  // {
  //   displayName: 'Marques',
  //   iconName: 'solar:bookmark-square-minimalistic-line-duotone',
  //   route: '/settings/marques',
  // },
  // {
  //   displayName: 'Modèles',
  //   iconName: 'solar:tablet-line-duotone',
  //   route: '/settings/modeles',
  // },
  // {
  //   displayName: 'Puretés',
  //   iconName: 'solar:tablet-line-duotone',
  //   route: '/settings/purete',
  // },

];
