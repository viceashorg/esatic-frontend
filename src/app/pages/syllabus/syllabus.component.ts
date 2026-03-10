import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SyllabusService } from '../../services/syllabus.service';
import { AuthService } from '../../services/auth.service';
import { Syllabus, StatutSyllabus } from '../../core/models';

@Component({
  selector: 'app-syllabus',
  templateUrl: './syllabus.component.html',
  styleUrls: ['./syllabus.component.scss']
})
export class SyllabusComponent implements OnInit {
  syllabus: Syllabus[] = [];
  showForm = false;
  loading = false;
  errorMsg = '';
  successMsg = '';
  form: FormGroup;

  constructor(
    private syllabusService: SyllabusService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      cours_id:  ['', Validators.required],
      contenu:   ['', Validators.required],
      objectifs: ['']
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.syllabusService.getAll().subscribe({
      next: res => { this.syllabus = res.data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  onCreate(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.successMsg = '';
    this.syllabusService.create(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Syllabus créé avec succès';
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

  updateStatut(id: string, statut: StatutSyllabus): void {
    this.syllabusService.updateStatut(id, { statut }).subscribe({
      next: () => this.load(),
      error: err => alert(err.error?.error || 'Erreur')
    });
  }

  canReject(s: Syllabus): boolean {
    return ['EN_ATTENTE_UP', 'EN_ATTENTE_CHEF', 'EN_ATTENTE_DIRECTEUR'].includes(s.statut);
  }

  getStatutClass(statut: string): string {
    return statut.toLowerCase().replace(/_/g, '-');
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      BROUILLON:              'Brouillon',
      EN_ATTENTE_UP:          'En attente UP',
      EN_ATTENTE_CHEF:        'En attente Chef',
      EN_ATTENTE_DIRECTEUR:   'En attente Directeur',
      VALIDE:                 'Validé',
      REJETE:                 'Rejeté'
    };
    return labels[statut] || statut;
  }
}
