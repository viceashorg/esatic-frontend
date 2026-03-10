import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProgressionsService } from '../../services/progressions.service';
import { AuthService } from '../../services/auth.service';
import { Progression } from '../../core/models';

@Component({
  selector: 'app-progressions',
  templateUrl: './progressions.component.html',
  styleUrls: ['./progressions.component.scss']
})
export class ProgressionsComponent implements OnInit {
  progressions: Progression[] = [];
  showForm = false;
  editId: string | null = null;
  loading = false;
  errorMsg = '';
  successMsg = '';
  form: FormGroup;
  editForm: FormGroup;

  constructor(
    private progressionsService: ProgressionsService,
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

  onCreate(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';
    this.progressionsService.create(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Progression enregistrée avec succès';
        this.form.reset({ taux_avancement: 0 });
        this.showForm = false;
        this.load();
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Erreur lors de la création';
      }
    });
  }

  startEdit(p: Progression): void {
    this.editId = p.id;
    this.editForm.patchValue({
      taux_avancement: p.taux_avancement,
      commentaire:     p.commentaire || ''
    });
  }

  cancelEdit(): void {
    this.editId = null;
    this.editForm.reset();
  }

  onUpdate(id: string): void {
    if (this.editForm.invalid) return;
    this.progressionsService.update(id, this.editForm.value).subscribe({
      next: () => {
        this.editId = null;
        this.successMsg = 'Progression mise à jour';
        this.load();
      },
      error: err => {
        this.errorMsg = err.error?.error || 'Erreur mise à jour';
      }
    });
  }

  getColor(taux: number): string {
    if (taux >= 100) return '#43a047';
    if (taux >= 50)  return '#fb8c00';
    return '#e53935';
  }
}
