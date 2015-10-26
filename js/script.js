var FLOOR = -250;
var clock = new THREE.Clock(); // A high-performance timer used to calculate the time between rendering frames in order to smooth animation

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

// Camera moves with mouse, flies around with WASD/arrow keys
// var MOVESPEED = 1;
// var LOOKSPEED = 0.3;
var	controls = new THREE.FirstPersonControls(camera, window.document); // Handles camera control
controls.movementSpeed = 10; // How fast the player can walk around
controls.lookSpeed = 0.2; // How fast the player can look around with the mouse
// controls.lookVertical = false; // Don't allow the player to look up or down. This is a temporary fix to keep people from flying
controls.noFly = true; // Don't allow hitting R or F to go up or down


var powerplant;
var map;

var objects = [
	{filename:"ola-world"},
	{filename:"BirdMan"},
	{filename:"powerplant"},
	{filename:"chaise-sarah"},
	{filename:"hugo-totems"},
	{filename:"Ferdi"},
	{filename:"louis-marteau-electrique-final-2b"},
	{filename:"pantalonFinal-part1"},
	{filename:"pantalonFinal-part2"},
	{filename:"julien"},
	{filename:"dyson-sphere-3"},
	{filename:"hugo-totems"},
	{filename:"jules"},
	{filename:"julien"},
	{filename:"micro-realite_ivan_final"},
	{filename:"nelson"},
	{filename:"ObjetAbyBatti"},
	{filename:"micro-realite_ivan_final"},
	{filename:"tetducyclope4"},
];

// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 100;
// camera.position.x = 10;
camera.position.y = 10;
camera.rotation.x = 0.5;

//hemisphere light
// var hemisphereLight = new THREE.HemisphereLight(0xffffff,0xff0000,1);
// hemisphereLight.position.set(0, 0, 1).normalize();
// scene.add(hemisphereLight);
//directional light
var directionalLight1 = new THREE.DirectionalLight(0xffc16f,1);
directionalLight1.position.set(100, 100, 100).normalize();
scene.add(directionalLight1);
var directionalLight2 = new THREE.DirectionalLight(0x34b9e3,1);
directionalLight2.position.set(-100, 100, -100).normalize();
scene.add(directionalLight2);

var loader = new THREE.JSONLoader();
// loader.load( 'objects_old/ola-world.js', function ( geometry, materials ) {
// 	// console.log(geometry, materials);
//   map = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ color: 0xffffff}) );
//   scene.add(map);
//   // console.log(mesh);
// });
// loader.load( 'objects/ola-world.obj', 'objects/ola-world.mtl', function ( obj ) {
// 	// console.log(obj);
// 	obj.position.set( 0, 0, 0);
// 	scene.add( obj );
//
// });

function render() {
	requestAnimationFrame( render );

	// powerplant.rotation.y += 0.01;

	var delta = clock.getDelta();
	controls.update(delta); // Move camera

	renderer.render( scene, camera );
}

// var loader = new THREE.JSONLoader();
// loader.load( 'objects/'+objects[1]+'.js', function ( geometry, materials ) {
// 	// console.log(geometry, materials);
//   powerplant = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({ color: 0xffffff}) );
// 	powerplant.position.z = 100;
// 	powerplant.position.x = 100;
// 	scene.add(powerplant);
//   // console.log(mesh);
// });

var loader = new THREE.OBJMTLLoader();
var loadedObjects = 0;
var line = 1;
var col = 1;
for (var i = 0; i < objects.length; i++) {
	loader.load( 'objects/'+objects[i].filename+'.obj', 'objects/'+objects[i].filename+'.mtl', function ( obj ) {
		// console.log(obj);
		col++;
		if(col > 4){
			col = 1;
			line++;
		}
		var z = loadedObjects ? 2 : 0;
		obj.position.set( 40*line, z, 40*col);
    scene.add( obj );

		loadedObjects ++;
		if (loadedObjects == objects.length)
			render();
	});
}
