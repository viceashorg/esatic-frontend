import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CoursService } from '../../services/cours.service';
import { SyllabusService } from '../../services/syllabus.service';
import { ProgressionsService } from '../../services/progressions.service';
import { NotificationsService } from '../../services/notifications.service';
import { EnseignantsService } from '../../services/enseignants.service';
import { User, EnseignantStats, Notification } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  myStats: EnseignantStats | null = null;
  recentNotifs: Notification[] = [];

  stats = {
    nbCours: 0,
    nbSyllabus: 0,
    tauxMoyen: 0,
    nbNotifs: 0
  };

  constructor(
    private auth: AuthService,
    private coursService: CoursService,
    private syllabusService: SyllabusService,
    private progressionsService: ProgressionsService,
    private notifService: NotificationsService,
    private enseignantsService: EnseignantsService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.getUser();

    forkJoin({
      cours:        this.coursService.getAll(),
      syllabus:     this.syllabusService.getAll(),
      progressions: this.progressionsService.getAll(),
      notifs:       this.notifService.getAll()
    }).subscribe(data => {
      this.stats.nbCours    = data.cours.count;
      this.stats.nbSyllabus = data.syllabus.count;
      this.stats.nbNotifs   = data.notifs.data.filter(n => !n.lu).length;

      if (data.progressions.count > 0) {
        const total = data.progressions.data
          .reduce((s, p) => s + p.taux_avancement, 0);
        this.stats.tauxMoyen = Math.round(total / data.progressions.count);
      }

      this.recentNotifs = data.notifs.data.slice(0, 5);
    });

    if (this.user) {
      this.enseignantsService.getStats(this.user.id).subscribe({
        next: s => this.myStats = s,
        error: () => {}
      });
    }
  }

  getVolumePercent(): number {
    if (!this.myStats) return 0;
    return Math.round((this.myStats.volume_h_total / 300) * 100);
  }
}
