import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {DomSanitizer} from '@angular/platform-browser';
import { MatListModule } from '@angular/material/list';
import { ImageselectionService } from '../../service/imageselection.service';
import { GroupbypipePipe } from '../../pipe/groupbypipe.pipe';  
@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.css']
})
export class SidenavbarComponent implements OnInit {
  imageList: any = [];
  deviceList : any =[];
  deviceImageList : any =[];
  timeArray : any= {};
  data: any = [];
  selectedRows:Function;

  constructor(private imageselection: ImageselectionService,
  private sanitizer: DomSanitizer) {
    this.selectedRows=function(item:any){
    this.imageselection.getDeviceImageList(item.dev_name).subscribe(deviceImageList =>{
       this.deviceImageList = deviceImageList;
       for(var i=0;i<this.deviceImageList.length;i++){
         this.deviceImageList[i].file_path = this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;charset=utf-8;base64,' + this.deviceImageList[i].file_path);
         this.deviceImageList[i].timestamp = new Date(0).setUTCSeconds(this.deviceImageList[i].timestamp);
         }
       })
    }
   }

  populateImageList() {
    this.imageselection.getImageList().subscribe(imageList => {
      console.log(imageList);
      this.imageList = imageList;
    })
  }

  populateDeviceList(){
  this.imageselection.getDeviceList().subscribe(deviceList =>{
     console.log(deviceList);
     this.deviceList = deviceList;
  })
  }

  
  ngOnInit() {
  this.populateImageList();
  this.populateDeviceList();
  }
  
}