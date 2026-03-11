import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnseignantsService } from '../../services/enseignants.service';
import { AuthService } from '../../services/auth.service';
import { Enseignant } from '../../core/models';

@Component({
  selector: 'app-enseignants',
  templateUrl: './enseignants.component.html',
  styleUrls: ['./enseignants.component.scss']
})
export class EnseignantsComponent implements OnInit {
  tous: Enseignant[] = [];
  filtres: Enseignant[] = [];
  selected: Enseignant | null = null;
  showForm = false;
  loading = false;
  errorMsg = '';
  successMsg = '';
  filtreRole = '';
  form: FormGroup;

  roles = [
    { value: '',           label: 'Tous les rôles' },
    { value: 'ENSEIGNANT', label: 'Enseignants' },
    { value: 'RESP_UP',    label: 'Responsables UP' },
    { value: 'CHEF_SERVICE', label: 'Chefs de service' }
  ];

  constructor(
    public auth: AuthService,
    private enseignantsService: EnseignantsService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nom:      ['', Validators.required],
      prenom:   ['', Validators.required],
      email:    ['', [Validators.required, Validators.email]],
      role:     ['ENSEIGNANT', Validators.required],
      specialite: [''],
      grade:    ['']
    });
  }

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.enseignantsService.getAll().subscribe({
      next: res => {
        this.tous = res.data;
        this.applyFilter();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  applyFilter(): void {
    this.filtres = this.filtreRole
      ? this.tous.filter(e => e.role === this.filtreRole)
      : [...this.tous];
  }

  onFiltreChange(role: string): void {
    this.filtreRole = role;
    this.applyFilter();
  }

  toggleActif(e: Enseignant): void {
    const newActif = !e.actif;
    this.enseignantsService.update(e.id, { actif: newActif }).subscribe({
      next: () => {
        e.actif = newActif;
        this.successMsg = `${e.prenom} ${e.nom} ${newActif ? 'activé' : 'désactivé'}`;
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: err => {
        this.errorMsg = err.error?.error || 'Erreur lors de la mise à jour';
        setTimeout(() => this.errorMsg = '', 3000);
      }
    });
  }

  openDetail(e: Enseignant): void {
    this.selected = e;
    this.enseignantsService.getById(e.id).subscribe({
      next: res => this.selected = res,
      error: () => {}
    });
  }

  closeDetail(): void { this.selected = null; }

  onCreate(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.enseignantsService.create(this.form.value).subscribe({
      next: () => {
        this.loading = false;
        this.successMsg = 'Membre du personnel créé avec succès';
        this.form.reset({ role: 'ENSEIGNANT' });
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

  getRoleLabel(role: string): string {
    const map: Record<string, string> = {
      ENSEIGNANT:    'Enseignant',
      RESP_UP:       'Resp. UP',
      CHEF_SERVICE:  'Chef de service',
      DIRECTEUR:     'Directeur'
    };
    return map[role] || role;
  }

  getRoleColor(role: string): string {
    const map: Record<string, string> = {
      ENSEIGNANT:   'blue',
      RESP_UP:      'purple',
      CHEF_SERVICE: 'orange',
      DIRECTEUR:    'navy'
    };
    return map[role] || 'grey';
  }

  getInitials(e: Enseignant): string {
    return `${e.prenom[0]}${e.nom[0]}`.toUpperCase();
  }
}
