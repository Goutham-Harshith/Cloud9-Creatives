import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  pricingForm: any = undefined;

  ngOnInit() {
    this.initAllForms();
   }

  initAllForms() {
    // Initialize the form
    this.pricingForm = this.fb.group({
      width: ['10', Validators.required],
      height: ['6', Validators.required],
      gusset: ['5', Validators.required],
      branding: [false],
      zip: ['zip', Validators.required],
      color: ['white', Validators.required],
      quality: ['14x15', Validators.required],
      handle: ['whiteRope', Validators.required],
      print: ['single', Validators.required],
    });

  }

  onCanvasSubmit()
  {
    console.log("Pricing form : ", this.pricingForm.value)
  }

}
