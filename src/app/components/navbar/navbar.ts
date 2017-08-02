import {Component, ElementRef, ViewChild, AfterViewInit} from '@angular/core';

import {NamedDescription, WanderService} from '../../services/wander-service';

@Component({
  selector: 'wander-navbar',
  templateUrl: 'navbar.html',
  styleUrls: ['./navbar.css'],
  providers: [WanderService]
})
export default class NavbarComponent implements AfterViewInit {
  @ViewChild('wanderNavbar') navbarElement: ElementRef;

  constructor(private wanderService: WanderService) {}

  ngAfterViewInit() {
    WanderService.navbarElement = this.navbarElement;
  }
}
