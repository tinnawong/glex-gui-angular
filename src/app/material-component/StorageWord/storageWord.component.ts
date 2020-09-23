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

  check = true
  iCheck = !this.check
  checkAll(){
      for (const i in this.service.storeCoppy) {
          this.service.storeCoppy[i].status = this.check
      }
      this.check = !this.check
  }

  writeFileText() {
	  var text =""
		this.service.storeCoppy.forEach(items => {
			if(items.status){
				items.words.forEach(word => {
					text += word+"\n"
				});
			}
		});
		this.downloadContent(this.service.fileNameOpenCurent + ".txt", text)
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
		atag.download = name;
		atag.click();
		this.modelDailog.fire({
			icon: 'success',
			title: 'Download successfully'
		})
	}
}
