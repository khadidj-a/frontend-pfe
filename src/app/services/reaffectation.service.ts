// === services/reaffectation.service.ts ===
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reaffectation } from '../models/reaffectation.model';

@Injectable({ providedIn: 'root' })
export class ReaffectationService {
  private apiUrl = 'http://localhost:5186/api/reaffectation';

  constructor(private http: HttpClient) {}

  getReaffectations(): Observable<Reaffectation[]> {
    return this.http.get<Reaffectation[]>(this.apiUrl);
  }

  createReaffectation(data: any): Observable<Reaffectation> {
    return this.http.post<Reaffectation>(this.apiUrl, data);
  }
}