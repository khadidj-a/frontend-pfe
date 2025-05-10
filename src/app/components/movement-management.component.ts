// === components/movement-management.component.ts ===
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movement-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movement-management.component.html',
  styleUrls: ['./movement-management.component.scss']
})
export class MovementManagementComponent {}
