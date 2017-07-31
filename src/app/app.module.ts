import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {HttpModule} from '@angular/http';

import { AppComponent } from './app.component';
import NavbarComponent from './components/navbar/navbar';
import FooterComponent from './components/footer/footer';
import HomeComponent from './components/home/home';
import AboutComponent from './components/about/about';
import WanderLandComponent from './components/home/wander-land';
import {WanderService} from './services/wander-service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    AboutComponent,
    WanderLandComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      {path: '',                    component: HomeComponent},
      {path: 'about',               component: AboutComponent}
    ])
  ],
  providers: [
     { provide: LocationStrategy, useClass: HashLocationStrategy },
     WanderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
