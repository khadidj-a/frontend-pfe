// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(): boolean {
//     // Check if the user is logged in
//     if (!this.authService.isLoggedIn()) {
//       this.router.navigate(['/login']);
//       return false;
//     }

//     // User is logged in, allow access to the route
//     return true;
//   }
// }
