import { Injectable } from '@angular/core';
import { OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceApiService implements OnInit {

  constructor() { }
  ngOnInit() {

  }

  // for target all result from http json
  results = []
  
  resultsNumberType = {
    UNKNOWN: 0,
    KNOWN: 0,
    AMBIGUOUS:0,
    ENGLISH: 0,
    DIGIT: 0,
    SPECIAL: 0,
    GROUP: 0,
  }
  resetSesultsNumberType() {
      this.resultsNumberType = {
      UNKNOWN: 0,
      KNOWN: 0,
      AMBIGUOUS:0,
      ENGLISH: 0,
      DIGIT: 0,
      SPECIAL: 0,
      GROUP: 0,
    }
  }

  // for get text segment after choose file from wep page
  chooseSegment: Array<any> = null
  // for get text segment after filter
  resultAfterFilter = []

  statusFilter = false

  fileNameOpenCurent ='text'

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
