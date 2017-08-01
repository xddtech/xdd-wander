import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {NamedDescription, WanderService} from '../../services/wander-service';

@Component({
  selector: 'about-page',
  providers: [WanderService],
  templateUrl: 'about.html'
})
export default class AboutComponent {
  aboutDescription: string;
  //mainText: Observable<string>;
  mainText: string;

  constructor(private wanderService: WanderService) {
    this.aboutDescription = this.wanderService.getAboutDescription().text;
    //this.mainText = this.wanderService.getMainText();
    this.wanderService.getMainText().subscribe(data => {
      this.mainText = data;
    });
  }
}