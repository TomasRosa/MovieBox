import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  constructor (private routerService: Router){}

  ngOnInit(): void {
    setTimeout (()=>{
      this.routerService.navigate (['/inicio'])
    }, 2500)    
  }
}
