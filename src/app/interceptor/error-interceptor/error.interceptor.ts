import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError} from "rxjs";
import {inject} from "@angular/core";
import {Router} from "@angular/router";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  let router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log("error", error)
      let err = error.error;
      console.log("err", err)
      if (error.status == 401 && error.statusText == "Unauthorized") {
        localStorage.clear();
        router.navigateByUrl('/auth');
      }
      if (error.status == 400) {
        err = {
          message : err['errors'] ? parseErrors(err['errors']) : err['error'] 
        };
      }

      if (!err.message) {
        err = {
          message: error.message,
          status: false,
          data: []
        }
        console.log("error ee", err)
      }
      throw (err);
    })
  );
};

function parseErrors(errors: any): string {
  let errorMessage = '';
  for (const key in errors) {
    if (errors.hasOwnProperty(key)) {
      const errorList = errors[key];
      errorMessage += errorList.join('. ') + '. ';
    }
  }
  return errorMessage.trim();
}
