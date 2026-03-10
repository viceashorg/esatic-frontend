import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard',     icon: '📊', route: '/dashboard' },
    { label: 'Cours',         icon: '📚', route: '/cours' },
    { label: 'Syllabus',      icon: '📋', route: '/syllabus' },
    { label: 'Progressions',  icon: '📈', route: '/progressions' },
    { label: 'Réunions',      icon: '🗓️',  route: '/reunions' },
    { label: 'Notifications', icon: '🔔', route: '/notifications' },
    {
      label: 'Enseignants',
      icon: '👥',
      route: '/enseignants',
      roles: ['CHEF_SERVICE', 'DIRECTEUR']
    },
  ];

  constructor(public auth: AuthService) {}
}
