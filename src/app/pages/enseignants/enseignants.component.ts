import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnseignantsService } from '../../services/enseignants.service';
import { AuthService } from '../../services/auth.service';
import { Enseignant, EnseignantStats } from '../../core/models';

@Component({
  selector: 'app-enseignants',
  templateUrl: './enseignants.component.html',
  styleUrls: ['./enseignants.component.scss']
})
export class EnseignantsComponent implements OnInit {
  enseignants: Enseignant[] = [];
  selected: Enseignant | null = null;
  selectedStats: EnseignantStats | null = null;
  showForm = false;
  loading = false;
  errorMsg = '';
  successMsg = '';
  form: FormGroup;
  editForm: FormGroup;
  editMode = false;

  constructor(
    private enseignantsService: EnseignantsService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email:  ['', [Validators.required, Validators.email]],
      nom:    ['', Validators.required],
      prenom: ['', Validators.required],
      role:   ['ENSEIGNANT']
    });

    this.editForm = this.fb.group({
      nom:    ['', Validators.required],
      prenom: ['', Validators.required],
      actif:  [true]
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.enseignantsService.getAll().subscribe({
      next: res => { this.enseignants = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  selectEnseignant(e: Enseignant): void {
    this.editMode = false;
    this.enseignantsService.getById(e.id).subscribe({
      next: detail => {
        this.selected = detail;
        this.editForm.patchValue({
          nom:    detail.nom,
          prenom: detail.prenom,
          actif:  detail.actif
        });
      }
    });
    this.enseignantsService.getStats(e.id).subscribe({
      next: stats => this.selectedStats = stats,
      error: () => {}
    });
  }

  closeDetail(): void {
    this.selected      = null;
    this.selectedStats = null;
    this.editMode      = false;
  }

  onCreate(): void {
    if (this.form.invalid) return;
    this.loading  = true;
    this.errorMsg = '';
    this.enseignantsService.create(this.form.value).subscribe({
      next: () => {
        this.loading     = false;
        this.successMsg  = 'Enseignant créé avec succès';
        this.form.reset({ role: 'ENSEIGNANT' });
        this.showForm    = false;
        this.load();
      },
      error: err => {
        this.loading  = false;
        this.errorMsg = err.error?.error || 'Erreur lors de la création';
      }
    });
  }

  onUpdate(): void {
    if (!this.selected || this.editForm.invalid) return;
    this.enseignantsService.update(this.selected.id, this.editForm.value).subscribe({
      next: () => {
        this.successMsg = 'Profil mis à jour';
        this.editMode   = false;
        this.load();
        this.selectEnseignant(this.selected!);
      },
      error: err => {
        this.errorMsg = err.error?.error || 'Erreur mise à jour';
      }
    });
  }

  toggleActif(e: Enseignant): void {
    this.enseignantsService.update(e.id, { actif: !e.actif }).subscribe({
      next: () => this.load(),
      error: err => alert(err.error?.error || 'Erreur')
    });
  }

  getVolumePercent(e: Enseignant): number {
    return Math.round((e.volume_h_total / 300) * 100);
  }

  getVolumeColor(total: number): string {
    if (total >= 270) return '#e53935';
    if (total >= 240) return '#fb8c00';
    return '#43a047';
  }

  getAlerteClass(alerte: string): string {
    if (alerte === 'CRITIQUE')  return 'critique';
    if (alerte === 'ATTENTION') return 'attention';
    return '';
  }
}
