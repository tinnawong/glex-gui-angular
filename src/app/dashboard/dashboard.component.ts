import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceApiService } from '../shared/service-api.service';
import { HttpEventType, HttpResponse, HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
	// ngAfterViewInit() { }

	constructor(private http: HttpClient, private service: ServiceApiService) { }

	ngOnInit(): void {

	}
	selectedFiles!: FileList;
	progressInfos = [];
	message = '';
	fileInfos!: Observable<any>;
	bufferdata !: Array<any>
	ch = true

	selectFiles(event: any): void {
		this.progressInfos = [];
		this.selectedFiles = event.target.files;
	}

	upload(idx: number, file: File): void {
		const formData: FormData = new FormData();
		formData.append('file', file);
		this.http.post(`http://localhost:5200/glexSegment`, formData, {
			reportProgress: true,
		}).subscribe(data => {
			console.log(data);
			// var dicData: { [id: string]: any; } = {};
			// dicData[file.name] = data;
			this.service.results.push(data)
		});
	}

	uploadFiles(): void {

		if (this.selectFiles.length > 0) {
			this.service.results = []
			for (let i = 0; i < this.selectedFiles.length; i++) {
				this.upload(i, this.selectedFiles[i]);
			}
		} else {
			alert("Please choose file")
		}

	}
	show() {
		// console.log(this.service.results)
		console.log(this.ch)
	}

	// select file from wep page
	openFileSegment(fileName) {
		this.service.results.forEach(data => {
			if (data.fileName == fileName) {
				this.service.textSegment = data.results
				this.filterFuntion()
			}
		});
	}

	filterFuntion() {
		this.service.resultAfterFilter = null
		this.service.textSegment.forEach(data => {
			// data[1]
			console.log(data)
		});
	}

	// index is index of filter word list
	clickFilter(index) {
		// console.log(">>>",this.service.textSegment)
		console.log("->>", this.service.textSegment)

	}

	filter() {

	}



}
