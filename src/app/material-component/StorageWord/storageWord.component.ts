import { Component, OnInit } from '@angular/core';
import { ServiceApiService } from '../../shared/service-api.service';
import Swal from "sweetalert2"
import { ContextMenu, MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';

@Component({
	selector: 'app-search',
	templateUrl: './storageWord.component.html',
	styleUrls: ['./storageWord.component.css']
})
export class StorageWord implements OnInit {

	constructor(private service: ServiceApiService) { }


	ngOnInit() {

	}


	iCheck = !this.service.checkAll_storageWord
	checkAll() {
		for (const i in this.service.storageCoppy) {
			this.service.storageCoppy[i].status = this.service.checkAll_storageWord
		}
		this.service.checkAll_storageWord = !this.service.checkAll_storageWord
	}

	writeFileText() {
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

				var textList = []
				// generate list data
				this.service.storageCoppy.forEach(items => {
					if (items.status) {
						items.words.forEach(word => {
							textList.push(String(word))
						});
					}
				});

				// console.log("gen :", textList)
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
				let text = "";
				textList.forEach(word => {
					// console.log(">>> word :",word)
					text += word + "\n"
				});
				this.downloadContent(this.service.fileNameOpenCurent + ".txt", text)
			}
		})
	}

	modelDailog = Swal.mixin({
		toast: true,
		position: 'bottom-start',
		showConfirmButton: false,
		timer: 3000,
		timerProgressBar: true,
		onOpen: (toast) => {
			toast.addEventListener('mouseenter', Swal.stopTimer)
			toast.addEventListener('mouseleave', Swal.resumeTimer)
		}
	})
	downloadContent(name, content) {
		const atag = document.createElement('a');
		const file = new Blob([content], { type: 'text/plain' });
		atag.href = URL.createObjectURL(file);
		console.log(atag.href)
		atag.download = name;
		atag.click();
		// this.modelDailog.fire({
		// 	icon: 'success',
		// 	title: 'Download successfully'
		// })
	}
}
