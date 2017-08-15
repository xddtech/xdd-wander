/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {WanderService} from '../../services/wander-service';
import {SleepingBearShow} from './sleeping-bear-show';
import {AppSbParams} from './appsb-params';

declare var $: JQueryStatic;

export class LakeMichigan {

  lakeGeometry: THREE.PlaneGeometry;

  constructor(private wanderService: WanderService) {
  }

  create(appScene: THREE.Scene) : void {
    this.createBeach(appScene);
    this.createDeepWater(appScene);
  }

  createBeach(appScene: THREE.Scene) : void {
    var width = 100;
    var length = 100;
    var widthSegments = 50;
    var lengthSegments = 50;
    this.lakeGeometry = new THREE.PlaneGeometry(width, length, widthSegments, lengthSegments);
    
    var xmiddle = width / 2;
    var r = 20;
    var y0: number;
    var ym = -length / 2;
    for ( var i = 0, l = this.lakeGeometry.vertices.length; i < l; i ++ ) {
      var xyz = this.lakeGeometry.vertices[i];
      if (i === 0) {
        y0 = xyz.y;
        console.info("y0=" + y0);
      }
      var fy = 1 - (xyz.y - y0)/(ym - y0);
      if (Math.abs(xyz.x) < r) {
        var d = r - Math.sqrt(r*r - xyz.x * xyz.x);
        var f = 1 + 2*d/r;
        xyz.y = xyz.y - fy* d/f;
      } else {
        xyz.y = xyz.y - fy* r/3;
      }
      xyz.z = xyz.z + fy * AppSbParams.beachHeight;
		}

    var loader = new THREE.TextureLoader();
    var texture = loader.load("assets/textures/beach-1.png");
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set(2, 1);
    texture.flipY = false;
    //texture.anisotropy = 16;
    //var lakeMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: texture } );
    var lakeMaterial = new THREE.MeshPhongMaterial( {map: texture } );
    lakeMaterial.opacity = 0.8;
    lakeMaterial.transparent = true;
    var mat = new THREE.MeshPhongMaterial();
    mat.map = texture;

    var meshParams = {
      wireframe: true,
      overdraw: 1,
      color: 0x00ffff
    };
    var lakeMesh1 = THREE.SceneUtils.createMultiMaterialObject(this.lakeGeometry,
       [new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>meshParams),
                lakeMaterial
          ]);
    var lakeMesh = THREE.SceneUtils.createMultiMaterialObject(this.lakeGeometry,
       [lakeMaterial]);
    
    lakeMesh.rotation.x = -0.5 * Math.PI;
    lakeMesh.position.z = length / 2;
    appScene.add(lakeMesh);
  }

  createDeepWater(appScene: THREE.Scene) : void {
    var width = 100;
    var length = 100;
    var widthSegments = 20;
    var lengthSegments = 10;
    var waterGeometry = new THREE.PlaneGeometry(width, length, widthSegments, lengthSegments);

    var y0;
    for ( var i = 0, l = waterGeometry.vertices.length; i < l; i ++ ) {
      var xyz = waterGeometry.vertices[i];
      if (i === 0) {
        y0 = xyz.y;
        console.info("createDeepWater-y0=" + y0);
      }
      if (xyz.y === y0) {
        var d = (0.5 - Math.random()) * 4;
        xyz.y = xyz.y + d;
      }
		}
    
    var loader = new THREE.TextureLoader();
    var texture = loader.load("assets/textures/lake-water-1.png");
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set(1, 1);
    texture.flipY = false;
   
    var waterMaterial = new THREE.MeshPhongMaterial( {map: texture } );
    var waterMesh = new THREE.Mesh(waterGeometry, waterMaterial );
    
    waterMesh.rotation.x = -0.5 * Math.PI;
    waterMesh.position.z = length / 2 + 100 - 4;
    waterMesh.position.y = -0.1;
    appScene.add(waterMesh);
  }

  animate(deltaTime: number, elapsedTime: number): void {
    for ( var i = 0, l = this.lakeGeometry.vertices.length; i < l; i ++ ) {
      this.lakeGeometry.vertices[ i ].y = 35 * Math.sin( i / 5 + (elapsedTime + i ) / 7 );
    }
    this.lakeGeometry.verticesNeedUpdate = true;
  }
}