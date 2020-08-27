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

  // for get text segment after choose file from wep page
  chooseSegment: Array<any> = null
  // for get text segment after filter
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

  colorDict = {
    UNKNOWN :"#FF1100",
    KNOWN:"#00AB36",
    AMBIGUOUS:" #0800FF",
    ENGLISH:" #E7B635",
    DIGIT:" #7741AF",
    SPECIAL:"#FF7614",
    GROUP:"#FF14F3",
    notShow:"#B7B7B7"
  }


//   public colorList = [
//     { key: "flame", value: "#e45a33", friendlyName: "Flame" },
//     { key: "orange", value: "#fa761e", friendlyName: "Orange" },
//     { key: "infrared", value: "#ef486e", friendlyName: "Infrared" },
//     { key: "male", value: "#4488ff", friendlyName: "Male Color" },
//     { key: "female", value: "#ff44aa", friendlyName: "Female Color" },
//     { key: "paleyellow", value: "#ffd165", friendlyName: "Pale Yellow" },
//     { key: "gargoylegas", value: "#fde84e", friendlyName: "Gargoyle Gas" },
//     { key: "androidgreen", value: "#9ac53e", friendlyName: "Android Green" },
//     { key: "carribeangreen", value: "#05d59e", friendlyName: "Carribean Green" },
//     { key: "bluejeans", value: "#5bbfea", friendlyName: "Blue Jeans" },
//     { key: "cyancornflower", value: "#1089b1", friendlyName: "Cyan Cornflower" },
//     { key: "warmblack", value: "#06394a", friendlyName: "Warm Black" },
//   ];
// checkList=[]



}
