/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {WanderService} from '../../services/wander-service';
import {SleepingBearShow} from './sleeping-bear-show';
import {AppSbParams} from './appsb-params';

declare var $: JQueryStatic;

export class SandDune {

  constructor(private wanderService: WanderService) {
  }

  create(appScene: THREE.Scene) : void {
    var width = 100;
    var length = 100;
    var widthSegments = 50;
    var lengthSegments = 50;
    var sandGeometry = new THREE.PlaneGeometry(width, length, widthSegments, lengthSegments);

    var xmiddle = width / 2;
    var r = 20;
    var y0: number;
    var ym = length / 2;
    var len = sandGeometry.vertices.length;

    for ( var i = len - 1; i >= 0; i -- ) {
      var xyz = sandGeometry.vertices[i];
      if (i === (len-1)) {
        y0 = xyz.y;
        console.info("sand-y0=" + y0);
      }
      var fy = 1 - (xyz.y - y0)/(ym - y0);
      if (Math.abs(xyz.x) < r) {
        var d = r - Math.sqrt(r*r - xyz.x * xyz.x);
        var f = 1 + 2*d/r;
        xyz.z = xyz.z + fy* d/f;
      } else {
        xyz.z = xyz.z + fy* r/3;
      }
      xyz.y = xyz.y + AppSbParams.beachHeight;
      xyz.z = xyz.z - 50 * (1-fy);
    }
    
    var loader = new THREE.TextureLoader();
    var texture = loader.load("assets/textures/sand.png");
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set(2, 2);
    texture.flipY = false;
    //texture.anisotropy = 16;
    var sandMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: texture } );
    //var sandMaterial = new THREE.MeshPhongMaterial( {map: texture } );
    //sandMaterial.opacity = 0.8;
    //sandMaterial.transparent = true;
   
    var meshParams = {
      wireframe: true,
      overdraw: 1,
      color: 0x00ffff
    };
    var sandMesh1 = THREE.SceneUtils.createMultiMaterialObject(sandGeometry,
       [new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>meshParams),
                sandMaterial
          ]);
    var sandMesh = THREE.SceneUtils.createMultiMaterialObject(sandGeometry,
       [sandMaterial]);

    sandMesh.rotation.x = -0.0 * Math.PI;
    sandMesh.position.y = length / 2;
    appScene.add(sandMesh);

  }
}