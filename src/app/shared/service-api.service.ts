import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { HttpClient } from '@angular/common/http';
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
  statusMainServer = false
  stautsGlexServer = false
  dictGlexName:any
  separatorSegment = false
  valueSeparatorSegment= "|"
  pingMainServer_() {
    this.http.get(this.urlPingMainServer, ).subscribe(
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



  // for target all result from http json
  results = []

  resultsNumberType = {
    UNKNOWN: 0,
    KNOWN: 0,
    AMBIGUOUS: 0,
    ENGLISH: 0,
    DIGIT: 0,
    SPECIAL: 0,
    GROUP: 0,
  }

  resetSesultsNumberType() {
    this.resultsNumberType = {
      UNKNOWN: 0,
      KNOWN: 0,
      AMBIGUOUS: 0,
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
  numSeg=0
  numSegSumSpace=0

  statusFilter = false

  fileNameOpenCurent = 'text'

  filterWord = [
    { name: "UNKNOWN", status: true, text: "คำที่ไม่รู้จัก" },
    { name: "KNOWN", status: true, text: "คำที่รู้จัก" },
    { name: "AMBIGUOUS", status: true, text: "คำกำกวม" },
    { name: "ENGLISH", status: true, text: "ภาษาอังกฤษ" },
    { name: "DIGIT", status: true, text: "ตัวเลข" },
    { name: "SPECIAL", status: true, text: "อักขระพิเศษ" },
    { name: "GROUP", status: true, text: "เครื่องหมาย" },
  ]

  resetFilterWord = [
    { name: "UNKNOWN", status: true, text: "คำที่ไม่รู้จัก" },
    { name: "KNOWN", status: true, text: "คำที่รู้จัก" },
    { name: "AMBIGUOUS", status: true, text: "คำกำกวม" },
    { name: "ENGLISH", status: true, text: "ภาษาอังกฤษ" },
    { name: "DIGIT", status: true, text: "ตัวเลข" },
    { name: "SPECIAL", status: true, text: "อักขระพิเศษ" },
    { name: "GROUP", status: true, text: "เครื่องหมาย" },
  ]

  dictCode = {
    0: "UNKNOWN",
    1: "KNOWN",
    2: "AMBIGUOUS",
    3: "ENGLISH",
    4: "DIGIT",
    5: "SPECIAL",
    6: "GROUP"
  }

  colorDict = {
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
