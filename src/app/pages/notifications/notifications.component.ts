import { Component, OnInit } from '@angular/core';
import { NotificationsService } from '../../services/notifications.service';
import { Notification } from '../../core/models';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  filterUnread = false;
  loading = false;

  get unreadCount(): number {
    return this.notifications.filter(n => !n.lu).length;
  }

  constructor(public notifService: NotificationsService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.notifService.getAll(this.filterUnread).subscribe({
      next: res => { this.notifications = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  toggleFilter(): void {
    this.filterUnread = !this.filterUnread;
    this.load();
  }

  markRead(n: Notification): void {
    if (n.lu) return;
    n.lu = true;
    this.notifService.marquerLu(n.id).subscribe();
  }

  markAllRead(): void {
    this.notifications.forEach(n => n.lu = true);
    this.notifService.marquerToutLu().subscribe();
  }

  getTimeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours   = Math.floor(diff / 3600000);
    const days    = Math.floor(diff / 86400000);
    if (minutes < 1)  return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24)   return `Il y a ${hours}h`;
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  }
}
