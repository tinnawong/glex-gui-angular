import { Component, OnInit } from '@angular/core';
import { Observable, interval, from } from 'rxjs';
import { ServiceApiService } from '../shared/service-api.service';
import { HttpClient } from '@angular/common/http';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { FixedSizeVirtualScrollStrategy, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {
	// ngAfterViewInit() { }

	constructor(private http: HttpClient, private service: ServiceApiService) { }


	ngOnInit(): void {
		this.service.pingMainServer_()
		this.service.pingGlexServer_()
		this.service.getDictName() 
		interval(5000).subscribe(x => {
			this.service.pingMainServer_()
			this.service.pingGlexServer_()
			this.service.getDictName()
		});
	}

	selectedFiles: FileList = null;
	progressInfos = [];


	// ----------------------------start function uplaod--------------------------------------------
	selectFiles(event): void {
		this.progressInfos = [];
		this.selectedFiles = event.target.files;
	}

	upload(idx: number, file: File): void {
		const formData: FormData = new FormData();
		formData.append('file', file);
		this.http.post(this.service.urlGlexSegment, formData, {
			// reportProgress: true,
		}).subscribe(data => {
			// console.log(data);
			// var dicData: { [id: string]: any; } = {};
			// dicData[file.name] = data;
			if (data['status'] == 'ok') {
				this.service.results.push(data)
			} else {
				alert(data['message'])
			}

		});
	}

	uploadFiles(): void {
		if(this.service.statusMainServer && this.service.stautsGlexServer){
			if (this.selectedFiles.length != null) {
				this.service.results = []
				for (let i = 0; i < this.selectedFiles.length; i++) {
					this.upload(i, this.selectedFiles[i]);
				}
			} else {
				alert("Please choose file")
			}
		}else{
			alert("Can not connect service")
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
			this.service.statusFilter = true
			this.service.resultAfterFilter = []
			let dicData
			this.service.numSegSumSpace = 0
			this.service.numSeg = 0
			// reset number each type of segment
			this.service.resetSesultsNumberType()

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
				this.service.resultsNumberType[nameType] += 1

				if (data[0].trim() != "") {
					this.service.numSeg += 1
				}
				this.service.numSegSumSpace += 1



			});

		}
	}

	// index is index of filter word list
	clickCheckboxFilter(index) {
		this.filter()
	}

	clickCheckboxFilterChangeStatus() {
		this.service.statusFilter = false
	}

	// --------------------------end function filter-----------------------------------------

	// select file from wep page
	openFileSegment(fileName) {
		if (this.service.results != null) {
			this.service.fileNameOpenCurent = fileName
			for (let data of this.service.results) {
				if (data.fileName == fileName) {
					this.service.chooseSegment = data.results
					this.filter()
				}
			}
		}
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

		if (this.service.chooseSegment != null) {
			this.service.statusFilter = true
		}
		this.filter()
	}

	writeFileText() {
		// example = [ { "data": [ "ทดสอบ", 2 ], "setColor": "AMBIGUOUS" }, { "data": [ "การใช้งาน", 2 ], "setColor": "notShow" },]
		if (this.service.statusFilter && this.service.resultAfterFilter != null) {
			let text = '';
			this.service.resultAfterFilter.forEach(element => {
				if ((element["setColor"] != "notShow") && (element.data[0].trim() != "")) {
					text += element.data[0] + "\n";
				}

			});
			this.downloadContent(this.service.fileNameOpenCurent + ".txt", text)
		} else {
			alert("Please choose file and filter befor create file!!")
		}
	}

	writeFileHtml() {
		// example = [ { "data": [ "ทดสอบ", 2 ], "setColor": "AMBIGUOUS" }, { "data": [ "การใช้งาน", 2 ], "setColor": "notShow" },]
		if (this.service.statusFilter && this.service.resultAfterFilter != null) {
			let html = '';
			html = `
				<!DOCTYPE html><html><head>
				<title></title><style>
					body {
						margin: 20px;
					}
					
					.UNKNOWN {
						background-color: `+ this.service.colorDict.UNKNOWN + `;
					}
					
					.KNOWN {
						background-color: `+ this.service.colorDict.KNOWN + `;
					}
					
					.AMBIGUOUS {
						background-color: `+ this.service.colorDict.AMBIGUOUS + `;
					}
					
					.ENGLISH {
						background-color: `+ this.service.colorDict.ENGLISH + `;
					}

					.DIGIT {
						background-color: `+ this.service.colorDict.DIGIT + `;
					}
					.SPECIAL {
						background-color: `+ this.service.colorDict.SPECIAL + `;
					}

					.GROUP {
						background-color: `+ this.service.colorDict.GROUP + `;
					}
					.TEXT-UNKNOWN {
						color: `+ this.service.colorDict.UNKNOWN + `;
					}
					
					.TEXT-KNOWN {
						color: `+ this.service.colorDict.KNOWN + `;
					}
					
					.TEXT-AMBIGUOUS {
						color: `+ this.service.colorDict.AMBIGUOUS + `;
					}
					
					.TEXT-ENGLISH {
						color: `+ this.service.colorDict.ENGLISH + `;
					}

					.TEXT-DIGIT {
						color: `+ this.service.colorDict.DIGIT + `;
					}
					.TEXT-SPECIAL {
						color: `+ this.service.colorDict.SPECIAL + `;
					}

					.TEXT-GROUP {
						color: `+ this.service.colorDict.GROUP + `;
					}
					
					.box {
						/* border: 1px solid #000; */
						width: 2em;
						padding-left: 1em;
					
					}
				</style>
				</head><body>
			`
			html += `
			<span>Using </span><b>`+this.service.dictGlexName.dictName+`<b> <span>dictionary</span>&nbsp;`+`
			<span>จำนวนคำทั้งหมดไม่รวมเว้นวรรค </span><b>`+this.service.numSeg+`<b> <span>คำ</span>&nbsp;`+`
			<span>จำนวนคำทั้งหมดรวมเว้นวรรค </span><b>`+this.service.numSegSumSpace+`<b> <span>คำ</span>&nbsp;`+`
			<div class="row" style="text-align: center;">            
				<span class="box UNKNOWN"></span><span>คำที่ไม่รู้จัก(`+ this.service.resultsNumberType['UNKNOWN'] + `)</span>&nbsp;|&nbsp;
				<span class="box KNOWN"></span><span>คำที่รู้จัก(`+ this.service.resultsNumberType['KNOWN'] + `)</span>&nbsp;|&nbsp;
				<span class="box AMBIGUOUS"></span><span>คำกำกวม(`+ this.service.resultsNumberType['AMBIGUOUS'] + `)</span>&nbsp;|&nbsp;
				<span class="box ENGLISH"></span><span>ภาษาอังกฤษ(`+ this.service.resultsNumberType['ENGLISH'] + `)</span>&nbsp;|&nbsp;
				<span class="box DIGIT"></span><span>ตัวเลข(`+ this.service.resultsNumberType['DIGIT'] + `)</span>&nbsp;|&nbsp;
				<span class="box SPECIAL"></span><span>อักขระพิเศษ(`+ this.service.resultsNumberType['SPECIAL'] + `)</span>&nbsp;|&nbsp;
				<span class="box GROUP"></span><span>เครื่องหมาย(`+ this.service.resultsNumberType['GROUP'] + `)</span>&nbsp;
				<hr>
			</div>`
			this.service.resultAfterFilter.forEach(element => {
				if ((element["setColor"] != "notShow") && (element.data[0].trim() != "")) {
					html += `<span class="TEXT-` + this.service.dictCode[element.data[1]] + `">` + element.data[0] + `</span>`
				}

			});
			html += '</body></html>'
			this.downloadContent(this.service.fileNameOpenCurent + ".html", html)
		}
		else {
			alert("Please choose file and filter befor create file!!")
		}
	}


	downloadContent(name, content) {
		const atag = document.createElement('a');
		const file = new Blob([content], { type: 'text/plain' });
		atag.href = URL.createObjectURL(file);
		atag.download = name;
		atag.click();
	}


}
