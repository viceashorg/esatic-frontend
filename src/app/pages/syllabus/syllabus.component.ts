import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { SyllabusService } from '../../services/syllabus.service';
import { CoursService } from '../../services/cours.service';
import { AuthService } from '../../services/auth.service';
import { Syllabus, Cours, StatutSyllabus } from '../../core/models';

@Component({
  selector: 'app-syllabus',
  templateUrl: './syllabus.component.html',
  styleUrls: ['./syllabus.component.scss']
})
export class SyllabusComponent implements OnInit {
  syllabus: Syllabus[] = [];
  coursList: Cours[] = [];  // cours disponibles pour le select
  showForm = false;
  loading = false;
  loadingCours = false;
  errorMsg = '';
  successMsg = '';
  form: FormGroup;

  constructor(
    private syllabusService: SyllabusService,
    private coursService: CoursService,
    public auth: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      cours_id:                 ['', Validators.required],
      objectifs:                ['', Validators.required],
      competences:              ['', Validators.required],
      contenu:                  ['', Validators.required],
      modalites_evaluation:     ['', Validators.required],
      references_bibliographiques: ['']
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

  openForm(): void {
    this.showForm = true;
    this.loadingCours = true;
    this.coursService.getAll().subscribe({
      next: res => {
        // Exclure les cours qui ont déjà un syllabus
        const coursAvecSyllabus = new Set(this.syllabus.map(s => s.cours_id));
        this.coursList = res.data.filter(c => !coursAvecSyllabus.has(c.id));
        this.loadingCours = false;
      },
      error: () => { this.loadingCours = false; }
    });
  }

  cancelForm(): void {
    this.showForm = false;
    this.form.reset();
    this.errorMsg = '';
  }

  onCreate(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    this.syllabusService.create(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Syllabus créé avec succès';
        this.form.reset();
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

  updateStatut(id: string, statut: StatutSyllabus): void {
    this.syllabusService.updateStatut(id, { statut }).subscribe({
      next: () => this.load(),
      error: err => alert(err.error?.error || 'Erreur')
    });
  }

  canValidate(s: Syllabus): boolean {
    const role = this.auth.getUser()?.role;
    if (role === 'RESP_UP'       && s.statut === 'EN_ATTENTE_UP')        return true;
    if (role === 'CHEF_SERVICE'  && s.statut === 'EN_ATTENTE_CHEF')      return true;
    if (role === 'DIRECTEUR'     && s.statut === 'EN_ATTENTE_DIRECTEUR') return true;
    return false;
  }

  canReject(s: Syllabus): boolean {
    return this.canValidate(s);
  }

  getNextStatut(s: Syllabus): StatutSyllabus {
    const map: Record<string, StatutSyllabus> = {
      'BROUILLON':             'EN_ATTENTE_UP',
      'EN_ATTENTE_UP':         'EN_ATTENTE_CHEF',
      'EN_ATTENTE_CHEF':       'EN_ATTENTE_DIRECTEUR',
      'EN_ATTENTE_DIRECTEUR':  'VALIDE'
    };
    return map[s.statut] || 'VALIDE';
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      BROUILLON:              'Brouillon',
      EN_ATTENTE_UP:          'En attente RUP',
      EN_ATTENTE_CHEF:        'En attente Chef',
      EN_ATTENTE_DIRECTEUR:   'En attente Directeur',
      VALIDE:                 'Validé',
      REJETE:                 'Rejeté'
    };
    return labels[statut] || statut;
  }

  getStatutColor(statut: string): string {
    const colors: Record<string, string> = {
      BROUILLON:              'grey',
      EN_ATTENTE_UP:          'orange',
      EN_ATTENTE_CHEF:        'orange',
      EN_ATTENTE_DIRECTEUR:   'blue',
      VALIDE:                 'green',
      REJETE:                 'red'
    };
    return colors[statut] || 'grey';
  }
}
