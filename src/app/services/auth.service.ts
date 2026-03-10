import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationsService } from './notifications.service';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, User, Role } from '../core/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = environment.apiUrl;
  private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private notifService: NotificationsService) {}

  login(payload: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/auth/login`, payload).pipe(
      tap(res => {
        localStorage.setItem('esatic_token', res.token);
        localStorage.setItem('esatic_user', JSON.stringify(res.user));
        this.userSubject.next(res.user);
        setTimeout(() => this.notifService.initCount(), 100);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.api}/auth/logout`, {}).subscribe();
    localStorage.clear();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean { return !!localStorage.getItem('esatic_token'); }
  getToken(): string | null { return localStorage.getItem('esatic_token'); }
  getUser(): User | null { return this.userSubject.value; }
  getRole(): Role | null { return this.getUser()?.role ?? null; }

  hasRole(roles: string[]): boolean {
    const role = this.getRole();
    return role ? roles.includes(role) : false;
  }

  hasMinRole(minRole: Role): boolean {
    const hierarchy: Role[] = ['ENSEIGNANT', 'RESP_UP', 'CHEF_SERVICE', 'DIRECTEUR'];
    const userIdx = hierarchy.indexOf(this.getRole()!);
    const minIdx  = hierarchy.indexOf(minRole);
    return userIdx >= minIdx;
  }

  private getStoredUser(): User | null {
    try { return JSON.parse(localStorage.getItem('esatic_user') || 'null'); }
    catch { return null; }
  }
}

