import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CoursService } from '../../services/cours.service';
import { AuthService } from '../../services/auth.service';
import { Cours } from '../../core/models';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.scss']
})
export class CoursComponent implements OnInit {
  cours: Cours[] = [];
  showForm = false;
  loading = false;
  errorMsg = '';
  successMsg = '';
  form: FormGroup;

  constructor(
    private coursService: CoursService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      intitule:      ['', Validators.required],
      code:          ['', Validators.required],
      enseignant_id: ['', Validators.required],
      up_id:         ['', Validators.required],
      volume_h:      [null, [Validators.required, Validators.min(1), Validators.max(300)]],
      credits:       [null, [Validators.required, Validators.min(1)]],
      semestre:      ['S1', Validators.required]
    });
  }

  ngOnInit(): void { this.load(); }

  load(semestre?: string): void {
    this.loading = true;
    this.coursService.getAll(semestre).subscribe({
      next: res => { this.cours = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onSemestreChange(e: Event): void {
    const val = (e.target as HTMLSelectElement).value;
    this.load(val || undefined);
  }

  onCreate(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';
    this.coursService.create(this.form.value).subscribe({
      next: res => {
        this.loading = false;
        this.successMsg = `Cours créé avec succès — ${res.volume_h_restant_enseignant}h restantes pour l'enseignant`;
        this.form.reset({ semestre: 'S1' });
        this.showForm = false;
        this.load();
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Erreur lors de la création';
      }
    });
  }
}
