import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
})
export class ExploreContainerComponent implements OnInit {

  selectedTab : string = 'paper';
  pricingForm: any = undefined;
  priceList: any;
  isPriceValid : boolean = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedTab = params['tab'];
      console.log('User ID:', this.selectedTab);
    });

    // Initialize the form
    this.pricingForm = this.fb.group({
      width: ['10', Validators.required],
      height: ['6', Validators.required],
      gusset: ['5', Validators.required],
      branding: [false, Validators.required],
      zip: [true, Validators.required],
      color: ['white', Validators.required],
      quality: ['14x15', Validators.required],
      handle: ['whiteRope', Validators.required],
      print: ['single', Validators.required],
    });

    let localPriceList :any = localStorage.getItem('priceList')
    this.priceList = JSON.parse(localPriceList);
    let keys= Object.keys(this.priceList);
    console.log("keys : ", keys)
    // keys.forEach((key)=>
    // {
      
    // })

  }

  onSubmit()
  {
    console.log("form submitted : ", this.pricingForm.value);
  }

}
