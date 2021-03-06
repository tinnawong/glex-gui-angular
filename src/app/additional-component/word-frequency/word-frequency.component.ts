import { Component, OnInit } from '@angular/core';
import { ServiceApiService } from '../../shared/service-api.service';
import Swal from "sweetalert2"
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

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
    if (!this.service.wordFrequency.statusWaitRespone) {
      if (this.selectedFiles.length > 0) {
        // change status
        this.service.wordFrequency.statusWaitRespone = true

        const formData: FormData = new FormData();
        for (let i = 0; i < this.selectedFiles.length; i++) {
          formData.append('files', this.selectedFiles[i]);
        }
        formData.append('corpusName', this.service.wordFrequency.corpusName);
        formData.append('fileType', this.service.wordFrequency.current.fileType);
        formData.append('typeOutput', this.service.wordFrequency.current.typeOutput);
        formData.append('librarySegment', this.service.wordFrequency.current.segmentLibrary);
        formData.append('glexDict', this.service.wordFrequency.current.glexDict);

        this.http.post(this.service.urlglexMainService + "nlptools/frequency", formData, {
        }).subscribe(data => {
          this.service.wordFrequency.statusWaitRespone = false
          if (data["results"].length > 0) {
            this.service.wordFrequency.resultFile = data["results"]
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Successfully',
              showConfirmButton: false,
              timer: 1500,
            })
          }
          else {
            Swal.fire({
              icon: "error",
              title: "Error!",
              text: "No file for download",
              confirmButtonText: "OK"
            })
          }
        }, err => {
          this.service.wordFrequency.statusWaitRespone = false
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: err.status + ":" + err.statusText,
            confirmButtonText: "OK"
          })
        });
      } else {
        Swal.fire({
          icon: 'info',
          title: "Please choose file",
          text: "Please choose your files befor upload",
          confirmButtonText: "OK"
        })
      }
    } else {
      Swal.fire({
        icon: 'info',
        title: "Please wait",
        text: "You can upload after receiving complete results",
        confirmButtonText: "OK"
      })
    }
  }

  download() {
    this.service.wordFrequency.resultFile.forEach(f => {
      this.service.downloadContent(f[0] + ".csv", f[1])
    });
  }


}
