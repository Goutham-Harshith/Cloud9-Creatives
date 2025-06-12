import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CottonRoutingModule } from './cotton-routing.module';
import { CottonComponent } from './cotton.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [CottonComponent],
  exports: [CottonComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CottonRoutingModule
  ]
})
export class CottonModule { }
