import { Injectable, EventEmitter, Output } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable()
export class AuthGuard implements CanActivate {



    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (Cookie.get('authtoken') !== undefined || Cookie.get('authtoken') !== '' || Cookie.get('authtoken') !== null || localStorage.getItem("userInfo") !=null) {
          if (route.data.roles && route.data.roles.indexOf(Cookie.get("role")) === -1) {
            this.router.navigate(['/']);
            return false;
          } 
          return true;
          } else { 
          this.router.navigate(['/']);
          return false;
          }
  }
}