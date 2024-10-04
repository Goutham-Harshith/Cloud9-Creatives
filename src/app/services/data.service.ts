import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public selectedTab =  new BehaviorSubject<any>('home');

  constructor() { }
}
