import { Component, OnInit } from '@angular/core';
import { ServiceApiService } from '../../shared/service-api.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private service: ServiceApiService) { }


  ngOnInit() {
    
  }

  open(event){
    console.log(event)
    event.preventDefault();
    
  }

}
