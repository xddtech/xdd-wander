/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {WanderService} from '../../services/wander-service';
import {LakeMichigan} from './lake-michigan';
import {SandDune} from './sand-dune';

declare var $: JQueryStatic;

export class SleepingBearShow {
  static appScene: THREE.Scene;
  static appCamera: THREE.PerspectiveCamera;
  static appRender: THREE.WebGLRenderer;
  static wanderServiceRef: WanderService;
  static lakeMichigan: LakeMichigan;
  static showClock = new THREE.Clock();
  static appCamControl: THREE.FirstPersonControls;
  static trackballControl: THREE.TrackballControls;

  constructor(private wanderService: WanderService) {
    SleepingBearShow.wanderServiceRef = wanderService;
  }

  create(showElement: Element): void {
    SleepingBearShow.appScene = new THREE.Scene();

    this.addCameraAndControls();
    
    SleepingBearShow.appRender = new THREE.WebGLRenderer({ antialias: true });
    SleepingBearShow.appRender.setClearColor(new THREE.Color(0xEEEEEE));
    SleepingBearShow_onWindowResize();
    showElement.appendChild(SleepingBearShow.appRender.domElement);

    window.addEventListener("resize", SleepingBearShow_onWindowResize);

    this.addShowObjects();
    this.addShowLights();

    SleepingBearShow_animate();
  }

  addCameraAndControls(): void {
    var fov = 50;
    var aspect = this.getCameraAspect();
    var near = 0.1;
    var far = 1000;
    SleepingBearShow.appCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    var camera = SleepingBearShow.appCamera;
    camera.position.x = 150;
    //camera.position.y = 30 + 100;
    //camera.position.z = -200 + 150;
    camera.position.y = 15;
    camera.position.z = 50;

    var lookAt = new THREE.Vector3(-50, 0, 0);
    camera.lookAt(lookAt);
    //SleepingBearShow.appScene.position = lookAt;
    //camera.lookAt(SleepingBearShow.appScene.position);
    /*
    var camControls = new THREE.FirstPersonControls(camera, document);
        camControls.lookSpeed = 0.4;
        camControls.movementSpeed = 20;
        camControls.noFly = true;
        camControls.lookVertical = true;
        camControls.constrainVertical = true;
        camControls.verticalMin = 1.0;
        camControls.verticalMax = 2.0;
        camControls.lon = -150;
        camControls.lat = 120;
    SleepingBearShow.appCamControl = camControls;
    */
    var trackballControls = new THREE.TrackballControls(camera, document);
        trackballControls.rotateSpeed = 1.0;
        trackballControls.zoomSpeed = 1.0;
        trackballControls.panSpeed = 1.0;
        //trackballControls.noZoom=false;
        //trackballControls.noPan=false;
        trackballControls.staticMoving = true;
        //trackballControls.dynamicDampingFactor=0.3;
    SleepingBearShow.trackballControl = trackballControls;
  }

  addShowObjects(): void {
    /*
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh(geometry, material);
    SleepingBearShow.appScene.add( cube );
    */
    var axisHelper = new THREE.AxisHelper(200);
    SleepingBearShow.appScene.add(axisHelper);

    SleepingBearShow.lakeMichigan = new LakeMichigan(SleepingBearShow.wanderServiceRef);
    SleepingBearShow.lakeMichigan.create(SleepingBearShow.appScene);

    var sandDune = new SandDune(SleepingBearShow.wanderServiceRef);
    sandDune.create(SleepingBearShow.appScene);
  }

  addShowLights(): void {
    SleepingBearShow.appScene.add( new THREE.AmbientLight( 0xffffff ) );
    
    var light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
    light.position.set( 50, 200, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = false;
    //SleepingBearShow.appScene.add( light );
    
    var light = new THREE.DirectionalLight( 0xdfebff, 0.8 );
    //light.position.multiplyScalar( 1 );
    light.position.set(-250, 510, 1150 );
    light.castShadow = false;
    SleepingBearShow.appScene.add( light );
  }

  getCameraAspect(): number {
    var navbarHeight =  this.wanderService.getNavbarHeight();
    var height = window.innerHeight - navbarHeight;
    return window.innerWidth / height;
  }
}

var SleepingBearShow_animate = function() {
  requestAnimationFrame( SleepingBearShow_animate );

  var deltaTime = SleepingBearShow.showClock.getDelta(),
      elapsedTime = SleepingBearShow.showClock.getElapsedTime() * 10;
      
  SleepingBearShow.lakeMichigan.animate(deltaTime, elapsedTime);

  if (SleepingBearShow.appRender != null) {
    try {
      SleepingBearShow.appRender.render(SleepingBearShow.appScene, SleepingBearShow.appCamera);
      //SleepingBearShow.appCamControl.update(deltaTime);
      SleepingBearShow.trackballControl.update();
    } catch(error) {
      console.error("render error " + error);
    }
  } else {
    console.error("appRender is null");
  }

  //var p = SleepingBearShow.appScene.position;
  //var p = SleepingBearShow.appCamera.position;
  //console.log("cx=" + p.x + ", " + p.y + ", " + p.z);
}

function SleepingBearShow_onWindowResize() {
   var navbarHeight =  SleepingBearShow.wanderServiceRef.getNavbarHeight();
   var height = window.innerHeight - navbarHeight;
   SleepingBearShow.appRender.setSize(window.innerWidth, height);
}
