import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  constructor(private route: ActivatedRoute) {}

  ngOnInit(){
    this.route.params.subscribe((params: any) => {
      // Handle changes here, and re-initialize your component as needed
      console.log("formula component loaded", params)
    });
  }

}
