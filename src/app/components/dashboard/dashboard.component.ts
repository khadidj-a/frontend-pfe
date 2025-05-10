import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  isAdminIT: boolean = false; 

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    const userRole = this.authService.getUserRole();
    this.isAdminIT = userRole === 'Admin IT'; 
  }

  logout(): void {
    this.authService.logout();
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  navigateToUserManagement(): void {
    this.router.navigate(['/user-management']);
  }
}
