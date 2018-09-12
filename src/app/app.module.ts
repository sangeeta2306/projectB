import { NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatMenuModule, MatButtonModule, MatIconModule, MatCardModule, MatSidenavModule, MatToolbarModule } from '@angular/material';
import { MatListModule } from '@angular/material/list';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HttpModule } from '@angular/http';
import { SidenavbarComponent } from './component/sidenavbar/sidenavbar.component';
import { GroupbypipePipe } from './pipe/groupbypipe.pipe';
import {NgPipesModule} from 'ngx-pipes';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidenavbarComponent,
    GroupbypipePipe,
    ],
  imports: [
    BrowserModule, BrowserAnimationsModule, HttpModule, MatMenuModule, MatButtonModule, MatIconModule, MatCardModule, MatSidenavModule,MatToolbarModule,MatListModule,
    FlexLayoutModule,NgPipesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
