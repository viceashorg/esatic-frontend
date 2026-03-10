import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Notification, ApiList } from '../core/models';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private api = `${environment.apiUrl}/notifications`;
  private countSubject = new BehaviorSubject<number>(0);
  count$ = this.countSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(unluOnly = false): Observable<ApiList<Notification>> {
    let params = new HttpParams();
    if (unluOnly) params = params.set('lu', 'false');
    return this.http.get<ApiList<Notification>>(this.api, { params }).pipe(
      tap(res => this.countSubject.next(res.data.filter(n => !n.lu).length))
    );
  }

  marquerLu(id: string): Observable<any> {
    return this.http.patch(`${this.api}/${id}/lu`, {});
  }

  marquerToutLu(): Observable<any> {
    return this.http.patch(`${this.api}/lu-tout`, {}).pipe(
      tap(() => this.countSubject.next(0))
    );
  }
}
