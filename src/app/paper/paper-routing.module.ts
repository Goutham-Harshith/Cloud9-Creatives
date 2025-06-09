import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaperBagComponent } from './paper-bag.component';

const routes: Routes = [
    {
      path: '',
      component: PaperBagComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaperRoutingModule { }
