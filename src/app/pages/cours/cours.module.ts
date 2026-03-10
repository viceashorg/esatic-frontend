import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CoursComponent } from './cours.component';

const routes: Routes = [{ path: '', component: CoursComponent }];

@NgModule({
  declarations: [CoursComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class CoursModule {}
