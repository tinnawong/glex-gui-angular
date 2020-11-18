import { Component, OnInit } from '@angular/core';
import { ServiceApiService } from '../../shared/service-api.service';

@Component({
  selector: 'app-word-frequency',
  templateUrl: './word-frequency.component.html',
  styleUrls: ['./word-frequency.component.css']
})
export class WordFrequencyComponent implements OnInit {

  constructor(private service: ServiceApiService) { }

  ngOnInit() {
  }

  selectFiles(enent){

  }

}
