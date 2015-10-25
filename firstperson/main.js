/**
 * Notes:
 * Code forked from http://www.isaacsukin.com/news/2012/06/how-build-first-person-shooter-browser-threejs-and-webglhtml5-canvas
 * Thanks a lot Isaac!
 * Notes:
 * - Coordinates are specified as (X, Y, Z) where X and Z are horizontal and Y is vertical
 */

var map = [ // 1  2  3  4  5  6  7  8  9
           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 0
           [1, 0, 0, 1, 0, 0, 0, 0, 0, 1,], // 2
           [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 3
           [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 4
           [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 5
           [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 6
           [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 7
           [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 8
           [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
           ], mapW = map.length, mapH = map[0].length;

// Semi-constants
var WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  ASPECT = WIDTH / HEIGHT,
  UNITSIZE = 250,
  WALLHEIGHT = 700,
  MOVESPEED = 100,
  LOOKSPEED = 0.075,
  BULLETMOVESPEED = MOVESPEED * 5,
  NUMAI = 0,
  FLOORCOLOR = 0x888888,
  WALLCOLOR = 0xffffff,
  BGCOLOR = '#ff0000',
  LIGHTCOLOR = 0xffffff,
  FOGCOLOR = 0xffffff,
  PROJECTILEDAMAGE = 20,
  CAM_RADIUS = 100,
  CAM_STEP = .0005;

// Global vars
var t = THREE, scene, cam, renderer, controls, clock, projector, model, skin;
var runAnim = true, mouse = { x: 0, y: 0 }, kills = 0, health = 100;
var healthCube, lastHealthPickup = 0;
var scene;
var objectPositions = [];
var currentTarget = 0;
var isFirstPerson = true;
var objects = [];

$(document).ready(function() {
  $('body').append('<div id="intro">Le Palais des Outils Loufoques</div>');
  $('#intro').css({width: WIDTH, height: HEIGHT}).one('click', function(e) {
    e.preventDefault();
    $(this).fadeOut();
    init();
    animate();
  });
});

// Setup
function init() {
  clock = new t.Clock(); // Used in render() for controls.update()
  projector = new t.Projector(); // Used in bullet projection
  scene = new t.Scene(); // Holds all objects in the canvas
  scene.fog = new t.FogExp2(FOGCOLOR, 0.0005); // color, density

  // Set up camera
  cam = new t.PerspectiveCamera(60, ASPECT, 1, 10000); // FOV, aspect, near, far
  cam.position.y = UNITSIZE * .2;
  scene.add(cam);

  // Camera moves with mouse, flies around with WASD/arrow keys
  controls = new t.FirstPersonControls(cam);
  controls.movementSpeed = MOVESPEED;
  controls.lookSpeed = LOOKSPEED;
  controls.lookVertical = true; // Temporary solution; play on flat surfaces only
  controls.noFly = true;

  // World objects
  setupScene();

  // Handle drawing as WebGL (faster than Canvas but less supported)
  renderer = new t.WebGLRenderer({antialasing: true});
  renderer.setSize(WIDTH, HEIGHT);

  // Add the canvas to the document
  renderer.domElement.style.backgroundColor = BGCOLOR; // easier to see
  document.body.appendChild(renderer.domElement);

  // Track mouse position so we know where to shoot
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  //Click on object
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );

  // Shoot on click
  $(document).click(function(e) {
    e.preventDefault;
    if (e.which === 1) { // Left click only
      //createBullet();
    }
  });

  $("#container").on("click",function(){
    $("#container").hide();
  });

  $("#cartel").on("click", function(e){
    e.stopPropagation();
  });


  // Display HUD
  // $('body').append('<canvas id="radar" width="100" height="100"></canvas>');

  // Importer
  var loader = new THREE.JSONLoader();
  var gouraudMaterial = new THREE.MeshLambertMaterial( { color:0xFFFFFF, shading: THREE.SmoothShading, side: THREE.DoubleSide } );

  // FORK
  loader.load( "objects/fork.json", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial);
    mesh.scale.set(10,10,10);
    mesh.position.x = 20;
    mesh.position.y = 0;
    mesh.position.z = -200;
    mesh.userData = { URL: "./objects/fork.json"};
    mesh.name = "Fork";
    mesh.author = "Raphaël";
    mesh.description = "Fourchette forquée";
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });
  // pantalon
  loader.load( "objects/pantalon.json", function( geometry) {
    mesh = new THREE.Mesh( geometry,gouraudMaterial );
    mesh.scale.set(4,4,4);
    mesh.position.x = 100;
    mesh.position.y = 50;
    mesh.position.z = 0;
    mesh.userData = { URL: "./objects/pantalon.json"};
    mesh.name = "Braguette féminine";
    mesh.author = "Louise Drulhe";
    mesh.description = "De la même manière que la braguette classique permet aux hommes de faire pipi au coin d’une rue sombre le soir, la braguette feminine donne aux femmes la possibilité de faire pipi sans baisser le pantalon. 
Il s’agit d’une ouverture d’une dizaine de centimètres entre les deux jambes. Une fois accroupi et la braguette feminine ouverte il ne reste plus qu’à faire pipi ! ";
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });
  // pantalon2
  loader.load( "objects/pantalon2.json", function( geometry) {
    mesh = new THREE.Mesh( geometry,new THREE.MeshLambertMaterial( { color:0xcccccc, shading: THREE.SmoothShading, side: THREE.DoubleSide } ) );
    mesh.scale.set(4,4,4);
    mesh.position.x = 100;
    mesh.position.y = 50;
    mesh.position.z = 0;
    mesh.userData = { URL: "./objects/pantalon2.json"};
    mesh.name = "Braguette féminine";
    mesh.author = "Louise Drulhe";
    mesh.description = "De la même manière que la braguette classique permet aux hommes de faire pipi au coin d’une rue sombre le soir, la braguette feminine donne aux femmes la possibilité de faire pipi sans baisser le pantalon. 
Il s’agit d’une ouverture d’une dizaine de centimètres entre les deux jambes. Une fois accroupi et la braguette feminine ouverte il ne reste plus qu’à faire pipi ! ";
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });
  // julien
  loader.load( "objects/julien.json", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial );
    mesh.scale.set(4,4,4);
    mesh.position.x = 400;
    mesh.position.y = 50;
    mesh.position.z = 0;
    mesh.userData = { URL: "./objects/julien.json"};
    mesh.name = "Formes";
    mesh.author = "Julien Gargot (mécène)";
    mesh.description = "Monstration de l’utilisation de différentes techniques d’outils sur cubes, objets par défaut de Blender. ";
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });

  // nelson
  loader.load( "objects/nelson.json", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial);
    mesh.scale.set(24.5,24.5,24.5);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 6;
     mesh.userData = { URL: "./objects/nelson.json"};
    mesh.name = "NanoHippoCameoTrisoRobot";
    mesh.author = "Nelson Steinmetz";
    mesh.description = "Un nano-robot caméléon-hippocampe en retard";
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  // dyson
  loader.load( "objects/dyson.json", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial );
    mesh.scale.set(4,4,4);
    mesh.position.x = -400;
    mesh.position.y = 50;
    mesh.position.z = 0;
    mesh.userData = { URL: "./objects/dyson.json"};
    mesh.name = "Sphère de Dyson en construction";
    mesh.author = "Vadim";
    mesh.description = "Inspirée par le comportement étrange de l’étoile KIC 8462852";
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });
  // chaise
  loader.load( "objects/chaise.json", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial );
    mesh.scale.set(6,6,4);
    mesh.position.x = 300;
    mesh.position.y = 30;
    mesh.position.z = 0;
     mesh.userData = { URL: "./objects/chaise.json"};
    mesh.name = "Chaise plate";
    mesh.author = "Sarah Garcin";
    mesh.description = "Une chaise Louis XV posée à plat";
    mesh.position.z = -500;
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });
  // geographie
  loader.load( "objects/geographie.json", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial );
    mesh.scale.set(4,4,4);
    mesh.position.x = -600;
    mesh.position.y = 50;
    mesh.position.z = 0;
     mesh.userData = { URL: "./objects/geographie.json"};
    mesh.name = "Géoagraphie";
    mesh.author = "Mathilde";
    mesh.description = "Sans description";
    mesh.position.z = 400;
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });
  // tower
  loader.load( "objects/hugo-totems.js", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial );
    mesh.scale.set(10,10,10);
    mesh.position.x = 600;
    mesh.position.y = 10;
    mesh.position.z = -500;
     mesh.userData = { URL: "./objects/hugo-totems.json"};
    mesh.name = "Trois petits totems";
    mesh.author = "hugohil";
    mesh.description = "Trois petits totems d'origine inconnue.";
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });

  // AKP
  loader.load( "objects/AK-P.json", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial );
    mesh.scale.set(3,3,3);
    mesh.position.x = 100;
    mesh.position.y = 50;
    mesh.position.z = 200;
     mesh.userData = { URL: "./objects/AK-P.json"};
    mesh.name = "AK-P";
    mesh.author = "leo";
    mesh.description = "Un outil polyvalent et approprié au prolétaire.";
    mesh.position.z = 700;
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });

  // birdman
  loader.load( "objects/birdman.json", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial );
    mesh.scale.set(3,3,3);
    mesh.position.x = 100;
    mesh.position.y = 50;
    mesh.position.z = 200;
     mesh.userData = { URL: "./objects/birdman.json"};
    mesh.name = "BirdMan";
    mesh.author = "Nolwenn Maudet";
    mesh.description = "Un BirdMan est un outil très pratique pour vous balader en ville. Accrochez vous à ses pattes et demandez-lui une direction, il vous amènera à destination. Plus sympa qu'un taxi, moins cher qu'un Uber, profitez d'une vue à 900° de votre ville et dites adieu aux ascenceurs !";
    mesh.position.z = 700;
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });

  // powerplant
  loader.load( "objects/powerplant.json", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial );
    mesh.scale.set(3,3,3);
    mesh.position.x = 100;
    mesh.position.y = 50;
    mesh.position.z = 200;
     mesh.userData = { URL: "./objects/powerplant.json"};
    mesh.name = "Powerplant";
    mesh.author = "bachir soussi chiadmi";
    mesh.description = "énergie universelle";
    mesh.position.z = 700;
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });

  // Louis
  loader.load( "objects/louis.json", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial );
    mesh.scale.set(3,3,3);
    mesh.position.x = 100;
    mesh.position.y = 50;
    mesh.position.z = 200;
     mesh.userData = { URL: "./objects/louis.json"};
    mesh.name = "Machine à planter des clous";
    mesh.author = "Louis Eveillard";
    mesh.description = "D’après Gaston Lagaffe / Gala de Gaffes. Une machine pour planter un clou automatiquement. Nécessite 1 clou pour être fixée au mur au préalable.";
    mesh.position.z = 700;
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });

  // Jules
  loader.load( "objects/jules.js", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial );
    mesh.scale.set(3,3,3);
    mesh.position.x = 100;
    mesh.position.y = 50;
    mesh.position.z = 200;
     mesh.userData = { URL: "./objects/jules.js"};
    mesh.name = "Jules";
    mesh.author = "Nom de l'auteur";
    mesh.description = "Description de l'objet";
    mesh.position.z = 700;
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });


  // Jules
  loader.load( "objects/micro-reality_ivan.js", function( geometry) {
    mesh = new THREE.Mesh( geometry, gouraudMaterial );
    mesh.scale.set(3,3,3);
    mesh.position.x = 100;
    mesh.position.y = 50;
    mesh.position.z = 200;
     mesh.userData = { URL: "./objects/micro-reality_ivan.js"};
    mesh.name = "Jules";
    mesh.author = "Nom de l'auteur";
    mesh.description = "Description de l'objet";
    mesh.position.z = 700;
    scene.add( mesh );
    objectPositions.push(mesh);
    objects.push(mesh);
  });
  cam.position.y = 75;
} // end Init

// Helper function for browser frames
function animate(millis) {
  if (runAnim) {
    requestAnimationFrame(animate);
  }
  render(millis);
}

function updateCamera (millis){
  var target = objectPositions[currentTarget];
  cam.position.x = (target.position.x + CAM_RADIUS) * Math.cos(millis * CAM_STEP);
  cam.position.z = (target.position.z + CAM_RADIUS) * Math.sin(millis * CAM_STEP);
  cam.lookAt(target.position);

  // every 10s (more or less ...)
  if(millis % 10 < .017){
    currentTarget = nextTarget();
    fillCartel(objectPositions[currentTarget]);
  }
}

function nextTarget (){
  return ((currentTarget + 1) >= objectPositions.length) ? 0 : currentTarget + 1;
}

function showCartel (){
  var container = document.getElementById("container");
  var $cartel = $("#cartel");
  container.style.display = 'block';
}

function hideCartel (){
  var container = document.getElementById("container");
  var $cartel = $("#cartel");
  container.style.display = 'none';
}

function fillCartel (object){
  var container = document.getElementById("container");
  var $cartel = $("#cartel");
  $cartel.empty();
  var content = "<h2>"+object.name+"</h2><h3>"+object.author+"</h3><p>"+object.description+"</p><a href='"+object.userData.URL+"' alt='"+object.name+"'>Fichier source</a>";
  $cartel.append(content);
}

document.addEventListener('keyup', function (event){
  if(event.keyCode == 70){ // 70 = F key
    isFirstPerson = !isFirstPerson;
    if(!isFirstPerson){
      showCartel();
      currentTarget = nextTarget();
      fillCartel(objectPositions[currentTarget]);
    } else {
      hideCartel();
    }
  }
});

// Update and display
function render(millis) {
  var delta = clock.getDelta(), speed = delta * BULLETMOVESPEED;
  var aispeed = delta * MOVESPEED;
  if(isFirstPerson){
    controls.update(delta); // Move camera
  } else {
    updateCamera(millis);
  }

  // Rotate the health cube
  healthcube.rotation.x += 0.004
  healthcube.rotation.y += 0.008;
  // Allow picking it up once per minute
  if (Date.now() > lastHealthPickup + 60000) {
    if (distance(cam.position.x, cam.position.z, healthcube.position.x, healthcube.position.z) < 15 && health != 100) {
      health = Math.min(health + 50, 100);
      $('#health').html(health);
      lastHealthPickup = Date.now();
    }
    healthcube.material.wireframe = false;
  }
  else {
    healthcube.material.wireframe = true;
  }

  // Update bullets. Walk backwards through the list so we can remove items.
  for (var i = bullets.length-1; i >= 0; i--) {
    var b = bullets[i], p = b.position, d = b.ray.direction;
    if (checkWallCollision(p)) {
      bullets.splice(i, 1);
      scene.remove(b);
      continue;
    }
    // Collide with AI
    var hit = false;
    for (var j = ai.length-1; j >= 0; j--) {
      var a = ai[j];
      var v = a.geometry.vertices[0];
      var c = a.position;
      var x = Math.abs(v.x), z = Math.abs(v.z);
      //console.log(Math.round(p.x), Math.round(p.z), c.x, c.z, x, z);
      if (p.x < c.x + x && p.x > c.x - x &&
          p.z < c.z + z && p.z > c.z - z &&
          b.owner != a) {
        bullets.splice(i, 1);
        scene.remove(b);
        a.health -= PROJECTILEDAMAGE;
        var color = a.material.color, percent = a.health / 100;
        a.material.color.setRGB(
            percent * color.r,
            percent * color.g,
            percent * color.b
        );
        hit = true;
        break;
      }
    }
    // Bullet hits player
    if (distance(p.x, p.z, cam.position.x, cam.position.z) < 25 && b.owner != cam) {
      $('#hurt').fadeIn(75);
      health -= 10;
      if (health < 0) health = 0;
      val = health < 25 ? '<span style="color: darkRed">' + health + '</span>' : health;
      $('#health').html(val);
      bullets.splice(i, 1);
      scene.remove(b);
      $('#hurt').fadeOut(350);
    }
    if (!hit) {
      b.translateX(speed * d.x);
      //bullets[i].translateY(speed * bullets[i].direction.y);
      b.translateZ(speed * d.z);
    }
  }
  renderer.render(scene, cam); // Repaint

}

// Set up the objects in the world
function setupScene() {
  var UNITSIZE = 250, units = mapW;

  // Geometry: floor
  var floor = new t.Mesh(
      new t.CubeGeometry(units * UNITSIZE, 10, units * UNITSIZE),
      new THREE.MeshLambertMaterial( { color:FLOORCOLOR, shading: THREE.SmoothShading, side: THREE.DoubleSide } )
  );
  scene.add(floor);

  // Geometry: walls
  var cube = new t.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
  var materials = [

 new t.MeshLambertMaterial({color: WALLCOLOR})];
  for (var i = 0; i < mapW; i++) {
    for (var j = 0, m = map[i].length; j < m; j++) {
      if (map[i][j]) {
        var wall = new t.Mesh(cube, materials[map[i][j]-1]);
        wall.position.x = (i - units/2) * UNITSIZE;
        wall.position.y = WALLHEIGHT/2;
        wall.position.z = (j - units/2) * UNITSIZE;
        scene.add(wall);
      }
    }
  }

  // Health cube
  healthcube = new t.Mesh(
      new t.CubeGeometry(30, 30, 30),
      new t.MeshBasicMaterial({map: t.ImageUtils.loadTexture('images/health.png')})
  );
  healthcube.position.set(-UNITSIZE-15, 35, -UNITSIZE-15);
  //scene.add(healthcube);

  // Lighting
  var directionalLight1 = new t.DirectionalLight( 0xffffff, 1 );
  directionalLight1.position.set( 0, 100, 0 );
  scene.add( directionalLight1 );
  var directionalLight2 = new t.DirectionalLight( 0x0000ff, 0.8 );
  directionalLight2.position.set( 100, 100, 300 );
  scene.add( directionalLight2 );
  var directionalLight2 = new t.DirectionalLight( 0xff00ff, 0.8 );
  directionalLight2.position.set( 100, 100, -300 );
  scene.add( directionalLight2 );
  var directionalLight3 = new t.DirectionalLight( 0xffff00, 0.8 );
  directionalLight3.position.set( -700, 300, -100 );
  scene.add( directionalLight3 );
}


// MOBS

var ai = [];
var aiGeo = new t.CubeGeometry(40, 40, 40);
function setupAI() {
  for (var i = 0; i < NUMAI; i++) {
    addAI();
  }
}

function addAI() {
  var c = getMapSector(cam.position);
  var aiMaterial = new t.MeshBasicMaterial({/*color: 0xEE3333,*/map: t.ImageUtils.loadTexture('images/face.png')});
  var o = new t.Mesh(aiGeo, aiMaterial);
  do {
    var x = getRandBetween(0, mapW-1);
    var z = getRandBetween(0, mapH-1);
  } while (map[x][z] > 0 || (x == c.x && z == c.z));
  x = Math.floor(x - mapW/2) * UNITSIZE;
  z = Math.floor(z - mapW/2) * UNITSIZE;
  o.position.set(x, UNITSIZE * 0.15, z);
  o.health = 100;
  //o.path = getAIpath(o);
  o.pathPos = 1;
  o.lastRandomX = Math.random();
  o.lastRandomZ = Math.random();
  o.lastShot = Date.now(); // Higher-fidelity timers aren't a big deal here.
  ai.push(o);
  scene.add(o);
}

function getAIpath(a) {
  var p = getMapSector(a.position);
  do { // Cop-out
    do {
      var x = getRandBetween(0, mapW-1);
      var z = getRandBetween(0, mapH-1);
    } while (map[x][z] > 0 || distance(p.x, p.z, x, z) < 3);
    var path = findAIpath(p.x, p.z, x, z);
  } while (path.length == 0);
  return path;
}

function findAIpath(sX, sZ, eX, eZ) {
  var backupGrid = grid.clone();
  var path = finder.findPath(sX, sZ, eX, eZ, grid);
  grid = backupGrid;
  return path;
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

function getMapSector(v) {
  var x = Math.floor((v.x + UNITSIZE / 2) / UNITSIZE + mapW/2);
  var z = Math.floor((v.z + UNITSIZE / 2) / UNITSIZE + mapW/2);
  return {x: x, z: z};
}

function checkWallCollision(v) {
  var c = getMapSector(v);
  return map[c.x][c.z] > 0;
}


var bullets = [];
var sphereMaterial = new t.MeshBasicMaterial({color: 0x333333});
var sphereGeo = new t.SphereGeometry(2, 6, 6);
function createBullet(obj) {
  if (obj === undefined) {
    obj = cam;
  }
  var sphere = new t.Mesh(sphereGeo, sphereMaterial);
  sphere.position.set(obj.position.x, obj.position.y * 0.8, obj.position.z);

  if (obj instanceof t.Camera) {
    var vector = new t.Vector3(mouse.x, mouse.y, 1);
    projector.unprojectVector(vector, obj);
    sphere.ray = new t.Ray(
        obj.position,
        vector.subSelf(obj.position).normalize()
    );
  }
  else {
    var vector = cam.position.clone();
    sphere.ray = new t.Ray(
        obj.position,
        vector.subSelf(obj.position).normalize()
    );
  }
  sphere.owner = obj;
  bullets.push(sphere);
  scene.add(sphere);
  return sphere;
}

//Au click sur un objet
function onDocumentMouseDown(event) {

  event.preventDefault();

  //affiche le cartel
  var container = document.getElementById("container");
  var $cartel = $("#cartel");

  var vector = new THREE.Vector3(
      ( event.clientX / window.innerWidth ) * 2 - 1,
    - ( event.clientY / window.innerHeight ) * 2 + 1,
      0.5
  );
  vector.unproject(cam);

  var ray = new THREE.Raycaster( cam.position,
                           vector.sub( cam.position ).normalize() );

  var intersects = ray.intersectObjects(objects);

  if ( intersects.length > 0 ) {
    container.style.display= "block";
    $cartel.empty();
    var content = "<h2>"+intersects[0].object.name+"</h2><h3>"+intersects[0].object.author+"</h3><p>"+intersects[0].object.description+"</p><a href='"+intersects[0].object.userData.URL+"' alt='"+intersects[0].object.name+"'>Fichier source</a>";
    $cartel.append(content);
  }
}




function onDocumentMouseMove(e) {
  e.preventDefault();
  mouse.x = (e.clientX / WIDTH) * 2 - 1;
  mouse.y = - (e.clientY / HEIGHT) * 2 + 1;
}

// Handle window resizing
$(window).resize(function() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  ASPECT = WIDTH / HEIGHT;
  if (cam) {
    cam.aspect = ASPECT;
    cam.updateProjectionMatrix();
  }
  if (renderer) {
    renderer.setSize(WIDTH, HEIGHT);
  }
  $('#intro, #hurt').css({width: WIDTH, height: HEIGHT,});
});

// Stop moving around when the window is unfocused (keeps my sanity!)
$(window).focus(function() {
  if (controls) controls.freeze = false;
});
$(window).blur(function() {
  if (controls) controls.freeze = true;
});

//Get a random integer between lo and hi, inclusive.
//Assumes lo and hi are integers and lo is lower than hi.
function getRandBetween(lo, hi) {
 return parseInt(Math.floor(Math.random()*(hi-lo+1))+lo, 10);
}
