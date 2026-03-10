import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Syllabus, CreateSyllabusRequest, UpdateStatutSyllabusRequest, ApiList } from '../core/models';

@Injectable({ providedIn: 'root' })
export class SyllabusService {
  private api = `${environment.apiUrl}/syllabus`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiList<Syllabus>> { return this.http.get<ApiList<Syllabus>>(this.api); }
  getById(id: string): Observable<Syllabus> { return this.http.get<Syllabus>(`${this.api}/${id}`); }
  create(p: CreateSyllabusRequest): Observable<any> { return this.http.post(this.api, p); }
  updateStatut(id: string, p: UpdateStatutSyllabusRequest): Observable<any> {
    return this.http.patch(`${this.api}/${id}/statut`, p);
  }
}
