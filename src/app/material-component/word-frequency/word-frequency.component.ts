import { Component, OnInit } from '@angular/core';
import { ServiceApiService } from '../../shared/service-api.service';
import Swal from "sweetalert2"
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-word-frequency',
  templateUrl: './word-frequency.component.html',
  styleUrls: ['./word-frequency.component.css']
})
export class WordFrequencyComponent implements OnInit {

  constructor(private service: ServiceApiService, private http: HttpClient) { }

  ngOnInit() {
    this.service.pingMainServer_()
    this.service.pingGlexServer_()
  }
  selectedFiles: FileList = null;
  selectFiles(event) {
    this.selectedFiles = event.target.files;
  }
  uploadFiles() {
    if (this.selectedFiles.length > 0) {
      const formData: FormData = new FormData();
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('files', this.selectedFiles[i]);
      }
      formData.append('fileType', this.service.wordFrequency.current.fileType);
      formData.append('segmentLibrary', this.service.wordFrequency.current.segmentLibrary);
      formData.append('glexDict', this.service.wordFrequency.current.glexDict);

      this.http.post(this.service.urlglexMainService + "npltools/frequency", formData, {
      }).subscribe(data => {

      });
    } else {
      console.log("file emty")
    }

  }

}
