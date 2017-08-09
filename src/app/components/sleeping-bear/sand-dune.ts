/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {WanderService} from '../../services/wander-service';
import {SleepingBearShow} from './sleeping-bear-show';

declare var $: JQueryStatic;

export class SandDune {

  constructor(private wanderService: WanderService) {
  }

  create(appScene: THREE.Scene) : void {
    var width = 100;
    var length = 100;
    var widthSegments = 50;
    var lengthSegments = 50;
    var ground = new THREE.PlaneGeometry(width, length, widthSegments, lengthSegments);
    var meshParams = {
      wireframe: true,
      overdraw: 1,
      color: '000000'
    };
    var lakeMesh = THREE.SceneUtils.createMultiMaterialObject(ground,
          [new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>meshParams),
               new THREE.MeshBasicMaterial({color: 0x888888, transparent: true, opacity: 0.5}
              )
          ]);
    lakeMesh.rotation.x = -0.0 * Math.PI;
    lakeMesh.position.y = length / 2;
    appScene.add(lakeMesh);

  }
}