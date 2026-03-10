import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NotificationsService } from '../../../services/notifications.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: User | null = null;
  notifCount$ = this.notifService.count$;

  constructor(
    private auth: AuthService,
    private notifService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();
    this.notifService.getAll(true).subscribe();
  }

  logout(): void { this.auth.logout(); }
}
