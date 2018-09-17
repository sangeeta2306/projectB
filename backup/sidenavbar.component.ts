import { Component, OnInit, AfterViewInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { timer } from 'rxjs';
import 'rxjs/add/operator/map';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {DomSanitizer} from '@angular/platform-browser';
import * as io from 'socket.io-client';
import { MatListModule } from '@angular/material/list';
import { ImageselectionService } from '../../service/imageselection.service';
import { GroupbypipePipe } from '../../pipe/groupbypipe.pipe';  

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.css']
})
export class SidenavbarComponent implements OnInit {

  @ViewChild("slide") slide:ElementRef;
  imageList: any = [];
  deviceList : any =[];
  deviceImageList : any =[];
  timeArray : any= {};
  data: any = [];
  selectedRows:Function;
  refreshData:Function;
  timerone : AnonymousSubscription;
  socket:SocketIOClient.Socket;
  fileName:any=[];
  resp:any = [];
  constructor(private imageselection: ImageselectionService,
  private sanitizer: DomSanitizer) {
    this.socket = io.connect("http://localhost:3000/");
    this.selectedRows=function(item:any){
    this.imageselection.getDeviceImageList(item.dev_name).subscribe(deviceImageList =>{
       this.deviceImageList = deviceImageList;
       for(var i=0;i<this.deviceImageList.length;i++){
         this.deviceImageList[i].file_path = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;charset=utf-8;base64,' + this.deviceImageList[i].file_path);
         this.deviceImageList[i].timestamp = new Date(0).setUTCSeconds(this.deviceImageList[i].timestamp);
         }
         this.refreshData(item);
       })
    };

    this.refreshData=function(item:any){
      this.timerone = Observable.timer(1000).first().subscribe(() => this.selectedRows(item));
     };
   }

  populateImageList() {
    this.imageselection.getImageList().subscribe(imageList => {
      this.imageList = imageList;
    })
  };

  populateDeviceList(){
  this.imageselection.getDeviceList().subscribe(deviceList =>{
     this.deviceList = deviceList;
     this.selectedRows(this.deviceList[0]);
  })
  };
  
  ngOnInit() {
  this.populateDeviceList();
  this.socket.on('file added',(data)=>{
  this.fileName = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;charset=utf-8;base64,' + data);
  this.slide.nativeElement.src= this.fileName;
  });
  }
}