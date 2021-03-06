import { Component, OnInit } from '@angular/core';
import { Observable, interval, from } from 'rxjs';
import { ServiceApiService } from '../shared/service-api.service';
import { HttpClient } from '@angular/common/http';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { FixedSizeVirtualScrollStrategy, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { ContextMenu, MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { enableRipple } from '@syncfusion/ej2-base';
import Swal from "sweetalert2"
import { async } from '@angular/core/testing';
import { map } from 'jquery';
import { stringToFileBuffer } from '@angular-devkit/core/src/virtual-fs/host';

@Component({
	selector: 'app-dashboard',
	templateUrl: './segment.component.html',
	styleUrls: ['./segment.component.scss']
})


export class DashboardComponent implements OnInit {
	// ngAfterViewInit() { }

	constructor(private http: HttpClient, private service: ServiceApiService) { }


	ngOnInit(): void {
		this.service.pingMainServer_()
		this.service.pingGlexServer_()
		interval(5000).subscribe(x => {
			this.service.pingMainServer_()
			this.service.pingGlexServer_()
		});
	}
	positionTooltip = "before"
	modelDailog = Swal.mixin({
		toast: true,
		position: 'bottom-start',
		showConfirmButton: false,
		timer: 4000,
		timerProgressBar: true,
		onOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	})


	selectedFiles: FileList = null;
	progressInfos = [];


	// ----------------------------start function uplaod--------------------------------------------
	selectFiles(event): void {
		this.progressInfos = [];
		this.selectedFiles = event.target.files;
	}

	// for count word all file 
	countWord() {
		for (let i = 0; i < this.service.results.length; i++) {
			this.service.results[i]["results"].forEach(element => {
				if (element[1] == 0 || element[1] == 1 || element[1] == 3) {
					this.service.countTotal[element[1]]++
					this.service.totalWordUser++
				}

			});
		}
	}

	upload(idx: number, file: File): void {
		const formData: FormData = new FormData();
		formData.append('file', file);
		formData.append('useDict', this.service.dictCurrent);
		this.http.post(this.service.urlGlexSegment, formData, {
		}).subscribe(data => {
			console.log(data)
			if (data['status'] == 'ok') {
				this.service.results.push(data["result"])
				// for check num respone to alert success
				if (this.service.numFileSend > 0) {
					this.service.numFileSend--
				}
			} else {
				if (this.service.numFileSend > 0) {
					this.service.numFileSend--
				}
				Swal.fire({
					icon: "error",
					title: "Error!",
					text: data['message'],
					confirmButtonText: "OK"
				})
			}

			if (this.service.numFileSend <= 0) {
				this.service.uploadStatus = true
				if (data['status'] == 'ok') {
					this.countWord()
					Swal.fire({
						position: 'center',
						icon: 'success',
						title: 'Successfully',
						showConfirmButton: false,
						timer: 1500,
					})
				} else {
					Swal.fire({
						icon: "error",
						title: "Error!",
						text: data['message'],
						confirmButtonText: "OK"
					})
				}
			}
		});
	}

	uploadFiles(): void {
		if (this.service.statusMainServer && this.service.stautsGlexServer) {
			if (this.selectedFiles.length != null) {
				if (this.service.uploadStatus) {
					this.service.uploadStatus = false
					// reset value to show
					this.service.results = []
					this.service.resultAfterFilter = []
					this.service.numSeg = 0
					this.service.numSegSumSpace = 0
					this.service.statusFilter = false
					this.service.fileNameOpenCurent = 'text'
					this.service.resetSesultsNumberType()
					this.service.resetCountTotal()
					this.service.totalWordUser = 0
					for (let i = 0; i < this.selectedFiles.length; i++) {
						this.upload(i, this.selectedFiles[i]);
					}
					this.service.numFileSend = this.selectedFiles.length
					// console.log(this.service.numFileSend)
				} else {
					Swal.fire({
						icon: 'info',
						title: "Please wait",
						text: "You can upload after receiving complete results",
						confirmButtonText: "OK"
					})
				}
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
				icon: "error",
				title: "Error!",
				text: "Can not connect service",
				confirmButtonText: "OK"
			})
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
				let nameType = this.service.dictCode[data[1]][0]
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

				// count word segment
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
					// console.log(">>> ++",data)
					this.service.chooseSegment = data.results
					this.service.dictGlexName = data.dictName
					this.filter()
				}
			}
		}
	}

	resetFilterWord() {
		this.service.filterWord = [
			{ name: "UNKNOWN", status: true, text: "คำที่ไม่รู้จัก" },
			{ name: "KNOWN", status: true, text: "คำที่รู้จัก" },
			{ name: "ENGLISH", status: true, text: "ภาษาอังกฤษ" },
			{ name: "DIGIT", status: true, text: "ตัวเลข" },
			{ name: "SPECIAL", status: true, text: "อักขระพิเศษ" },
			{ name: "GROUP", status: true, text: "เครื่องหมาย" },
		]
		this.service.colorDict = {
			UNKNOWN: "#FF1100",
			KNOWN: "#00AB36",
			ENGLISH: "#0800FF",
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

		Swal.fire({
			title: 'Dowload Text',
			icon: 'info',
			html: `
			<div class="clearfix">
				<div class="form-check">
					<label class="form-check-label mr-2">
						<input id="sort" type="checkbox" checked > sort word
					</label>
					<label class="form-check-label">
						<input id="unique" type="checkbox" checked> word unique
					</label>
				</div>
			
			</div>
			`,
			showCloseButton: true,
			showCancelButton: true,
			preConfirm: () => {
				var sort = (<HTMLInputElement>document.getElementById("sort")).checked;
				var unique = (<HTMLInputElement>document.getElementById("unique")).checked;
				// console.log(">>> ", sort, unique)

				if (this.service.statusFilter && this.service.resultAfterFilter != null) {

					var textList = []
					// generate list data
					this.service.resultAfterFilter.forEach(element => {
						if ((element["setColor"] != "notShow") && (element.data[0].trim() != "")) {
							textList.push(String(element.data[0]))
						}

					});
					// console.log("gen :",textList)
					if (unique) {
						let set = new Set(textList)
						textList = Array.from(set)
						// console.log("uni :",textList)
					}
					if (sort) {
						let result = this.service.sortThaiDictionary(textList)
						textList = Array.from(result)
						// console.log("sort :",textList)

					}

					// write content
					let text = '';
					textList.forEach(word => {
						// console.log(">>> word :",word)
						text += word + "\n"
					});

					this.service.downloadContent(this.service.fileNameOpenCurent + ".txt", text)
				} else {
					// alert("Please choose file and filter befor create file!!")
					Swal.fire({
						icon: 'info',
						text: "Please choose file and filter befor create file!!",
						confirmButtonText: "OK"
					})
				}
			}
		})





	}

	writeFileTextFrequency() {
		if (this.service.statusFilter && this.service.resultAfterFilter != null) {
			var textList = []
			// generate list data
			this.service.resultAfterFilter.forEach(element => {
				if ((element["setColor"] != "notShow") && (element.data[0].trim() != "")) {
					textList.push(String(element.data[0]))
				}

			});

			if (1) {
				let result = this.service.sortThaiDictionary(textList)
				textList = Array.from(result)
				// console.log("sort :",textList)

			}

			let textFrequency = new Map()
			textList.forEach(word => {
				if (textFrequency.has(word)) {
					let fre = textFrequency.get(word)
					textFrequency.set(word, fre + 1)

				} else {
					textFrequency.set(word, 1)
				}
			});

			// write content
			let text = '';
			for (let [key, value] of textFrequency) {
				console.log(key, value); //"Lokesh" 37 "Raj" 35 "John" 40
				text += String(key) + "," + String(value) + "\n"
			}
			console.log(text)
			this.service.downloadContent(this.service.fileNameOpenCurent + "(word frequency).csv", text)
		} else {
			// alert("Please choose file and filter befor create file!!")
			Swal.fire({
				icon: 'info',
				text: "Please choose file and filter befor create file!!",
				confirmButtonText: "OK"
			})
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
						margin: 50px;
					}
					
					.UNKNOWN {
						background-color: `+ this.service.colorDict.UNKNOWN + `;
					}
					
					.KNOWN {
						background-color: `+ this.service.colorDict.KNOWN + `;
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
					.TEXT-notShow {
						color: `+ this.service.colorDict.notShow + `;
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
			<div>NLP Tools version : <b>`+ this.service.programeVersion + `</b></div>` + `
			<div>file name <b>`+ this.service.fileNameOpenCurent + `</b></div>` + `
			<div>Using <b>`+ this.service.dictGlexName + `</b> dictionary</div>` + `
			<div>จำนวนคำทั้งหมดไม่รวมเว้นวรรค <b>`+ this.service.numSeg + `</b> คำ</div>` + `
			<div>จำนวนคำทั้งหมดรวมเว้นวรรค <b>`+ this.service.numSegSumSpace + `</b> คำ</div>` + `
			<div class="row" style="text-align: center;">            
				<span class="box UNKNOWN"></span><span>คำที่ไม่รู้จัก(`+ this.service.resultsNumberType['UNKNOWN'] + `)</span>&nbsp;|&nbsp;
				<span class="box KNOWN"></span><span>คำที่รู้จัก(`+ this.service.resultsNumberType['KNOWN'] + `)</span>&nbsp;|&nbsp;
				<span class="box ENGLISH"></span><span>ภาษาอังกฤษ(`+ this.service.resultsNumberType['ENGLISH'] + `)</span>&nbsp;|&nbsp;
				<span class="box DIGIT"></span><span>ตัวเลข(`+ this.service.resultsNumberType['DIGIT'] + `)</span>&nbsp;|&nbsp;
				<span class="box SPECIAL"></span><span>อักขระพิเศษ(`+ this.service.resultsNumberType['SPECIAL'] + `)</span>&nbsp;|&nbsp;
				<span class="box GROUP"></span><span>เครื่องหมาย(`+ this.service.resultsNumberType['GROUP'] + `)</span>&nbsp;
				<hr>
			</div>`
			this.service.resultAfterFilter.forEach(element => {
				if ((element["setColor"] != "notShow")) {
					html += `<span class="TEXT-` + this.service.dictCode[element.data[1]][0] + `">` + element.data[0] + `</span>`
				}
				else {
					html += `<span class="TEXT-notShow">` + element.data[0] + `</span>`
				}
				if (this.service.separatorSegment) {
					html += this.service.valueSeparatorSegment
				}

			});
			html += '</body></html>'
			this.service.downloadContent(this.service.fileNameOpenCurent + ".html", html)
		}
		else {
			// alert("Please choose file and filter befor create file!!")
			Swal.fire({
				icon: 'info',
				text: "Please choose file and filter befor create file!!",
				confirmButtonText: "OK"
			})

		}
	}






	iCheck = !this.service.checkAll_glexService
	checkAll() {
		this.service.statusFilter = false
		for (const i in this.service.filterWord) {
			this.service.filterWord[i].status = this.service.checkAll_glexService
		}
		this.service.checkAll_glexService = !this.service.checkAll_glexService
	}

}
