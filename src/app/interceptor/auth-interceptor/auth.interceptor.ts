import { inject } from '@angular/core';
import {HttpInterceptorFn} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/pages/authentication/services/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const routeWithoutAuthorization = ['/login','/register','/password_reset'];
  for (let index = 0; index < routeWithoutAuthorization.length; index++) {
    const route = routeWithoutAuthorization[index];
    if(req.url === `${environment.baseURL}${route}`){
      return next(req);
    }

  }
  const auth = inject(AuthService);
  const authToken = auth.getToken();
  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
