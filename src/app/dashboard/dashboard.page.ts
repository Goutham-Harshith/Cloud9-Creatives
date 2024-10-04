import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  constructor(private route: ActivatedRoute) {
    
  }

  ngOnInit() {

    // Subscribe to route params or query params if necessary
    this.route.params.subscribe(params => {
      // Handle changes here, and re-initialize your component as needed
      console.log("dashboard component loaded")
    });

  }

}
