import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReunionsService } from '../../services/reunions.service';
import { AuthService } from '../../services/auth.service';
import { Reunion, StatutReunion } from '../../core/models';

@Component({
  selector: 'app-reunions',
  templateUrl: './reunions.component.html',
  styleUrls: ['./reunions.component.scss']
})
export class ReunionsComponent implements OnInit {
  reunions: Reunion[] = [];
  selected: Reunion | null = null;
  showForm = false;
  loading = false;
  errorMsg = '';
  successMsg = '';
  form: FormGroup;
  participantUserId = '';

  constructor(
    private reunionsService: ReunionsService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      titre:          ['', Validators.required],
      date_reunion:   ['', Validators.required],
      lieu:           [''],
      ordre_du_jour:  ['']
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.reunionsService.getAll().subscribe({
      next: res => { this.reunions = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  selectReunion(r: Reunion): void {
    this.reunionsService.getById(r.id).subscribe({
      next: detail => this.selected = detail,
      error: () => {}
    });
  }

  closeDetail(): void { this.selected = null; }

  onCreate(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.reunionsService.create(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Réunion créée avec succès';
        this.form.reset();
        this.showForm = false;
        this.load();
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Erreur lors de la création';
      }
    });
  }

  updateStatut(id: string, statut: StatutReunion): void {
    this.reunionsService.updateStatut(id, statut).subscribe({
      next: () => { this.load(); this.selected = null; },
      error: err => alert(err.error?.error || 'Erreur')
    });
  }

  addParticipant(reunionId: string): void {
    if (!this.participantUserId.trim()) return;
    this.reunionsService.addParticipant(reunionId, this.participantUserId).subscribe({
      next: () => {
        this.participantUserId = '';
        this.selectReunion({ id: reunionId } as Reunion);
      },
      error: err => alert(err.error?.error || 'Erreur')
    });
  }

  marquerPresence(reunionId: string, userId: string, present: boolean): void {
    this.reunionsService.marquerPresence(reunionId, userId, present).subscribe({
      next: () => this.selectReunion({ id: reunionId } as Reunion),
      error: err => alert(err.error?.error || 'Erreur')
    });
  }

  getStatutClass(statut: string): string {
    return statut.toLowerCase().replace(/_/g, '-');
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      PLANIFIEE:  'Planifiée',
      EN_COURS:   'En cours',
      TERMINEE:   'Terminée',
      ANNULEE:    'Annulée'
    };
    return labels[statut] || statut;
  }
}
