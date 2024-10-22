import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from './explore-container.component';
import { ExploreRoutingModule } from './explore-container-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, ExploreRoutingModule, ReactiveFormsModule],
  declarations: [ExploreContainerComponent],
  exports: [ExploreContainerComponent]
})
export class ExploreContainerComponentModule {}
