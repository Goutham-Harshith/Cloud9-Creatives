import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';
import { PricingComponent } from './pricing/pricing.component';
import { FormulaComponent } from './formula/formula.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: DashboardPage
  },
  {
    path: 'pricing',
    component: PricingComponent
  },
  {
    path: 'formula',
    component: FormulaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
