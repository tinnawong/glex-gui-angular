import { Component, OnInit } from '@angular/core';
import { Observable,interval  } from 'rxjs';
import { ServiceApiService } from '../shared/service-api.service';
import { HttpEventType, HttpResponse, HttpClient } from '@angular/common/http';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { data } from 'jquery';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
	// ngAfterViewInit() { }

	constructor(private http: HttpClient, private service: ServiceApiService) { }

	datetime:any

	ngOnInit(): void {
	//show data time
	interval(1000).subscribe(x => {
		this.datetime = Date.now()
	});

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

	searchStatus(nameType: string) {
		let status: Boolean
		this.service.filterWord.forEach(data => {
			if (data.name == nameType) {
				status = data.status
				// console.log(status)
			}
		});
		return status
	}


	filter() {
		if (this.service.chooseSegment != null) {
			this.service.resultAfterFilter = []
			let dicData
			this.service.chooseSegment.forEach(data => {
				let nameType = this.service.dictCode[data[1]]
				// console.log(data,nameType)	
				// console.log(">>>status :",this.searchStatus(nameType))
				// console.log(">>>",this.searchStatus(nameType))
				if (this.searchStatus(nameType)) {
					// console.log(">>>set color :",data, nameType)
					dicData = { "data": data, "setColor": nameType }
				} else {
					// console.log(">>>don't set color :",data, nameType)
					dicData = { "data": data, "setColor": "notShow" }
				}
				this.service.resultAfterFilter.push(dicData)
			});
		}
	}





	// index is index of filter word list
	clickCheckboxFilter(index) {
		this.filter()
	}

	// --------------------------end function filter-----------------------------------------

	// select file from wep page
	openFileSegment(fileName) {
		if (this.service.results != null) {
			for (let data of this.service.results) {
				if (data.fileName == fileName) {
					this.service.chooseSegment = data.results
					this.filter()
					break
				}
			}
		}

	}

	show() {
		// console.log(this.service.results)
		console.log(this.service.filterWord)
	}

	resetFilterWord() {
		this.service.filterWord = [
			{ name: "UNKNOWN", status: true, text: "คำที่ไม่รู้จัก" },
			{ name: "KNOWN", status: true, text: "คำที่รู้จัก" },
			{ name: "AMBIGUOUS", status: true, text: "คำกำกวม" },
			{ name: "ENGLISH", status: true, text: "ภาษาอังกฤษ" },
			{ name: "DIGIT", status: true, text: "ตัวเลข" },
			{ name: "SPECIAL", status: true, text: "อักขระพิเศษ" },
			{ name: "GROUP", status: true, text: "เครื่องหมาย" },
		]
		this.service.colorDict = {
			UNKNOWN: "#FF1100",
			KNOWN: "#00AB36",
			AMBIGUOUS: "#0800FF",
			ENGLISH: " #E7B635",
			DIGIT: " #7741AF",
			SPECIAL: "#FF7614",
			GROUP: "#FF14F3",
			notShow: "#B7B7B7"
		}
	}

	writeFileText() {
		// example = [ { "data": [ "ทดสอบ", 2 ], "setColor": "AMBIGUOUS" }, { "data": [ "การใช้งาน", 2 ], "setColor": "notShow" },]
		let text = '';
		this.service.resultAfterFilter.forEach(element => {
			if ((element["setColor"] != "notShow") && (element.data[0] != " ")) {
				text += element.data[0] + "\n";
			}

		});
		this.downloadContent("text.txt", text)
	}

	writeFileHtml() {
		// example = [ { "data": [ "ทดสอบ", 2 ], "setColor": "AMBIGUOUS" }, { "data": [ "การใช้งาน", 2 ], "setColor": "notShow" },]
		// let text = '';
		// this.service.resultAfterFilter.forEach(element => {
		// 	if ((element["setColor"] != "notShow") && (element.data[0] != " ")) {
		// 		text += element.data[0] + "\n";
		// 	}

		// });
		// this.downloadContent("text.txt", text)
	}


	downloadContent(name, content) {
		const atag = document.createElement('a');
		const file = new Blob([content], { type: 'text/plain' });
		atag.href = URL.createObjectURL(file);
		atag.download = name;
		atag.click();
	}

}
