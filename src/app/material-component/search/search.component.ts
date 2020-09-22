import { Component, OnInit } from '@angular/core';
import { ServiceApiService } from '../../shared/service-api.service';
import Swal from "sweetalert2"
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

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
		// if (this.service.statusFilter && this.service.resultAfterFilter != null) {
		// 	let text = '';
		// 	this.service.resultAfterFilter.forEach(element => {
		// 		if ((element["setColor"] != "notShow") && (element.data[0].trim() != "")) {
		// 			text += element.data[0] + "\n";
		// 		}

		// 	});
		// 	this.downloadContent(this.service.fileNameOpenCurent + ".txt", text)
		// } else {
		// 	// alert("Please choose file and filter befor create file!!")
		// 	Swal.fire({
		// 		icon: 'info',
		// 		text: "Please choose file and filter befor create file!!",
		// 		confirmButtonText: "OK"
		// 	})

		// }
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
