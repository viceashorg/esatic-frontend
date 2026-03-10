export type Role = 'ENSEIGNANT' | 'RESP_UP' | 'CHEF_SERVICE' | 'DIRECTEUR';
export type Semestre = 'S1' | 'S2';
export type StatutSyllabus = 'BROUILLON' | 'EN_ATTENTE_UP' | 'EN_ATTENTE_CHEF' | 'EN_ATTENTE_DIRECTEUR' | 'VALIDE' | 'REJETE';
export type StatutReunion = 'PLANIFIEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';

export interface User {
  id: string; email: string; nom: string;
  prenom: string; role: Role; actif: boolean; created_at?: string;
}
export interface LoginRequest { email: string; password: string; }
export interface LoginResponse { token: string; role: Role; user: User; }

export interface Cours {
  id: string; intitule: string; code: string;
  credits: number; volume_h: number; semestre: Semestre;
  enseignant: { id: string; nom: string; prenom: string; };
  unite_pedagogique: { id: string; nom: string; };
}
export interface CreateCoursRequest {
  up_id: string; enseignant_id: string; intitule: string;
  code: string; credits: number; volume_h: number; semestre: Semestre;
}

export interface Syllabus {
  id: string; cours_id: string;
  cours?: { intitule: string; code: string; };
  contenu: string; objectifs?: string;
  statut: StatutSyllabus; created_at: string;
}
export interface CreateSyllabusRequest { cours_id: string; contenu: string; objectifs?: string; }
export interface UpdateStatutSyllabusRequest { statut: StatutSyllabus; commentaire?: string; }

export interface Progression {
  id: string; cours_id: string;
  cours?: { intitule: string; code: string; };
  taux_avancement: number; commentaire?: string; created_at: string;
}
export interface CreateProgressionRequest { cours_id: string; taux_avancement: number; commentaire?: string; }
export interface UpdateProgressionRequest { taux_avancement: number; commentaire?: string; }

export interface Participant { user_id: string; nom: string; prenom: string; present: boolean; }
export interface Reunion {
  id: string; titre: string; date_reunion: string;
  lieu?: string; ordre_du_jour?: string; statut: StatutReunion;
  organisateur: { id: string; nom: string; prenom: string; };
  participants?: Participant[];
}
export interface CreateReunionRequest { titre: string; date_reunion: string; lieu?: string; ordre_du_jour?: string; }

export interface Notification { id: string; titre: string; message: string; lu: boolean; created_at: string; }

export interface Enseignant {
  id: string; nom: string; prenom: string; email: string;
  role: Role; actif: boolean; created_at: string;
  nb_cours: number; volume_h_total: number; volume_h_restant: number;
  cours?: any[];
}
export interface EnseignantStats {
  enseignant_id: string; nb_cours: number;
  volume_h_total: number; volume_h_restant: number; volume_h_max: number;
  alerte: '' | 'ATTENTION' | 'CRITIQUE';
  taux_moyen_progression: number; nb_syllabus_valides: number; nb_reunions: number;
}
export interface CreateEnseignantRequest { email: string; nom: string; prenom: string; role?: 'ENSEIGNANT' | 'RESP_UP'; }
export interface UpdateEnseignantRequest { nom?: string; prenom?: string; actif?: boolean; }

export interface ApiList<T> { count: number; data: T[]; }
