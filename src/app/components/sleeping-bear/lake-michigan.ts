/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {WanderService} from '../../services/wander-service';
import {SleepingBearShow} from './sleeping-bear-show';

declare var $: JQueryStatic;

export class LakeMichigan {

  constructor(private wanderService: WanderService) {
  }

  create(appScene: THREE.Scene) : void {
    /*
    var planeGeometry = new THREE.PlaneGeometry(60, 20);
    var planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);

    // rotate and position the plane
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 15;
    plane.position.y = 0;
    plane.position.z = 0;

    // add the plane to the scene
    appScene.add(plane);
    */

    var ground = new THREE.PlaneGeometry(100, 100, 50, 50);
    var meshParams = {
      wireframe: true,
      overdraw: 1,
      color: '000000'
    };
    var groundMesh = THREE.SceneUtils.createMultiMaterialObject(ground,
            //[new THREE.MeshBasicMaterial({wireframe: true, overdraw: true, color: 000000}),
              [new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>meshParams),
                 new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5}
                )
            ]);
    groundMesh.rotation.x = -0.5 * Math.PI;
    appScene.add(groundMesh);

  }
}