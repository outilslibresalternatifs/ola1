/**
 * Notes:
 * Code forked from http://www.isaacsukin.com/news/2012/06/how-build-first-person-shooter-browser-threejs-and-webglhtml5-canvas
 * Thanks a lot Isaac!
 * Notes:
 * - Coordinates are specified as (X, Y, Z) where X and Z are horizontal and Y is vertical
 */

 // Semi-constants
 var WIDTH = window.innerWidth,
   HEIGHT = window.innerHeight,
   ASPECT = WIDTH / HEIGHT,
   UNITSIZE = 250,
   WALLHEIGHT = 700,
   MOVESPEED = 100,
   LOOKSPEED = 0.075,
   NUMAI = 0,
   FLOORCOLOR = 0xd1d1d1,
   WALLCOLOR = 0xffffff,
   BGCOLOR = '#000000',
   LIGHTCOLOR = 0xffffff,
   FOGCOLOR = 0xffffff,
   PROJECTILEDAMAGE = 20,
   CAM_RADIUS = 100,
   CAM_STEP = .0001,
   INTERSECTED = null;

   var map = [ // 1  2  3  4  5  6  7  8  9
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 0
              [1, 0, 0, 0, 0, 0, 1, 0, 0, 1,], // 2
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 3
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 4
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 5
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 6
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 7
              [1, 0, 0, 0, 0, 0, 0, 0, 0, 1,], // 8
              [1, 1, 1, 1, 1, 1, 1, 1, 1, 1,], // 9
              ], mapW = map.length, mapH = map[0].length;



$(document).ready(function() {

  // Global vars
  var t = THREE, scene, cambox, cam, renderer, controls, clock, projector;
  var runAnim = true, mouse = { x: 0, y: 0 };
  var healthCube, lastHealthPickup = 0;
  var scene;
  var _walls = [];
  var _meshs = [];
  var currentTarget = 0;
  var isFirstPerson = true;
  var objects = [
    {
      filename:"teteducyclope.json",
      scale:60,
      position:{x:-800,y:40,z:-800},
      name:"Tête du cyclope",
      author:"Bruno",
      description:""
    },
    {
      filename:"fork.json",
      scale:20,
      position:{x:100,y:10,z:800},
      name:"Fork",
      author:"Raphaël",
      description:"Fourchette forquée"
    },
    {
      filename:"pantalon1.json",
      scale:20,
      position:{x:500,y:50,z:500},
      name:"Braguette féminine",
      author:"Louise Drulhe",
      description:"De la même manière que la braguette classique permet aux hommes de faire pipi au coin d’une rue sombre le soir, la braguette feminine donne aux femmes la possibilité de faire pipi sans baisser le pantalon. Il s’agit d’une ouverture d’une dizaine de centimètres entre les deux jambes. Une fois accroupi et la braguette feminine ouverte il ne reste plus qu’à faire pipi ! "
    },
    {
      filename:"pantalon2.json",
      scale:20,
      position:{x:500,y:50,z:500},
      name:"Braguette féminine",
      author:"Louise Drulhe",
      description:"De la même manière que la braguette classique permet aux hommes de faire pipi au coin d’une rue sombre le soir, la braguette feminine donne aux femmes la possibilité de faire pipi sans baisser le pantalon. Il s’agit d’une ouverture d’une dizaine de centimètres entre les deux jambes. Une fois accroupi et la braguette feminine ouverte il ne reste plus qu’à faire pipi ! "
    },
    {
      filename:"julien.json",
      scale:30,
      position:{x:300,y:0,z:0},
      name:"Formes",
      author:"Julien Gargot (mécène)",
      description:"Monstration de l’utilisation de différentes techniques d’outils sur cubes, objets par défaut de Blender. "
    },
    {
      filename:"nelson.json",
      scale:24,
      position:{x:-150,y:0,z:-300},
      name:"NanoHippoCameoTrisoRobot",
      author:"Nelson Steinmetz",
      description:"Un nano-robot caméléon-hippocampe en retard"
    },
    {
      filename:"dyson-sphere.json",
      scale:50,
      position:{x:600,y:300,z:0},
      name:"Sphère de Dyson en construction",
      author:"Vadim",
      description:"Inspirée par le comportement étrange de l’étoile KIC 8462852"
    },
    // chaise
    {
      filename:"chaise-sarah.json",
      scale:30,
      position:{x:400,y:10,z:-400},
      name:"Chaise plate",
      author:"Sarah Garcin",
      description:"Une chaise Louis XV posée à plat"
    },
    // geographie
    {
      filename:"geographie.json",
      scale:30,
      position:{x:200,y:90,z:-900},
      name:"Géoagraphie",
      author:"Mathilde",
      description:"Sans description"
    },
    // tower
    {
      filename:"hugo-totems.json",
      scale:20,
      position:{x:-400,y:10,z:100},
      name:"Trois petits totems",
      author:"hugohil",
      description:"Trois petits totems d'origine inconnue."
    },
    {
      filename:"AK-P/AK-P.json",
      scale:6,
      position:{x:-100,y:50,z:500},
      name:"AK-P",
      author:"leo",
      description:"Un outil polyvalent et approprié au prolétaire."
    },
    {
      filename:"birdman.json",
      scale:20,
      position:{x:100,y:300,z:800},
      name:"BirdMan",
      author:"Nolwenn Maudet",
      description:"Un BirdMan est un outil très pratique pour vous balader en ville. Accrochez vous à ses pattes et demandez-lui une direction, il vous amènera à destination. Plus sympa qu'un taxi, moins cher qu'un Uber, profitez d'une vue à 900° de votre ville et dites adieu aux ascenceurs !"
    },
    {
      filename:"powerplant.json",
      scale:3,
      position:{x:-800,y:0,z:-300},
      name:"Powerplant",
      author:"bachir soussi chiadmi",
      description:"énergie universelle"
    },
    {
      filename:"louis-marteau-electrique.json",
      scale:60,
      position:{x:-500,y:10,z:-300},
      name:"Machine à planter des clous",
      author:"Louis Eveillard",
      description:"D’après Gaston Lagaffe / Gala de Gaffes. Une machine pour planter un clou automatiquement. Nécessite 1 clou pour être fixée au mur au préalable."
    },
    {
      filename:"jules.json",
      scale:40,
      position:{x:-800,y:10,z:700},
      name:"Jules",
      author:"Nom de l'auteur",
      description:"Description de l'objet"
    },
    {
      filename:"micro-reality_ivan.js",
      scale:30,
      position:{x:-400,y:50,z:700},
      name:"Micro Reality",
      author:"Ivant Murit",
      description:"Dispositif pour casque deréalité virtuelle qui permet de se balader dans le contenu d'un vivarium à l'échelle *100. Les capteurs modélisent le contenu du vivarium (insectes, petits animeaux, terre, plantes) en temps réel et l'envois dans le casque de réalité virtuelle avec lequel on peu se ballader."
    },
    {
      filename:"ObjetAbyBatti.json",
      scale:30,
      position:{x:-300,y:5,z:-400},
      name:"Flighing bot",
      author:"Aby Battu",
      description:""
    }
  ];
  var _loaded_objects = 0;
  var _$splash =$('#splash');
  var _ola;
  var _$container = $('<div id="container">').appendTo('body');
    _$container.on("click",function(){
      $(this).hide();
    });
  var _$cartel = $('<div id="cartel">').appendTo(_$container);
    _$cartel.on("click",function(){
      e.stopPropagation();
    });
  var _mousePos = {x:0,y:0};

  'use strict';

  Physijs.scripts.worker = 'js/physijs/physijs_worker.js';
	Physijs.scripts.ammo = 'examples/js/ammo.js';

  function init() {
    console.log('init');
    _$splash.css({width: WIDTH, height: HEIGHT}).one('click', function(e) {
      console.log('click splash');
      e.preventDefault();
      init3dEnv();
    });
  };

  // Init3D
  function init3dEnv() {
    console.log('init3dEnv');
    clock = new t.Clock(); // Used in render() for controls.update()
    // scene = new t.Scene(); // Holds all objects in the canvas
    // scene.fog = new t.FogExp2(FOGCOLOR, 0.0005); // color, density
    scene = new Physijs.Scene;
    scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
    scene.addEventListener(
      'update',
      function() {
        scene.simulate(); // undefined, 2 
        // physics_stats.update();
      }
    );

    // initialize object to perform world/screen calculations
    projector = new t.Projector();

    // Set up camera
    cambox = new Physijs.BoxMesh(
      new t.SphereGeometry( 5, 8, 6 ),
      new t.MeshBasicMaterial( { vertexColors: 0xff0000, wireframe: true } ),
      0.3
    );
    cambox.position.x=0;
    cambox.position.y=200;
    cambox.position.z=-50;
    // cambox.position.y = UNITSIZE;
    cam = new t.PerspectiveCamera(60, ASPECT, 1, 10000); // FOV, aspect, near, far
    cambox.add(cam);
    scene.add(cambox);

    // Camera moves with mouse, flies around with WASD/arrow keys
    controls = new t.FirstPersonControls(cambox);
    controls.movementSpeed = MOVESPEED;
    controls.lookSpeed = LOOKSPEED;
    controls.lookVertical = true; // Temporary solution; play on flat surfaces only
    controls.noFly = false;
    controls.clickMove = true;

    // World objects
    setupScene();

    // Handle drawing as WebGL (faster than Canvas but less supported)
    renderer = new t.WebGLRenderer({
      antialasing: true
    });
    renderer.setSize(WIDTH, HEIGHT);
    //shadows
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMapType = t.PCFShadowMap;

    // Add the canvas to the document
    renderer.domElement.style.backgroundColor = BGCOLOR; // easier to see
    document.body.appendChild(renderer.domElement);

    // place camera
    cam.position.y = 75;
  } // end init3dEnv

  // Set up the objects in the world
  function setupScene() {
    var UNITSIZE = 250, units = mapW;

    // Geometry: floor
    // var floor = new t.Mesh(
    //     new t.CubeGeometry(units * UNITSIZE, 10, units * UNITSIZE),
    //     new t.MeshLambertMaterial( { color:FLOORCOLOR, shading: t.SmoothShading, side: t.DoubleSide } )
    // );
    var floor_material = Physijs.createMaterial(
			new t.MeshLambertMaterial({color:FLOORCOLOR,shading:t.SmoothShading,side:t.DoubleSide}),
			0, // high friction
			.4 // low restitution
		);
    var floor = new Physijs.BoxMesh(
      new t.CubeGeometry(units * UNITSIZE, 10, units * UNITSIZE),
      floor_material,
      0 // mass
		);
		floor.receiveShadow = true;
    scene.add(floor);
    // _walls.push(floor);

    // Geometry: walls
    var cube = new t.CubeGeometry(UNITSIZE, WALLHEIGHT, UNITSIZE);
    // var wall_material = new t.MeshLambertMaterial({color: WALLCOLOR});
    var wall_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({color: WALLCOLOR}),
			1, // high friction
			.4 // low restitution
		);

    for (var i = 0; i < mapW; i++) {
      for (var j = 0, m = map[i].length; j < m; j++) {
        if (map[i][j]) {
          var wall = new Physijs.BoxMesh(
            cube,
            wall_material,
            0
          );
          wall.position.x = (i - units/2) * UNITSIZE;
          wall.position.y = WALLHEIGHT/2;
          wall.position.z = (j - units/2) * UNITSIZE;
          wall.receiveShadow = true;
          scene.add(wall);
          _walls.push(wall);
        }
      }
    }

    // test
    var cube_geometry = new t.BoxGeometry( 5, 5, 5 );
    var cube_material = new t.MeshBasicMaterial( { color: 0x00ff00 } );
    var repere = new Physijs.BoxMesh(
      cube_geometry,
      cube_material,
      0.2
    );
    repere.position.set(0, WALLHEIGHT/2, 0);
    scene.add( repere );


    // ola
    var loader = new t.JSONLoader();
    var gouraudMaterial = new t.MeshLambertMaterial({
      color:0xFFFFFF,
      shading: t.SmoothShading,
      side: t.DoubleSide
    });
    loader.load( "objects/ola-logo.json", function(geometry) {
      _ola = new t.Mesh( geometry, gouraudMaterial);
      _ola.scale.set(50,50,50);
      // _ola.position.set(obj.position);
      _ola.position.x = 0;
      _ola.position.y = 10;
      _ola.position.z = 0;
      _ola.castShadow = true;
      _ola.receiveShadow = false;
      scene.add(_ola);
    });

    // add lights
    sceneAddLights(units);

    // workshop objects
    // when all objects are loaded the nav will start
    for (var i = 0; i < objects.length; i++) {
      loadObject(objects[i],loader,gouraudMaterial);
    }

  };

  function sceneAddLights(units){

    // Lighting
    var floorw = (units * UNITSIZE *0.8);

    // var geometry = new t.BoxGeometry( 5, 5, 5 );
    // var material = new t.MeshBasicMaterial( { color: 0x00ff00 } );
    // var repere = new t.Mesh( geometry, material );
    // repere.position.set(floorw/2, WALLHEIGHT/2, floorw/2);
    // scene.add( repere );

    var light = new t.DirectionalLight(0xffffff,0.4);
    light.position.set( 0, WALLHEIGHT/2, 0 );
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    // light.shadowDarkness = 0.9;
    light.shadowCameraVisible = true;
    light.shadowBias = -.01;
    light.shadowMapWidth = floorw*10;
    light.shadowMapHeight = floorw*10;

    light.shadowCameraNear = 0;
    light.shadowCameraFar = 100;

    light.shadowCameraLeft = -50;
    light.shadowCameraRight = 50;
    light.shadowCameraTop = -50;15
    light.shadowCameraBottom = 50;

    scene.add( light );

    var directionalLight1 = new t.DirectionalLight( 0x0000ff, 0.7 );
    directionalLight1.position.set( 0, WALLHEIGHT/2, floorw/2 );
    scene.add( directionalLight1 );

    var directionalLight2 = new t.DirectionalLight( 0x00ff00, 0.7 );
    directionalLight2.position.set( floorw/2, WALLHEIGHT/2, 0 );
    scene.add( directionalLight2 );
    //
    var directionalLight3 = new t.DirectionalLight( 0xffff00, 0.7 );
    directionalLight3.position.set( 0, WALLHEIGHT/2, -floorw/2 );
    scene.add( directionalLight3 );
    //
    var directionalLight4 = new t.DirectionalLight( 0xff00ff, 0.7 );
    directionalLight4.position.set( -floorw/2, WALLHEIGHT/2, 0 );
    scene.add( directionalLight4 );

    // OLD
    // var lightbox = units*0.5;
    // var light = new t.HemisphereLight(0x85bdff, 0xffffff,1);
    // light.position.set( units/2, 500, units/2 );
    // scene.add( light );
    // var directionalLight1 = new t.DirectionalLight( 0xffffff, 0.5 );
    // directionalLight1.position.set( 0, 15, 0 );
    // scene.add( directionalLight1 );
    // var directionalLight2 = new t.DirectionalLight( 0x0000ff, 0.5 );
    // directionalLight2.position.set( 0, 15, lightbox );
    // scene.add( directionalLight2 );
    // var directionalLight3 = new t.DirectionalLight( 0xff00ff, 0.5 );
    // directionalLight3.position.set( lightbox, 15, lightbox );
    // scene.add( directionalLight3 );
    // var directionalLight4 = new t.DirectionalLight( 0xffff00, 0.5 );
    // directionalLight4.position.set( lightbox, 15, 0 );
    // scene.add( directionalLight4 );
  };

  function loadObject(obj,loader,gouraudMaterial){
    loader.load( "objects/"+obj.filename, function(geometry) {
      var mesh = new t.Mesh( geometry, gouraudMaterial);
      mesh.scale.set(obj.scale,obj.scale,obj.scale);
      // mesh.position.set(obj.position);
      mesh.position.x = obj.position.x;
      mesh.position.y = obj.position.y;
      mesh.position.z = obj.position.z;
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      // customs
      mesh.userData = {URL:"./objects/"+obj.filename};
      mesh.name = obj.name;
      mesh.author = obj.author;
      mesh.description = obj.description;
      scene.add( mesh );
      _meshs.push(mesh);

      updateLoader();
    });
  };

  function updateLoader(){
    _loaded_objects++;
    $('#splash .loaded').css({
      'width':(_loaded_objects*100)/objects.length +"%"
    });
    if(_loaded_objects == objects.length){
      requestAnimationFrame( render );
      scene.simulate();
      setTimeout(function(){
        _$splash.fadeOut();
      },1000);
    }
  };

  // Update and display
  function render(millis) {
    requestAnimationFrame(render);

    var delta = clock.getDelta();
    var aispeed = delta * MOVESPEED;
    if(isFirstPerson){
      controls.update(delta); // Move camera
    } else {
      updateCamera(millis);
    }

    _ola.rotation.y += 0.005;
    // _meshs[6].rotation.y += 0.005;

    checkCollisions();

    // check objects pointed by mouse to show corresponding cartel
    checkIntersect();

    renderer.render(scene, cam); // Repaint
  };

  function checkCollisions(){

  };

  function checkIntersect(){
    // create a Ray with origin at the mouse position
    // and direction into the scene (camera direction)
    var vector = new t.Vector3( _mousePos.x, _mousePos.y, 1 );
    vector.unproject(cam);
    var ray = new t.Raycaster( cam.position, vector.sub( cam.position ).normalize() );

    // create an array containing all objects in the scene with which the ray intersects
    var intersects_objects = ray.intersectObjects( _meshs ); //scene.children

    // if there is one (or more) intersections
    if ( intersects_objects.length > 0 ){
      // if the closest object intersected is not the currently stored intersection object
      if ( intersects_objects[0].object != INTERSECTED && (INTERSECTED && INTERSECTED.name != intersects_objects[0].object.name)){
        // store reference to closest object as current intersection object
        INTERSECTED = intersects_objects[0].object;

        if ( INTERSECTED.name ){
          fillCartel(INTERSECTED);
          showCartel();
        }else{
          hideCartel();
        }
      }
    }else{ // there are no intersections
      hideCartel();
      INTERSECTED = null;
    }
  };

  /*
  * autopilot
  */
  function updateCamera (millis){
    var target = _meshs[currentTarget];
    cam.position.x = (target.position.x + CAM_RADIUS) * Math.cos(millis * CAM_STEP);
    cam.position.z = (target.position.z + CAM_RADIUS) * Math.sin(millis * CAM_STEP);
    cam.lookAt(target.position);

    // every 10s (more or less ...)
    if(millis % 15 < .017){
      currentTarget = nextTarget();
      fillCartel(_meshs[currentTarget]);
      showCartel();
    }
  }

  function nextTarget (){
    return ((currentTarget + 1) >= _meshs.length) ? 0 : currentTarget + 1;
  }

  /*
  * Cartels
  */
  function fillCartel (object){
    // console.log('fillCartel', object);
    _$cartel.empty();
    var content = "<h2>"+object.name+"</h2><h3>"+object.author+"</h3><p>"+object.description+"</p><a href='"+object.userData.URL+"' alt='"+object.name+"'>Fichier source</a>";
    _$cartel.append(content);
  }

  function showCartel (){
    _$container.css('display', 'block');
  }

  function hideCartel (){
    _$container.css('display', 'none');
  }

  /*
  * events
  */

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
  //
  document.addEventListener('keyup', function (event){
    console.log(event.keyCode);
    switch ( event.keyCode ) {
      case 65: // A key (for autopilot)
        isFirstPerson = !isFirstPerson;
        if(!isFirstPerson){
          currentTarget = nextTarget();
          fillCartel(_meshs[currentTarget]);
          showCartel();
        } else {
          hideCartel();
        }
        break;
    }
  });

  $('body').on('mousemove', function(event) {
    _mousePos.x = (event.clientX / window.innerWidth) *2 -1;
    _mousePos.y = -(event.clientY / window.innerHeight) *2 +1;
  });

  init();
});
