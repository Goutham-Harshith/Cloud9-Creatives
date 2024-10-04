import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { PricingComponent } from './pricing/pricing.component';
import { FormulaComponent } from './formula/formula.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    PricingComponent,
    FormulaComponent
  ],
  declarations: [DashboardPage],
  exports: [],
})
export class DashboardPageModule {}

