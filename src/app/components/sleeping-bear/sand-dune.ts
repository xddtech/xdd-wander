/// <reference path="../../../typings/_reference-three.d.ts" />
/// <reference path="../../../typings/_reference-jquery.d.ts" />

import {WanderService} from '../../services/wander-service';
import {SleepingBearShow} from './sleeping-bear-show';
import {AppSbParams} from './appsb-params';

declare var $: JQueryStatic;

export class SandDune {

  duneWidth = 100;
  duneLength = 100;
  widthSegments = 50;
  lengthSegments = 50;
  duneGeometry: THREE.PlaneGeometry;

  constructor(private wanderService: WanderService) {
  }

  create(appScene: THREE.Scene) : void {
    this.duneGeometry = new THREE.PlaneGeometry(this.duneWidth, this.duneLength, 
      this.widthSegments, this.lengthSegments);
    
    //this.createCurve();
    this.createSlope();
    this.createCurveLater();

    var meshParams = {
      wireframe: true,
      overdraw: 1,
      color: 0x00ffff
    };
    var duneMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111} );
    var duneMesh = THREE.SceneUtils.createMultiMaterialObject(this.duneGeometry,
       [new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>meshParams),
                duneMaterial
          ]);
    
    //duneMesh.rotation.x = 0;
    duneMesh.position.y = this.duneLength / 2;
    appScene.add(duneMesh);
  }

  createCurve(): void {
    var depthTop = 20;
    var depthBottom = 10;
    var xcenter = 0;
    var zreduce = 0.5;

    var dLength = this.duneLength / this.lengthSegments;
    for (var ih = 0; ih <= this.lengthSegments; ih++) {
      var y0 = this.duneLength / 2;
      var dy = y0 - ih * dLength;
      var yrate = 1 - ih / this.lengthSegments;
      var depth = depthTop * yrate + (1 - yrate) * depthBottom;
      var depth2 = depth * depth;
      for (var iw = 0; iw <= this.widthSegments; iw++) {
        var ivertex = iw + ih * (this.widthSegments + 1);
        var vert = this.duneGeometry.vertices[ivertex];
        var dx = vert.x - xcenter;
        var dx2 = dx * dx; 
        var dz = 0;
        if (dx2 <= depth2) {
          dz = Math.sqrt(depth2 - dx2);
          var zf = (1 - dx2 / depth2) * zreduce;
          dz = zf * dz;
          vert.z = vert.z - dz;
        }
      }
    }
  }

  createCurveLater(): void {
    var depthTop = 20;
    var depthBottom = 10;
    var xcenter = 0;
    var zreduce = 0.5;

    this.duneGeometry.computeFaceNormals();
    //this.duneGeometry.computeVertexNormals();

    var dLength = this.duneLength / this.lengthSegments;
    var iface = 0;
    for (var ih = 0; ih <= this.lengthSegments; ih++) {
      var yLen = ih * dLength;
      var yrate = 1 - ih / this.lengthSegments;
      var depth = depthTop * yrate + (1 - yrate) * depthBottom;
      var depth2 = depth * depth;

      for (var iw = 0; iw <= this.widthSegments; iw++) {
        var ivertex = iw + ih * (this.widthSegments + 1);
        var vert = this.duneGeometry.vertices[ivertex];
        var dx = vert.x - xcenter;
        var dx2 = dx * dx; 
        var dz = 0;

        var face = this.duneGeometry.faces[iface];
        var normal = face.normal;

        if (dx2 <= depth2) {
          var dn = Math.sqrt(depth2 - dx2);
          var zf = (1 - dx2 / depth2) * zreduce;
          dn = zf * dn;
          var ny = - normal.y * dn;
          var nz = -normal.z * dn;
          vert.z = vert.z + nz;
          vert.y = vert.y + ny;
        }
        
        if (iw < this.widthSegments) {
          iface = iface + 1;
        }
      }
    }
  }

  createSlope(): void {
    var length = this.duneLength;
    var sections = [];
    var s0 = {
      start: 0,
      end: 10,
      slope1: 40 * Math.PI / 180,
      slope2: 60 * Math.PI / 180
    }
    var s1 = {
      start: 10,
      end: 50,
      slope1: 60 * Math.PI / 180,
      slope2: 60 * Math.PI / 180
    }
    var s2 = {
      start: 50,
      end: 70,
      slope1: 60 * Math.PI / 180,
      slope2: 40 * Math.PI / 180
    }
    var s3 = {
      start: 70,
      end: 90,
      slope1: 40 * Math.PI / 180,
      slope2: 20 * Math.PI / 180
    }
    var s4 = {
      start: 90,
      end: 95,
      slope1: 20 * Math.PI / 180,
      slope2: 10 * Math.PI / 180
    }
    var s5 = {
      start: 90,
      end: this.duneLength,
      slope1: 10 * Math.PI / 180,
      slope2: 5 * Math.PI / 180
    }
    sections.push(s0);
    sections.push(s1);
    sections.push(s2);
    sections.push(s3);
    sections.push(s4);
    sections.push(s5);

    var dLength = this.duneLength / this.lengthSegments;
    var indexLen = this.duneGeometry.vertices.length;
    console.log("vertex len=" + indexLen);
    var zbase = 0;
    var ybase = -this.duneLength / 2;
    for (var ih = 1; ih <= this.lengthSegments; ih++) {
      var iLength = ih * dLength;
      var section = this.getSection(sections, iLength);
      for (var iw = 0; iw <= this.widthSegments; iw++) {
        var ivertex = indexLen - 1 - (iw + ih * (this.widthSegments + 1));
        var ivertexBase = indexLen - 1 - (iw + (ih - 1) * (this.widthSegments + 1));
        var vert = this.duneGeometry.vertices[ivertex];

        if (ih === 1) {
          console.log("vert: " + vert.x + ", " + vert.y + ", " + vert.z);
        }

        var vertBase = this.duneGeometry.vertices[ivertexBase];
        var slope = this.getSlope(section, iLength);

        var dz = dLength * Math.cos(slope) + zbase;
        //var dy = dLength * Math.sin(slope) + ybase;
        var dy = dLength * Math.sin(slope) + vertBase.y;
        vert.z = vert.z - dz;
        vert.y = dy;
        if (iw === this.widthSegments) {
          zbase = dz;
          ybase = dy;
        }

        /*
        var slope1 = Math.PI / 2 - slope;
        var l1 = Math.abs(vert.z * Math.tan(slope1));
        var za1 = vert.z / Math.cos(slope1);
        var zb1 = (dLength - l1) * Math.sin(slope1);
        var z1 = za1 + zb1;
        var y1 = (dLength - l1) * Math.cos(slope1);
        vert.y = vertBase.y - y1;
        //vert.z =  z1;
        */
      }
    }
  }

  getSection(sections: any[], x): any {
    for(var j = 0; j < sections.length; j++) {
      var s = sections[j];
      if (x >= s.start && x < s.end) {
        return s;
      }
    }
    return sections[sections.length - 1];
  }

  getSlope(section: any, x: number): number {
    var len = section.end - section.start;
    var d = x - section.start;
    var f = Math.abs(d / len);
    var slope = section.slope1 * (1 - f) + section.slope2 * f;
    return Math.abs(slope);
  }

  /*
  createOld(appScene: THREE.Scene) : void {
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
  */
}