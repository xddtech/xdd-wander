import {Injectable, ElementRef} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

import {Http, URLSearchParams } from '@angular/http';

export class NamedDescription {
  constructor(
    public name: string,
    public text: string) {
  }
}

@Injectable()
export class WanderService {

  navbarElement: ElementRef;

  constructor(private http: Http) {}

  getAboutDescription(): NamedDescription {
      return new NamedDescription("about", descriptions.about);
  }

  getMainText(): Observable<string> {
    return this.http.get('/index.html')
      .map(response => response.text());
  }

  getNavbarHeight(): number {
    if(this.navbarElement == null) {
      return 0;
    }
    return this.navbarElement.nativeElement.offsetHeight;
  }
}

var descriptions = {
    "about": "Fun with Angular, Three.js and Typescript"
};
