import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ImageselectionService {

  constructor(private http:Http) { }

  /* this renders the whole list*/
  getImageList(){
    return this.http.get('/api/images')
    .pipe(map(res=>res.json()))
  };

  getDeviceList(){
    return this.http.get('/api/devices')
    .pipe(map(res=>res.json()))
  };
  
  getDeviceImageList(id){
  return this.http.get('/api/imagelist/'+id)
  .pipe(map(res=>res.json()))
  };
}


