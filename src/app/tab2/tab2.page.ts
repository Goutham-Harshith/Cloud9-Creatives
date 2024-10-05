import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { APP_CONSTANTS, AppConstants } from '../../assets/constants/constant';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  priceList: AppConstants = APP_CONSTANTS;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(){
    this.route.params.subscribe((params: any) => {
      // Handle changes here, and re-initialize your component as needed
      console.log("pricing component loaded", this.priceList);
      let localData = localStorage.getItem('priceList');
      if(!localData)
      {
        localStorage.setItem("priceList", JSON.stringify(this.priceList));
      }
      else
      {
        this.priceList = JSON.parse(localData);
      }
    });
  }

  saveChanges()
  {
    localStorage.setItem("priceList", JSON.stringify(this.priceList));
  }

}
