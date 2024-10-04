import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-formula',
  standalone: true, // Declare this component as standalone
  templateUrl: './formula.component.html',
  styleUrls: ['./formula.component.scss'],
})
export class FormulaComponent  implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    // Subscribe to route params or query params if necessary
    this.route.params.subscribe(params => {
      // Handle changes here, and re-initialize your component as needed
      console.log("Formula component loaded")
    });
  }

}