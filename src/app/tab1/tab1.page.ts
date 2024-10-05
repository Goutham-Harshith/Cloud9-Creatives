import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  constructor(private route: ActivatedRoute) {}

  ngOnInit(){
    this.route.params.subscribe((params: any) => {
      // Handle changes here, and re-initialize your component as needed
      console.log("home component loaded", params)
    });
  }

}
