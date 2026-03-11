import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { CoursService } from '../../services/cours.service';
import { EnseignantsService } from '../../services/enseignants.service';
import { AuthService } from '../../services/auth.service';
import { Cours, Enseignant, UnitePedagogique } from '../../core/models';

@Component({
  selector: 'app-cours',
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.scss']
})
export class CoursComponent implements OnInit {
  cours: Cours[] = [];
  enseignants: Enseignant[] = [];
  unitesPedagogiques: UnitePedagogique[] = [];
  showForm = false;
  loading = false;
  loadingSelects = false;
  errorMsg = '';
  successMsg = '';
  form: FormGroup;

  niveaux = [
    { value: 'LICENCE', label: 'Licence' },
    { value: 'MASTER',  label: 'Master'  }
  ];
  semestres = [
    { value: 'S1', label: 'Semestre 1' },
    { value: 'S2', label: 'Semestre 2' }
  ];

  constructor(
    private coursService: CoursService,
    private enseignantsService: EnseignantsService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      intitule:      ['', Validators.required],
      code:          ['', Validators.required],
      enseignant_id: ['', Validators.required],
      up_id:         ['', Validators.required],
      niveau:        ['LICENCE', Validators.required],
      filiere:       ['', Validators.required],
      volume_h:      [null, [Validators.required, Validators.min(1), Validators.max(300)]],
      credits:       [null, [Validators.required, Validators.min(1)]],
      semestre:      ['S1', Validators.required]
    });
  }

  ngOnInit(): void { this.load(); }

  load(semestre?: string): void {
    this.loading = true;
    this.coursService.getAll(semestre).subscribe({
      next: res => {
        this.cours = res.data;
        // Extraire les UPs uniques depuis les cours chargés
        const map = new Map<string, UnitePedagogique>();
        res.data.forEach(c => {
          if (c.unite_pedagogique?.id && !map.has(c.unite_pedagogique.id)) {
            map.set(c.unite_pedagogique.id, c.unite_pedagogique);
          }
        });
        this.unitesPedagogiques = Array.from(map.values());
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  openForm(): void {
    this.showForm = true;
    this.loadingSelects = true;
    this.enseignantsService.getAll().subscribe({
      next: res => {
        this.enseignants = res.data.filter(e => e.actif);
        this.loadingSelects = false;
      },
      error: () => { this.loadingSelects = false; }
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
        this.successMsg = `Cours créé avec succès`;
        this.form.reset({ semestre: 'S1', niveau: 'LICENCE' });
        this.showForm = false;
        this.load();
      },
      error: err => {
        this.loading = false;
        this.errorMsg = err.error?.error || 'Erreur lors de la création';
      }
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.form.reset({ semestre: 'S1', niveau: 'LICENCE' });
    this.errorMsg = '';
  }

  getEnseignantLabel(e: Enseignant): string {
    return `${e.prenom} ${e.nom}`;
  }
}
