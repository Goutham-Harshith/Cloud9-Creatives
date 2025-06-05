import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CanvasRoutingModule } from './canvas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CanvasComponent } from './canvas.component';


@NgModule({
  declarations: [CanvasComponent],
  exports: [CanvasComponent],
  imports: [
    CommonModule,
    CanvasRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class CanvasModule { }
