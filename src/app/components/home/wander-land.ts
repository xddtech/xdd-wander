/*
/// <reference path="../../../../node_modules/@types/three/index.d.ts" />
*/
/*
/// <reference path="../../../typings/three-local.d.ts" />
*/

/// <reference path="../../../typings/_reference-three.d.ts" />
//import * as THREE from "../../../../node_modules/@types/three/index.d";

import {Component} from '@angular/core';

@Component({
  selector: 'wander-land',
  templateUrl: 'wander-land.html'
})
export default class WanderLandComponent {
  static wanderLandInitialized = false;

  constructor() {
    //if (!WanderLandComponent.wanderLandInitialized ) {
    //  WanderLandComponent.wanderLandInitialized = true;
    //  initWanderLand();
    //}
    this.initSetup();
  }

  private initSetup(): void {
    //if (!WanderLandComponent.wanderLandInitialized ) {
      this.setupDelayed().then( () => {
        WanderLandComponent.wanderLandInitialized = true;
        initWanderLand();
      } );
    //}
  }

  private setupDelayed(): Promise<void> {
    return new Promise<void> (
      ( resolve: () => void,
        reject: () => void ) =>
        {
          function afterWait() {
            var showElement = document.getElementById("wander-land-show");
            if (showElement == null) {
              setTimeout(afterWait, 200);
              console.log("waiting showElement ....");
            } else {
              console.log("call resolve");
              resolve();
            }
          }
          afterWait();
        }
      );
  }
}

function initWanderLand(): any {
   var scene = new THREE.Scene();
   var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

   var renderer = new THREE.WebGLRenderer();
   renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
   //document.body.appendChild( renderer.domElement );
   document.getElementById("wander-land-show").appendChild(renderer.domElement);

   var geometry = new THREE.BoxGeometry( 1, 1, 1 );
   var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
   var cube = new THREE.Mesh( geometry, material );
   scene.add( cube );

   camera.position.z = 5;

   var loops = 0;
   var animate = function () {
     if(loops < 500) {
       requestAnimationFrame( animate );
     }

     cube.rotation.x += 0.1;
     cube.rotation.y += 0.1;
     loops = loops + 1;

     renderer.render(scene, camera);
   };

   animate();
}