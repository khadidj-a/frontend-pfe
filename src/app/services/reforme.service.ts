// === services/reforme.service.ts ===
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reforme } from '../models/reforme.model';

@Injectable({ providedIn: 'root' })
export class ReformeService {
  private apiUrl = 'http://localhost:5186/api/Reforme';

  constructor(private http: HttpClient) {}

  getReformes(): Observable<Reforme[]> {
    return this.http.get<Reforme[]>(this.apiUrl);
  }

  createReforme(data: any): Observable<Reforme> {
    return this.http.post<Reforme>(this.apiUrl, data);
  }
}