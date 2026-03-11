import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgressionsService } from '../../services/progressions.service';
import { CoursService } from '../../services/cours.service';
import { AuthService } from '../../services/auth.service';
import { Progression, Cours } from '../../core/models';

@Component({
  selector: 'app-progressions',
  templateUrl: './progressions.component.html',
  styleUrls: ['./progressions.component.scss']
})
export class ProgressionsComponent implements OnInit {
  progressions: Progression[] = [];
  coursList: Cours[] = [];
  showForm = false;
  editId: string | null = null;
  loading = false;
  loadingCours = false;
  errorMsg = '';
  successMsg = '';
  form: FormGroup;
  editForm: FormGroup;

  constructor(
    private progressionsService: ProgressionsService,
    private coursService: CoursService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      cours_id:        ['', Validators.required],
      taux_avancement: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      commentaire:     ['']
    });
    this.editForm = this.fb.group({
      taux_avancement: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      commentaire:     ['']
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.progressionsService.getAll().subscribe({
      next: res => { this.progressions = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.loadingCours = true;
    this.coursService.getAll().subscribe({
      next: res => { this.coursList = res.data; this.loadingCours = false; },
      error: () => { this.loadingCours = false; }
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.form.reset({ taux_avancement: 0 });
    this.errorMsg = '';
  }

  onCreate(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.progressionsService.create(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Progression enregistrée';
        this.form.reset({ taux_avancement: 0 });
        this.showForm = false;
        this.load();
        setTimeout(() => this.successMsg = '', 4000);
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Erreur lors de la création';
      }
    });
  }

  startEdit(p: Progression): void {
    this.editId = p.id;
    this.editForm.patchValue({ taux_avancement: p.taux_avancement, commentaire: p.commentaire || '' });
  }

  cancelEdit(): void { this.editId = null; }

  onUpdate(id: string): void {
    if (this.editForm.invalid) return;
    this.progressionsService.update(id, this.editForm.value).subscribe({
      next: () => { this.editId = null; this.successMsg = 'Progression mise à jour'; this.load(); },
      error: err => { this.errorMsg = err.error?.error || 'Erreur mise à jour'; }
    });
  }

  getColor(taux: number): string {
    if (taux >= 100) return 'var(--success)';
    if (taux >= 50)  return 'var(--warning)';
    return 'var(--danger)';
  }

  getLabel(taux: number): string {
    if (taux >= 100) return 'Terminé';
    if (taux >= 75)  return 'Avancé';
    if (taux >= 50)  return 'En cours';
    if (taux > 0)    return 'Débuté';
    return 'Non commencé';
  }
}
