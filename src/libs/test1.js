$(document).ready(function() {
  var container = document.getElementById( 'test' );
  if (container === null) {
    console.info("container null 1");
  } else {
    console.info("container got 1");
  }

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  var webGLRenderer = new THREE.WebGLRenderer();
  webGLRenderer.setClearColor(new THREE.Color(0xEEEEEE, 1.0));
  webGLRenderer.setSize(window.innerWidth, window.innerHeight);
  webGLRenderer.shadowMapEnabled = true;

  var cube = createMesh(new THREE.BoxGeometry(5, 5, 5), "brick-wall.jpg");
  cube.position.x = -12;
  scene.add(cube);
  console.log(cube.geometry.faceVertexUvs);

  // position and point the camera to the center of the scene
  camera.position.x = 00;
  camera.position.y = 12;
  camera.position.z = 28;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  var ambiLight = new THREE.AmbientLight(0x141414);
  scene.add(ambiLight);

  var light = new THREE.DirectionalLight();
  light.position.set(0, 30, 20);
  scene.add(light);

  // add the output of the renderer to the html element
  container.appendChild(webGLRenderer.domElement);

  // call the render function
  var step = 0;

  render();

  function createMesh(geom, imageFile) {
    var texture = THREE.ImageUtils.loadTexture("assets/textures/lake-water.jpg");
    var mat = new THREE.MeshPhongMaterial();
    mat.map = texture;

    var mesh = new THREE.Mesh(geom, mat);
    return mesh;
  }

        function render() {

            cube.rotation.y = step;
            cube.rotation.x = step;

            // render using requestAnimationFrame
            requestAnimationFrame(render);
            webGLRenderer.render(scene, camera);
        }
});