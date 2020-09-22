import { Component, OnInit } from '@angular/core';
import { Observable, interval, from } from 'rxjs';
import { ServiceApiService } from '../shared/service-api.service';
import { HttpClient } from '@angular/common/http';
import { ColorPickerService, Cmyk } from 'ngx-color-picker';
import { FixedSizeVirtualScrollStrategy, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { ContextMenu, MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
import { enableRipple } from '@syncfusion/ej2-base';
import Swal from "sweetalert2"

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
		interval(5000).subscribe(x => {
			this.service.pingMainServer_()
			this.service.pingGlexServer_()
		});
	}
	modelDailog = Swal.mixin({
		toast: true,
		position: 'top-start',
		showConfirmButton: false,
		timer: 3000,
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
				// for check num respone to alert success
				if (this.service.numFileSend > 0) {
					this.service.numFileSend--
				}
			} else {
				// alert(data['message'])
				Swal.fire({
					icon: "error",
					title: "Error!",
					text: data['message'],
					confirmButtonText: "OK"
				})
			}
			if (this.service.numFileSend <= 0) {
				Swal.fire({
					position: 'center',
					icon: 'success',
					title: 'Successfully',
					showConfirmButton: false,
					timer: 1500,
				})
			}

		});
	}

	uploadFiles(): void {
		if (this.service.statusMainServer && this.service.stautsGlexServer) {
			if (this.selectedFiles.length != null) {
				this.service.results = []
				for (let i = 0; i < this.selectedFiles.length; i++) {
					this.upload(i, this.selectedFiles[i]);
				}
				this.service.numFileSend = this.selectedFiles.length
				console.log(this.service.numFileSend)
			} else {
				// alert("Please choose file")
				Swal.fire({
					icon: 'info',
					title: "Please choose file",
					text: "Please choose your files befor upload",
					confirmButtonText: "OK"
				})
			}
		} else {
			// alert("Can not connect service")
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
		if (this.service.statusFilter && this.service.resultAfterFilter != null) {
			let text = '';
			this.service.resultAfterFilter.forEach(element => {
				if ((element["setColor"] != "notShow") && (element.data[0].trim() != "")) {
					text += element.data[0] + "\n";
				}

			});
			this.downloadContent(this.service.fileNameOpenCurent + ".txt", text)
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
					html += `<span class="TEXT-` + this.service.dictCode[element.data[1]] + `">` + element.data[0] + `</span>`
				}
				else {
					html += `<span class="TEXT-notShow">` + element.data[0] + `</span>`
				}
				if (this.service.separatorSegment) {
					html += this.service.valueSeparatorSegment
				}

			});
			html += '</body></html>'
			this.downloadContent(this.service.fileNameOpenCurent + ".html", html)
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


	downloadContent(name, content) {
		const atag = document.createElement('a');
		const file = new Blob([content], { type: 'text/plain' });
		atag.href = URL.createObjectURL(file);
		atag.download = name;
		atag.click();
		this.modelDailog.fire({
			icon: 'success',
			title: 'Download successfully'
		})
	}


	public menuItems: MenuItemModel[] = [
		{
			id : "0",
			text: 'Copy',
			iconCss: 'e-cm-icons e-copy'
		},
		{
			id :"1",
			text: 'Copy to store',
			iconCss: 'e-cm-icons e-copy'
		}
	];

	checkReadyToAdd(){
		var currentWordFilter =""
		var count = 0
		var result = []
		this.service.filterWord.forEach(word => {
			if(word["status"]){
				if(count==0){
					currentWordFilter = word['name']
					count ++
				}else{
					count = -1 
				}
			}	
		});
		if(count == -1 || count ==0){
			result.push(false)
			result.push("")
			console.log(result)
			return result
		}
		result.push(true)
		result.push(currentWordFilter)
		console.log(result)
		return result
	}

	public itemSelect(args: MenuEventArgs): void {
		if (args.item.id === "0") {
			document.getSelection().toString()
			document.execCommand("copy");
		}
		else if (args.item.id === "1") {
			const check = this.checkReadyToAdd()
			if(check[0]){
				var i =0
				for (const word of this.service.storeCoppy) {
					if(word['name'] == check[1]){
						this.service.storeCoppy[i]["words"].add(document.getSelection().toString().trim())
						console.log(this.service.storeCoppy)
						break
					}
					i++
				}
			}
			else{
				alert("Please choose a filter word, befor coppy word to store")
			}
		}
	}

	check = false
	iCheck = !this.check
	checkAll(){
		for (const i in this.service.filterWord) {
			this.service.filterWord[i].status = this.check
		}
		this.check = !this.check
	}

}
