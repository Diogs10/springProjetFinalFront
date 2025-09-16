import { Injectable } from '@angular/core';
import Swal, {SweetAlertOptions} from "sweetalert2";

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  showAlert(title : string, text : string, icon : string = 'success'): Promise<any> {
    // @ts-ignore
    return Swal.fire({
      title: title,
      text: text,
      icon: icon
    });
  }

  // Fonction pour afficher une boîte de dialogue de confirmation personnalisée
  showConfirmation(title: string, text: string): Promise<any> {
    const confirmationOptions: SweetAlertOptions = {
      title: title,
      text: text,
      //icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui",
      cancelButtonText: 'Non'
    };
    return this.showAlert(title, text, "success");
  }

  timerAlert(options: SweetAlertOptions): Promise<any> {
    return Swal.fire(options)
  }
}
