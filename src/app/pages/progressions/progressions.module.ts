import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ProgressionsComponent } from './progressions.component';

const routes: Routes = [{ path: '', component: ProgressionsComponent }];

@NgModule({
  declarations: [ProgressionsComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)]
})
export class ProgressionsModule {}
