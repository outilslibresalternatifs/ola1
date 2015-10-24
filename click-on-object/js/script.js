var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var objects = [];

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
cube.userData = { URL: "./data/test.pdf"};
scene.add( cube );
objects.push( cube );

camera.position.z = 3;

document.addEventListener( 'mousedown', onDocumentMouseDown, false );

var projector = new THREE.Projector();



function onDocumentMouseDown( event ) {

    event.preventDefault();

    var vector = new THREE.Vector3(
        ( event.clientX / window.innerWidth ) * 2 - 1,
      - ( event.clientY / window.innerHeight ) * 2 + 1,
        0.5
    );
    vector.unproject(camera );

    var ray = new THREE.Raycaster( camera.position, 
                             vector.sub( camera.position ).normalize() );

    var intersects = ray.intersectObjects( scene.children );

    if ( intersects.length > 0 ) {
    	console.log(intersects[0]);
      intersects[0].object.material.color.set( 0xff0000 );
      window.open(intersects[0].object.userData.URL);
    }
}

function render() {
	requestAnimationFrame( render );
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	renderer.render( scene, camera );
}
render();