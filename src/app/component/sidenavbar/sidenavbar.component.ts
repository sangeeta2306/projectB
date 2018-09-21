import { Component, OnInit, AfterViewInit, Renderer, ElementRef, ViewChild} from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { timer } from 'rxjs';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {AnonymousSubscription} from 'rxjs/Subscription';
import {DomSanitizer} from '@angular/platform-browser';
import * as io from 'socket.io-client';
import { MatListModule } from '@angular/material/list';
import { ImageselectionService } from '../../service/imageselection.service';
import { GroupbypipePipe } from '../../pipe/groupbypipe.pipe';  
import { ImageList } from '../../model/imagelist';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.css']
})
export class SidenavbarComponent implements OnInit {

  @ViewChild("slide") slide:ElementRef;
  imageList: any = [];
  deviceList : any =[];
  temp : any = [];
  deviceImageList : any =[];
  timeArray : any= {};
  data: any = [];
  selectedRows:Function;
  refreshData:Function;
  timerone : AnonymousSubscription;
  socket:SocketIOClient.Socket;
  fileName:any=[];
  deviceName:String;
  showName : boolean = false;
  showAlternateImage:boolean = false;
  btnColor:any =[];
  ip: string;


  constructor(private imageselection: ImageselectionService,
  private sanitizer: DomSanitizer ) {
  this.socket = io.connect("http://localhost:3000/");
  this.fileName = '../../assets/images/no-image.jpg';
    this.selectedRows=function(item:any,index:number){
    this.showName = true;
    this.deviceName = item;
    //this.btnColor[index]="red";
    this.socket.emit('start files',item.dev_name);
    this.imageselection.getDeviceImageList(item.dev_name).subscribe(deviceImageList =>{
      this.deviceImageList = deviceImageList;
      for(var i=0;i<this.deviceImageList.length;i++){
          if(!this.deviceImageList[i].fileType){
          this.deviceImageList[i].file_path = this.sanitizer.bypassSecurityTrustUrl( '../../assets/images/corrupted-file.jpeg');
           this.deviceImageList[i].timestamp = new Date(0).setUTCSeconds(this.deviceImageList[i].timestamp);
          }else{
             this.deviceImageList[i].file_path = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;charset=utf-8;base64,' + this.deviceImageList[i].file_path);
         this.deviceImageList[i].timestamp = new Date(0).setUTCSeconds(this.deviceImageList[i].timestamp);
          }
          
         }
       })
    };
 this.socket.on('ip',(data)=>{
   this.ip = data;
 })
  this.socket.on('file added',(data)=>{
    this.fileName = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;charset=utf-8;base64,' + data);
  this.slide.nativeElement.src= this.fileName;
  });


  this.socket.on('image added',(data)=>{
   this.selectedRows(this.deviceName)
  });

  this.socket.on('empty dir',(data)=>{
    this.slide.nativeElement.src = '../../assets/images/no-image.jpg';
  })
}

  
  populateImageList() {
    this.imageselection.getImageList().subscribe(imageList => {
      this.imageList = imageList;
    })
  };

  populateDeviceList(){
  this.imageselection.getDeviceList().subscribe(deviceList =>{
     this.deviceList = deviceList;
     console.log(this.deviceList)
  })
  };
  
  ngOnInit() {
  this.slide.nativeElement.src = '../../assets/images/no-image.jpg';
  this.populateDeviceList();
  setInterval(()=>{this.populateDeviceList()},10000);
}

}