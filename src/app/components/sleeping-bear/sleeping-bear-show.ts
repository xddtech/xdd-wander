/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {WanderService} from '../../services/wander-service';
import {LakeMichigan} from './lake-michigan';

declare var $: JQueryStatic;

export class SleepingBearShow {
  static appScene: THREE.Scene;
  static appCamera: THREE.PerspectiveCamera;
  static appRender: THREE.WebGLRenderer;
  static wanderServiceRef: WanderService;

  constructor(private wanderService: WanderService) {
    SleepingBearShow.wanderServiceRef = wanderService;
  }

  create(showElement: Element): void {
    SleepingBearShow.appScene = new THREE.Scene();

    var fov = 50;
    var aspect = this.getCameraAspect();
    var near = 0.1;
    var far = 1000;
    SleepingBearShow.appCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    //SleepingBearShow.appCamera.position.z = 5;
    SleepingBearShow.appCamera.position.x = -30;
    SleepingBearShow.appCamera.position.y = 40;
    SleepingBearShow.appCamera.position.z = 30;
    SleepingBearShow.appCamera.lookAt(SleepingBearShow.appScene.position);
    
    SleepingBearShow.appRender = new THREE.WebGLRenderer();
    //SleepingBearShow.appRender.setClearColorHex();
    SleepingBearShow.appRender.setClearColor(new THREE.Color(0xEEEEEE));
    SleepingBearShow_onWindowResize();
    showElement.appendChild(SleepingBearShow.appRender.domElement);

    window.addEventListener("resize", SleepingBearShow_onWindowResize);

    this.addShowObjects();

    //SleepingBearShow.appRender.render(SleepingBearShow.appScene, SleepingBearShow.appCamera);
  }

  addShowObjects(): void {
   var geometry = new THREE.BoxGeometry(1, 1, 1);
   var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
   var cube = new THREE.Mesh(geometry, material);
   SleepingBearShow.appScene.add( cube );

    var lakeMichigan = new LakeMichigan(SleepingBearShow.wanderServiceRef);
    lakeMichigan.create(SleepingBearShow.appScene);
  }

  getCameraAspect(): number {
    var navbarHeight =  this.wanderService.getNavbarHeight();
    var height = window.innerHeight - navbarHeight;
    return window.innerWidth / height;
  }
}

var SleepingBearShow_animate = function() {
  requestAnimationFrame( SleepingBearShow_animate );
  if (SleepingBearShow.appRender != null) {
    try {
      SleepingBearShow.appRender.render(SleepingBearShow.appScene, SleepingBearShow.appCamera);
    } catch(error) {
      console.error("render error " + error);
    }
  } else {
    console.error("appRender is null");
  }
}

function SleepingBearShow_onWindowResize() {
   var navbarHeight =  SleepingBearShow.wanderServiceRef.getNavbarHeight();
   var height = window.innerHeight - navbarHeight;
   SleepingBearShow.appRender.setSize(window.innerWidth, height);
}

SleepingBearShow_animate();