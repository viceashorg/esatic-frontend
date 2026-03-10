import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EnseignantsComponent } from './enseignants.component';

const routes: Routes = [{ path: '', component: EnseignantsComponent }];

@NgModule({
  declarations: [EnseignantsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class EnseignantsModule {}
