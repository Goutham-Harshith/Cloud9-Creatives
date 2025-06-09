import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaperRoutingModule } from './paper-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PaperBagComponent } from './paper-bag.component';


@NgModule({
  declarations: [PaperBagComponent],
  exports: [PaperBagComponent],
  imports: [
    CommonModule,
    PaperRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class PaperModule { }
