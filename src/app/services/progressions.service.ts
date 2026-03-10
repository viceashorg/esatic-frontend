import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Progression, CreateProgressionRequest, UpdateProgressionRequest, ApiList } from '../core/models';

@Injectable({ providedIn: 'root' })
export class ProgressionsService {
  private api = `${environment.apiUrl}/progressions`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiList<Progression>> { return this.http.get<ApiList<Progression>>(this.api); }
  getById(id: string): Observable<Progression> { return this.http.get<Progression>(`${this.api}/${id}`); }
  create(p: CreateProgressionRequest): Observable<any> { return this.http.post(this.api, p); }
  update(id: string, p: UpdateProgressionRequest): Observable<any> {
    return this.http.patch(`${this.api}/${id}`, p);
  }
}
