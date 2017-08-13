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

    var fov = 50;
    var aspect = this.getCameraAspect();
    var near = 0.1;
    var far = 1000;
    SleepingBearShow.appCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    var camera = SleepingBearShow.appCamera;
    camera.position.x = 0;
    camera.position.y = 30;
    camera.position.z = 100;
    camera.lookAt(SleepingBearShow.appScene.position);
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
    
    SleepingBearShow.appRender = new THREE.WebGLRenderer({ antialias: true });
    SleepingBearShow.appRender.setClearColor(new THREE.Color(0xEEEEEE));
    SleepingBearShow_onWindowResize();
    showElement.appendChild(SleepingBearShow.appRender.domElement);

    window.addEventListener("resize", SleepingBearShow_onWindowResize);

    this.addShowObjects();

    SleepingBearShow_animate();
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

    var loader = new THREE.TextureLoader();
    var groundTexture = loader.load("assets/textures/lake-water.jpg");
    //var groundTexture = loader.load("lake-water.jpg");
    groundTexture.wrapS = THREE.RepeatWrapping;
    groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set( 25, 25 );
    groundTexture.anisotropy = 16;
    var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: groundTexture } );
    var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 20000, 20000 ), groundMaterial );
    mesh.position.y = - 250;
    mesh.rotation.x = - Math.PI / 2;
    mesh.receiveShadow = true;
    //SleepingBearShow.appScene.add( mesh );
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
      
  //SleepingBearShow.lakeMichigan.animate(deltaTime, elapsedTime);

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
}

function SleepingBearShow_onWindowResize() {
   var navbarHeight =  SleepingBearShow.wanderServiceRef.getNavbarHeight();
   var height = window.innerHeight - navbarHeight;
   SleepingBearShow.appRender.setSize(window.innerWidth, height);
}
