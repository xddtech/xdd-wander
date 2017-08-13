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
		}

    var meshParams = {
      wireframe: true,
      overdraw: 1,
      color: 0x00ffff
    };
    var lakeMesh1 = THREE.SceneUtils.createMultiMaterialObject(this.lakeGeometry,
          [new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>meshParams),
               new THREE.MeshBasicMaterial({color: 0x00ff00, transparent: true, opacity: 0.5}
              )
          ]);

    //var texture = THREE.ImageUtils.loadTexture("/assets/textures/lake-water.jpg");
    var loader = new THREE.TextureLoader();
    var texture = loader.load("assets/textures/lake-water.jpg");
    //var mat = new THREE.MeshPhongMaterial();
    //mat.map = texture;
    var mat1 = new THREE.MeshPhongMaterial( {
      specular: 0x444444,
      color: 0xffffff,
			map: texture,
			normalScale: new THREE.Vector2( 1, 1 ),
			shininess: 30,
			transparent: true,
			depthTest: true,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetFactor: - 4,
			wireframe: false
    } );
    var mat = new THREE.MeshPhongMaterial( {
      color: 0xffffff
		} );

    //var lakeMesh = new THREE.Mesh(this.lakeGeometry, mat);
    var lakeMesh2 = THREE.SceneUtils.createMultiMaterialObject(this.lakeGeometry,
       [new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>meshParams),
                mat
          ]);
    
    var meshParams2 = {
      wireframe: true,
      overdraw: 1,
      map: texture,
      color: 0x00ffff
    };
    var lakeMesh = THREE.SceneUtils.createMultiMaterialObject(this.lakeGeometry,
       [new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>meshParams2)
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