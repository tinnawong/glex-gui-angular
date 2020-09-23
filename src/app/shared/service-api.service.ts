import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { trim } from 'jquery';
import { ContextMenu, MenuEventArgs, MenuItemModel,BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { enableRipple } from '@syncfusion/ej2-base';
import { ContextMenuComponent } from '@syncfusion/ej2-angular-navigations';
@Injectable({
  providedIn: 'root'
})
export class ServiceApiService implements OnInit {

  constructor(private http: HttpClient) { }
  ngOnInit() {
  }

  urlglexMainService = 'http://localhost:5200/'
  urlGlexSegment = this.urlglexMainService + 'glexSegment'
  urlPingMainServer = this.urlglexMainService + "ping"
  urlGlexServer = 'http://localhost:8080/ping'
  urlGetDictName = 'http://localhost:8080/get-dict-name'
  urlGetSearch = 'http://localhost:8080/search'
  statusMainServer = false
  stautsGlexServer = false
  dictGlexName: any
  separatorSegment = false
  valueSeparatorSegment = "|"
  // for check number request
  numFileSend
  uploadStatus = true

  // for search prefix or word
  prefix = ""
  listSearch
  lengSearch
  searchRespones

  // coppy to store
  storeCoppy = [
    { name: "UNKNOWN", status: true, words: new Set(), text: "คำที่ไม่รู้จัก" },
    { name: "KNOWN", status: false, words: new Set(), text: "คำที่รู้จัก" },
    { name: "ENGLISH", status: false, words: new Set(), text: "ภาษาอังกฤษ" },
    { name: "DIGIT", status: false, words: new Set(), text: "ตัวเลข" },
    { name: "SPECIAL", status: false, words: new Set(), text: "อักขระพิเศษ" },
    { name: "GROUP", status: false, words: new Set(), text: "เครื่องหมาย" },
  ]
  public menuItems1: MenuItemModel[] = [
    {
      id: "0",
      text: 'Copy',
    },
    {
      id: "1",
      text: 'Copy to storage',
    }
  ];
  public menuItems2: MenuItemModel[] = [
    {
      id: "0",
      text: 'Copy',
    },
  ];

  
	checkReadyToAdd(){
		var currentWordFilter =""
		var count = 0
		var result = []
		this.filterWord.forEach(word => {
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
			// console.log(result)
			return result
		}
		result.push(true)
		result.push(currentWordFilter)
		// console.log(result)
		return result
  }
  
  public cmenu: ContextMenuComponent;
  
  itemSelect(args: MenuEventArgs): void {
		if (args.item.id === "0") {
			document.getSelection().toString()
			document.execCommand("copy");
		}
		else if (args.item.id === "1") {
			const check = this.checkReadyToAdd()
      if(document.getSelection().toString().trim() == ""){
          alert("Please select a word for coppy word")
      }
      else{
        if(check[0]){
          var i =0
          for (const word of this.storeCoppy) {
            if(word['name'] == check[1]){
              this.storeCoppy[i]["words"].add(document.getSelection().toString().trim())
              // console.log(this.storeCoppy)
              break
            }
            i++
          }
        }
        else{
          alert("Please choose a filter word, befor coppy word")
        }
      }
      
		}
  }
  

  pingMainServer_() {
    this.http.get(this.urlPingMainServer,).subscribe(
      data => {
        // console.log(data)
        this.statusMainServer = true
      },
      err => {
        // console.log(">>> err :",err)
        this.statusMainServer = false
      }
    );
  }

  pingGlexServer_() {
    this.http.get(this.urlGlexServer,).subscribe(
      data => {
        // console.log(data)
        this.stautsGlexServer = true
      },
      err => {
        // console.log(">>> err :",err)
        this.stautsGlexServer = false
      }
    );
  }

  search(prefix: string) {
    if (trim(prefix) != "") {
      this.http.get(this.urlGetSearch, { params: { prefix: prefix } }).subscribe(
        data => {
          if (data["status"] == 'ok') {
            this.searchRespones = data
            this.listSearch = data["results"]
            this.lengSearch = data["numResults"]
            // console.log(this.listSearch)
          }

        },
        err => {
          console.log(">>> err :", err)
        }
      );
    }
    else {
      alert("Please enter your text for search.")
    }
  }



  // for target all result from http json
  results = []

  resultsNumberType = {
    UNKNOWN: 0,
    KNOWN: 0,
    ENGLISH: 0,
    DIGIT: 0,
    SPECIAL: 0,
    GROUP: 0,
  }

  resetSesultsNumberType() {
    this.resultsNumberType = {
      UNKNOWN: 0,
      KNOWN: 0,
      ENGLISH: 0,
      DIGIT: 0,
      SPECIAL: 0,
      GROUP: 0,
    }
  }

  // for get text segment after choose file from wep page
  chooseSegment: Array<any> = null
  // for get text segment after filter and number of word segment
  resultAfterFilter = []
  numSeg = 0
  numSegSumSpace = 0

  statusFilter = false

  fileNameOpenCurent = 'text'

  filterWord = [
    { name: "UNKNOWN", status: true, text: "คำที่ไม่รู้จัก" },
    { name: "KNOWN", status: true, text: "คำที่รู้จัก" },
    { name: "ENGLISH", status: true, text: "ภาษาอังกฤษ" },
    { name: "DIGIT", status: true, text: "ตัวเลข" },
    { name: "SPECIAL", status: true, text: "อักขระพิเศษ" },
    { name: "GROUP", status: true, text: "เครื่องหมาย" },
  ]

  resetFilterWord = [
    { name: "UNKNOWN", status: true, text: "คำที่ไม่รู้จัก" },
    { name: "KNOWN", status: true, text: "คำที่รู้จัก" },
    { name: "ENGLISH", status: true, text: "ภาษาอังกฤษ" },
    { name: "DIGIT", status: true, text: "ตัวเลข" },
    { name: "SPECIAL", status: true, text: "อักขระพิเศษ" },
    { name: "GROUP", status: true, text: "เครื่องหมาย" },
  ]

  dictCode = {
    0: "UNKNOWN",
    1: "KNOWN",
    3: "ENGLISH",
    4: "DIGIT",
    5: "SPECIAL",
    6: "GROUP"
  }

  colorDict = {
    UNKNOWN: "#FF1100",
    KNOWN: "#00AB36",
    ENGLISH: "#0800FF",
    DIGIT: " #7741AF",
    SPECIAL: "#FF7614",
    GROUP: "#FF14F3",
    notShow: "#B7B7B7"
  }




}
