import { Component, OnInit } from '@angular/core';
import { interval  } from 'rxjs';
import { data } from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class AppHeaderComponent implements OnInit  {


	datetime:any

	ngOnInit(): void {
    //show data time
    interval(1000).subscribe(x => {
      this.datetime = Date.now()
    });
  
    }
  
}
