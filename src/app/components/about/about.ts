import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {NamedDescription, WanderService} from '../../services/wander-service';

@Component({
  selector: 'about-page',
  providers: [WanderService],
  template: `
    <div class="row text-center">
      {{aboutDescription}}
    </div>
    <div class="row">
      {{mainText}}
    </div>
  `
})
export default class AboutComponent {
  aboutDescription: string;
  mainText: Observable<string>;

  constructor(private wanderService: WanderService) {
    this.aboutDescription = this.wanderService.getAboutDescription().text;
    this.mainText = this.wanderService.getMainText();
  }
}