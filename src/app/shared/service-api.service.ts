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

  // for get text segment
  textSegment: Array<any> = null
  resultFilter: Array<any>
  resultAfterFilter = []
  filterWord = [
    { name: "UNKNOWN", status: true, text: "คำที่ไม่รู้จัก" },
    { name: "KNOWN", status: true, text: "คำที่รู้จัก" },
    { name: "AMBIGUOUS", status: true, text: "คำกำกวม" },
    { name: "ENGLISH", status: true, text: "ภาษาอังกฤษ" },
    { name: "DIGIT", status: true, text: "ตัวเลข" },
    { name: "SPECIAL", status: true, text: "อักขระพิเศษ" },
    { name: "GROUP", status: true, text: "เครื่องหมาย" },
  ]

  dictCode = {
    1: "UNKNOWN",
    2: "KNOWN",
    3: "AMBIGUOUS",
    4: "ENGLISH",
    5: "DIGIT",
    6: "SPECIAL",
    7: "GROUP"
  }

}
