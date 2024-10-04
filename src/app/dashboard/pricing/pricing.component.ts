import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pricing',
  standalone: true, // Declare this component as standalone
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent  implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {

    // Subscribe to route params or query params if necessary
    this.route.params.subscribe(params => {
      // Handle changes here, and re-initialize your component as needed
      console.log("Pricing component loaded")
    });

  }

}
