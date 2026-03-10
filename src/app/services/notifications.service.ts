import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Notification, ApiList } from '../core/models';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private api = `${environment.apiUrl}/notifications`;
  private countSubject = new BehaviorSubject<number>(0);
  private initialized = false;
  private readIds = new Set<string>();
  private allReadFlag = false; // true = tout a été marqué lu localement

  count$ = this.countSubject.asObservable();

  constructor(private http: HttpClient) {}

  initCount(): void {
    if (this.initialized) return;
    this.http.get<ApiList<Notification>>(this.api).subscribe({
      next: res => {
        const unread = this.allReadFlag ? 0 :
          res.data.filter(n => !n.lu && !this.readIds.has(n.id)).length;
        this.countSubject.next(unread);
        this.initialized = true;
      },
      error: () => {}
    });
  }

  getAll(unluOnly = false): Observable<ApiList<Notification>> {
    let params = new HttpParams();
    if (unluOnly) params = params.set('lu', 'false');
    return this.http.get<ApiList<Notification>>(this.api, { params }).pipe(
      map(res => ({
        ...res,
        data: res.data.map(n => ({
          ...n,
          lu: this.allReadFlag || n.lu || this.readIds.has(n.id)
        }))
      }))
    );
  }

  marquerLu(id: string): Observable<any> {
    this.readIds.add(id);
    const c = this.countSubject.value;
    if (c > 0) this.countSubject.next(c - 1);
    return this.http.patch(`${this.api}/${id}/lu`, {});
  }

  marquerToutLu(): Observable<any> {
    // Lever le flag AVANT l'appel HTTP — persiste pendant la session
    this.allReadFlag = true;
    this.countSubject.next(0);
    return this.http.patch(`${this.api}/lu-tout`, {});
    // NE PAS effacer le flag après — il doit rester actif
  }

  reset(): void {
    this.initialized = false;
    this.readIds.clear();
    this.allReadFlag = false;
    this.countSubject.next(0);
  }
}
