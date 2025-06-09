import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { JuteComponent } from './jute.component';
import { JuteRoutingModule } from './jute-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, JuteRoutingModule, ReactiveFormsModule],
  declarations: [JuteComponent],
  exports: [JuteComponent]
})
export class JuteModule {}
