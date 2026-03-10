import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Enseignant, EnseignantStats, CreateEnseignantRequest, UpdateEnseignantRequest, ApiList } from '../core/models';

@Injectable({ providedIn: 'root' })
export class EnseignantsService {
  private api = `${environment.apiUrl}/enseignants`;
  constructor(private http: HttpClient) {}

  getAll(upId?: string, actif?: boolean): Observable<ApiList<Enseignant>> {
    let params = new HttpParams();
    if (upId !== undefined) params = params.set('up_id', upId);
    if (actif !== undefined) params = params.set('actif', String(actif));
    return this.http.get<ApiList<Enseignant>>(this.api, { params });
  }

  getById(id: string): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.api}/${id}`);
  }
  getStats(id: string): Observable<EnseignantStats> {
    return this.http.get<EnseignantStats>(`${this.api}/${id}/stats`);
  }
  create(p: CreateEnseignantRequest): Observable<any> {
    return this.http.post(this.api, p);
  }
  update(id: string, p: UpdateEnseignantRequest): Observable<any> {
    return this.http.patch(`${this.api}/${id}`, p);
  }
}
