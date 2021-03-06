import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { trim } from 'jquery';
import { ContextMenu, MenuEventArgs, MenuItemModel, BeforeOpenCloseMenuEventArgs } from '@syncfusion/ej2-navigations';
import { enableRipple } from '@syncfusion/ej2-base';
import { ContextMenuComponent } from '@syncfusion/ej2-angular-navigations';
import Swal from "sweetalert2"
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ServiceApiService implements OnInit {

  constructor(private http: HttpClient) { }
  ngOnInit() {
  }

  // --------------------------------------------------------------------------------------------------
  // -------------- config server port and global variable and function --------------------//
  // --------------------------------------------------------------------------------------------------
  programeVersion = ""
  urlglexMainService = environment.urlglexMainService
  urlGlexSegment = this.urlglexMainService + environment.urlGlexSegment
  urlPingMainServer = this.urlglexMainService + environment.urlPingMainServer

  urlGlexServer = environment.urlGlexServer
  urlPingGlexServer = this.urlGlexServer + environment.urlPingGlexServer
  urlGetSearch = this.urlGlexServer + environment.urlGetSearch

  statusMainServer = false
  stautsGlexServer = false

  pingMainServer_() {
    this.http.get(this.urlPingMainServer,).subscribe(
      data => {
        // console.log(data)
        this.programeVersion = data["nlpToolsVersion"]
        this.statusMainServer = true
      },
      err => {
        // console.log(">>> err :",err)
        this.statusMainServer = false
      }
    );
  }

  pingGlexServer_() {
    this.http.get(this.urlPingGlexServer,).subscribe(
      data => {
        if (data['status'] == "ok" && !this.assignVarlue) {
          this.allDict = data["allDict"]
          this.dictCurrent = data["dictCurrent"]
          this.assignVarlue = true
        }
        this.stautsGlexServer = true
      },
      err => {
        // console.log(">>> err :",err)
        this.stautsGlexServer = false
      }
    );
  }

  sortThaiDictionary = list => {
    const newList = [...list]
    newList.sort((a, b) => a.localeCompare(b, 'th'))
    return newList
  }
  downloadContent(name, content) {
    const atag = document.createElement('a');
    const file = new Blob(["\ufeff", content], { type: 'text/plain' });
    atag.href = URL.createObjectURL(file);
    atag.download = name;
    atag.click();
  }






  // --------------------------------------------------------------------------------------------------
  // -------------- segment service page --------------------//
  // --------------------------------------------------------------------------------------------------
  dictGlexName: any
  separatorSegment = false
  valueSeparatorSegment = "|"

  // for check number request
  numFileSend
  uploadStatus = true


  allDict
  dictCurrent: string
  selectDict
  assignVarlue = false


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

  // for count all file to calculate percentage
  totalWordUser = 0 // use UNKNOWN, KNOWN and ENGLISH
  countTotal = {
    0: 0,
    1: 0,
    3: 0,
  }
  resetCountTotal() {
    this.countTotal = {
      0: 0,
      1: 0,
      3: 0,
    }
  }

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
    0: ["UNKNOWN", "คำที่ไม่รู้จัก"],
    1: ["KNOWN", "คำที่รู้จัก"],
    3: ["ENGLISH", "ภาษาอังกฤษ"],
    4: ["DIGIT", "ตัวเลข"],
    5: ["SPECIAL", "อักขระพิเศษ"],
    6: ["GROUP", "เครื่องหมาย"]
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


  checkReadyToAdd() {
    var currentWordFilter = ""
    var count = 0
    var result = []
    this.filterWord.forEach(word => {
      if (word["status"]) {
        if (count == 0) {
          currentWordFilter = word['name']
          count++
        } else {
          count = -1
        }
      }
    });
    if (count == -1 || count == 0) {
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
      if (document.getSelection().toString().trim() == "") {
        // alert("Please select a word for coppy to clipboard")
        Swal.fire({
          icon: 'info',
          title: "Null Word",
          text: "Please select a word for coppy to clipboard",
          confirmButtonText: "OK"
        })
      }
      else {
        if (check[0]) {
          var i = 0
          for (const word of this.storageCoppy) {
            if (word['name'] == check[1]) {
              this.storageCoppy[i]["words"].add(document.getSelection().toString().trim())
              break
            }
            i++
          }
        }
        else {
          Swal.fire({
            icon: 'info',
            title: "Choose a filter",
            text: "Please choose a filter word, befor coppy word",
            confirmButtonText: "OK"
          })
        }
      }

    }
  }




  // --------------------------------------------------------------------------------------------------
  // -------------- clipboard page --------------------//
  // --------------------------------------------------------------------------------------------------
  // for search prefix or word
  prefix = ""
  listSearch
  lengSearch
  searchRespones


  checkAll_storageWord = true
  checkAll_glexService = false


  clearListSearch() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to clear list search?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.listSearch = null
        this.lengSearch = null
        this.searchRespones = null

        Swal.fire(
          'Clear!',
          'Your list search has been clear.',
          'success'
        )
      }
    })

  }

  // coppy to store (clipboard)
  storageCoppy = [
    { name: "UNKNOWN", status: true, words: new Set(), text: "คำที่ไม่รู้จัก" },
    { name: "KNOWN", status: false, words: new Set(), text: "คำที่รู้จัก" },
    { name: "ENGLISH", status: false, words: new Set(), text: "ภาษาอังกฤษ" },
    { name: "DIGIT", status: false, words: new Set(), text: "ตัวเลข" },
    { name: "SPECIAL", status: false, words: new Set(), text: "อักขระพิเศษ" },
    { name: "GROUP", status: false, words: new Set(), text: "เครื่องหมาย" },
  ]

  clearStorageCoppy() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to clear the clipboard?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.storageCoppy.forEach(element => {
          element.words.clear()
        });

        Swal.fire(
          'Clear!',
          'Your clipboard has been clear.',
          'success'
        )
      }
    })

  }

  public menuItems1: MenuItemModel[] = [
    {
      id: "0",
      text: 'Copy',
    },
    {
      id: "1",
      text: 'Copy to clipboard',
    }
  ];
  public menuItems2: MenuItemModel[] = [
    {
      id: "0",
      text: 'Copy',
    },
  ];


  search(prefix: string) {
    if (trim(prefix) != "") {
      this.http.get(this.urlGetSearch, { params: { prefix: prefix, useDict: this.dictCurrent } }).subscribe(
        data => {
          if (data["status"] == 'ok') {
            this.searchRespones = data
            this.listSearch = data["results"]
            this.lengSearch = data["numResults"]
          }

        },
        err => {
          Swal.fire({
            icon: 'error',
            title: "Error To Search",
            text: "Can not search, please check your service",
            confirmButtonText: "OK"
          })
        }
      );
    }
    else {
      Swal.fire({
        icon: 'info',
        title: "Null Word",
        text: "Please enter your text for search",
        confirmButtonText: "OK"
      })
    }
  }




  // --------------------------------------------------------------------------------------------------
  // -------------- Word Frequency page --------------------//
  // --------------------------------------------------------------------------------------------------

  wordFrequency = {
    corpusName: "",
    fileType: ["raw", "pipe", "line"],
    typeOutpu: { "fileandfolder": "file and folder", "file": "file", "folder": "folder" },
    segmentLibrary: ["deepcut", "tltk", "newmm", "glex", "mm"],
    current: {
      "glexDict": null,
      "fileType": "raw",
      "segmentLibrary": "tltk",
      "typeOutput": "fileandfolder"
    },
    statusWaitRespone: false,
    resultFile: null,
  }




}
