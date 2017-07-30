import {Injectable} from '@angular/core';
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

  constructor(private http: Http) {}

  getAboutDescription(): NamedDescription {
      return new NamedDescription("about", descriptions.about);
  }

  getMainText(): Observable<string> {
    return this.http.get('/index.html')
      .map(response => response.text());
  }
}

var descriptions = {
    "about": "Fun with Angular and Three.js"
};
