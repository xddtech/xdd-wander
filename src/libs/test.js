
$(document).ready(function() {

var tcontainer = document.getElementById( 'test' );
if (tcontainer === null) {
    console.info("container null 1");
} else {
    console.info("container got 1");
}

var tscene = new THREE.Scene();
tscene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 );

var tcamera = new THREE.PerspectiveCamera( 30, 1, 300, 0.1, 1000 );
tcamera.position.x = 0;
tcamera.position.y = 10;
tcamera.position.z = 50;
tscene.add( tcamera );

var tloader = new THREE.TextureLoader();
var tgroundTexture = tloader.load( "assets/textures/lake-water.jpg" );
tgroundTexture.wrapS = tgroundTexture.wrapT = THREE.RepeatWrapping;
tgroundTexture.repeat.set( 25, 25 );
tgroundTexture.anisotropy = 16;
var tgroundMaterial = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, map: tgroundTexture } );
var tmesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 500, 500 ), tgroundMaterial );
tmesh.position.y = - 40;
tmesh.rotation.x = - Math.PI / 2;
tmesh.receiveShadow = true;
tscene.add( tmesh );

var trenderer = new THREE.WebGLRenderer( { antialias: true } );
trenderer.setPixelRatio( window.devicePixelRatio );
trenderer.setSize( 500, 500 );
trenderer.setClearColor( tscene.fog.color );

if (tcontainer === null) {
    console.info("container null 2");
} else {
    console.info("container got 2");
}
tcontainer.appendChild( trenderer.domElement );

// controls
/*
var tcontrols = new THREE.OrbitControls( tcamera, trenderer.domElement );
tcontrols.maxPolarAngle = Math.PI * 0.5;
tcontrols.minDistance = 1000;
tcontrols.maxDistance = 7500;
*/

function testanimate() {
	requestAnimationFrame( testanimate );
	tcamera.lookAt( tscene.position );
	trenderer.render( tscene, tcamera );
}

testanimate();

}
);