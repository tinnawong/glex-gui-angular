import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceApiService } from '../shared/service-api.service';
import { HttpEventType, HttpResponse, HttpClient } from '@angular/common/http';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';

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
	selectedFiles: FileList = null;
	progressInfos = [];
	message = '';
	fileInfos!: Observable<any>;
	bufferdata !: Array<any>
	ch = true

	// ----------------------------start function uplaod--------------------------------------------
	selectFiles(event): void {
		this.progressInfos = [];
		this.selectedFiles = event.target.files;
	}

	upload(idx: number, file: File): void {
		const formData: FormData = new FormData();
		formData.append('file', file);
		this.http.post(`http://localhost:5200/glexSegment`, formData, {
			// reportProgress: true,
		}).subscribe(data => {
			// console.log(data);
			// var dicData: { [id: string]: any; } = {};
			// dicData[file.name] = data;
			this.service.results.push(data)
		});
	}

	uploadFiles(): void {
		if (this.selectedFiles.length != null) {
			this.service.results = []
			for (let i = 0; i < this.selectedFiles.length; i++) {
				this.upload(i, this.selectedFiles[i]);
			}
		} else {
			alert("Please choose file")
		}

	}


	// ------------------------end function uplaod---------------------------------------------

	// ------------------------start funtion filter-----------------------------------------------------
	
	searchStatus(nameType){
		for (let item in this.service.filterWord) {
			if (String(item["name"]) == nameType) {
				return item['status']
				
			}
		}
	}
	
	
	filter() {
		this.service.resultAfterFilter = null
		this.service.chooseSegment.forEach(data => {
			let nameType = this.service.dictCode[data[1]]
			// if(this.service.filterWord)
			// console.log(data)
			
			if(this.searchStatus(nameType)){
				console.log(nameType)
			}
			

		});
	}





	// index is index of filter word list
	clickCheckboxFilter(index) {
		this.filter()
	}

	// --------------------------end function filter-----------------------------------------

	// select file from wep page
	openFileSegment(fileName) {
		for (let data of this.service.results) {
			if (data.fileName == fileName) {
				this.service.chooseSegment = data.results
				this.filter()
				break
			}
		}
	}

	show() {
		// console.log(this.service.results)
		console.log(this.ch)
	}




}
