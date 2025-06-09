import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JuteComponent } from './jute.component';

const routes: Routes = [
  {
    path: '',
    component: JuteComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuteRoutingModule {}
