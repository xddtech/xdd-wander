/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {WanderService} from '../../services/wander-service';
import {SleepingBearShow} from './sleeping-bear-show';

declare var $: JQueryStatic;

export class LakeMichigan {

  lakeGeometry: THREE.PlaneGeometry;

  constructor(private wanderService: WanderService) {
  }

  create(appScene: THREE.Scene) : void {
    var width = 100;
    var length = 100;
    var widthSegments = 50;
    var lengthSegments = 50;
    this.lakeGeometry = new THREE.PlaneGeometry(width, length, widthSegments, lengthSegments);
    
    for ( var i = 0, l = this.lakeGeometry.vertices.length; i < l; i ++ ) {
			//this.lakeGeometry.vertices[ i ].y = 35 * Math.sin( i / 2 );
		}

    var meshParams = {
      wireframe: true,
      overdraw: 1,
      color: '000000'
    };
    var lakeMesh = THREE.SceneUtils.createMultiMaterialObject(this.lakeGeometry,
          [new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>meshParams),
               new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5}
              )
          ]);
    lakeMesh.rotation.x = -0.5 * Math.PI;
    lakeMesh.position.z = length / 2;
    appScene.add(lakeMesh);
  }

  animate(deltaTime: number, elapsedTime: number): void {
    for ( var i = 0, l = this.lakeGeometry.vertices.length; i < l; i ++ ) {
      this.lakeGeometry.vertices[ i ].y = 35 * Math.sin( i / 5 + (elapsedTime + i ) / 7 );
    }
    this.lakeGeometry.verticesNeedUpdate = true;
  }
}