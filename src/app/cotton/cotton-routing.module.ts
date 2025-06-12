import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CottonComponent } from './cotton.component';

const routes: Routes = [
    {
      path: '',
      component: CottonComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CottonRoutingModule { }
