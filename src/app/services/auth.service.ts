import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5186/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; motpasse: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const roleClaimKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

    if (roleClaimKey in user) {
      return user[roleClaimKey];
    }

    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'Admin IT';
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}