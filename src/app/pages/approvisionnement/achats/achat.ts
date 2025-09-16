import {Produit} from "../../ui-components/produit/produit";
import {Fournisseur} from "../fournisseurs/fournisseur";

export interface Achat {

  id : number | string;
  achats : {produits : Produit, prix_achat : number}[],
  fournisseur : Fournisseur,
}
