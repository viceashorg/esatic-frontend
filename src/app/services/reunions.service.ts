import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Reunion, CreateReunionRequest, ApiList } from '../core/models';

@Injectable({ providedIn: 'root' })
export class ReunionsService {
  private api = `${environment.apiUrl}/reunions`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiList<Reunion>> { return this.http.get<ApiList<Reunion>>(this.api); }
  getById(id: string): Observable<Reunion> { return this.http.get<Reunion>(`${this.api}/${id}`); }
  create(p: CreateReunionRequest): Observable<any> { return this.http.post(this.api, p); }
  updateStatut(id: string, statut: string): Observable<any> {
    return this.http.patch(`${this.api}/${id}/statut`, { statut });
  }
  addParticipant(id: string, userId: string): Observable<any> {
    return this.http.post(`${this.api}/${id}/participants`, { user_id: userId });
  }
  marquerPresence(id: string, userId: string, present: boolean): Observable<any> {
    return this.http.patch(`${this.api}/${id}/presence`, { user_id: userId, present });
  }
}
