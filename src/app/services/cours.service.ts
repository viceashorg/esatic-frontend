import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cours, CreateCoursRequest, ApiList } from '../core/models';

@Injectable({ providedIn: 'root' })
export class CoursService {
  private api = `${environment.apiUrl}/cours`;
  constructor(private http: HttpClient) {}

  getAll(semestre?: string): Observable<ApiList<Cours>> {
    let params = new HttpParams();
    if (semestre) params = params.set('semestre', semestre);
    return this.http.get<ApiList<Cours>>(this.api, { params });
  }

  getById(id: string): Observable<Cours> {
    return this.http.get<Cours>(`${this.api}/${id}`);
  }

  create(payload: CreateCoursRequest): Observable<any> {
    return this.http.post<any>(this.api, payload);
  }
}
