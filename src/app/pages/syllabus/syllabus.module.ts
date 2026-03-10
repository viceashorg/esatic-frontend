import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SyllabusComponent } from './syllabus.component';

const routes: Routes = [{ path: '', component: SyllabusComponent }];

@NgModule({
  declarations: [SyllabusComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class SyllabusModule {}
