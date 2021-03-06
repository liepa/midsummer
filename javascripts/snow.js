Christmasify["snow"] = {
  renderer: null,
  scene: null,
  camera: null,
  cameraTarget: null,
  cameraX: 0,
  cameraY: 0,
  cameraZ: 50.0,
  particleSystem: null,
  clock: null,
  controls: null,
  parameters: null,
  onParametersUpdate: null,
  animationFrame: null,

  init: function(selectorId) {
    if (document.addEventListener) document.addEventListener("visibilitychange", this.visibilityChanged);
    // this.initAnimation();

    var header = document.getElementById(selectorId);
    var particleSystemHeight = 100.0;

    if (window.WebGLRenderingContext) {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } else {
      this.renderer = new THREE.CanvasRenderer({ antialias: true, alpha: true });
    }

    this.renderer.setSize( header.clientWidth, header.clientHeight );

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
    this.cameraTarget = new THREE.Vector3( 0, 0, 0 );

    var loader = new THREE.TextureLoader();
    var texture = loader.load( './images/flower.png', {crossOrigin: true});

    var numParticles = 200,
      width = particleSystemHeight,
      height = particleSystemHeight,
      depth = 50,
      parameters = {
        color: 0xFFFFFF,
        height: particleSystemHeight,
        radiusX: 2.5,
        radiusZ: 2.5,
        size: 200,
        scale: 6.0,
        opacity: 1,
        speedH: 1.0,
        speedV: 1.0
      },
      systemGeometry = new THREE.Geometry(),
      systemMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color:  { type: 'c', value: new THREE.Color( parameters.color ) },
          height: { type: 'f', value: parameters.height },
          elapsedTime: { type: 'f', value: 0 },
          radiusX: { type: 'f', value: parameters.radiusX },
          radiusZ: { type: 'f', value: parameters.radiusZ },
          size: { type: 'f', value: parameters.size },
          scale: { type: 'f', value: parameters.scale },
          opacity: { type: 'f', value: parameters.opacity },
          texture: { type: 't', value: texture },
          speedH: { type: 'f', value: parameters.speedH },
          speedV: { type: 'f', value: parameters.speedV }
        },
        vertexShader: document.getElementById( 'christmasify_vertex' ).textContent,
        fragmentShader: document.getElementById( 'christmasify_fragment' ).textContent,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthTest: false
      });

    for( var i = 0; i < numParticles; i++ ) {
      var vertex = new THREE.Vector3(
          this.rand( width ),
          Math.random() * height,
          this.rand( depth )
        );

      systemGeometry.vertices.push( vertex );
    }

    this.particleSystem = new THREE.Points( systemGeometry, systemMaterial );
    this.particleSystem.position.y = -height/2;

    this.scene.add( this.particleSystem );

    this.clock = new THREE.Clock();

    this.renderer.domElement.style.top = -1.5 * header.clientHeight + 'px';
    header.appendChild( this.renderer.domElement );
    Christmasify.snow.animate();
  },

  visibilityChanged: function() {
    if (document.hidden) {
      cancelAnimationFrame( Christmasify.animationFrame );
    } else {
      Christmasify.animationFrame = requestAnimationFrame( Christmasify.snow.animate );
    }
  },

  initAnimation: function() {
    setTimeout(function(){
      Christmasify.snow.animate();
      jQuery('canvas').animate({top: 0}, 3000);
    }, 2500);
  },

  rand: function(v) {
    return (v * (Math.random() - 0.5));
  },

  animate: function() {
    Christmasify.animationFrame = requestAnimationFrame( Christmasify.snow.animate );

    var delta = Christmasify.snow.clock.getDelta(),
      elapsedTime = Christmasify.snow.clock.getElapsedTime();

    Christmasify.snow.particleSystem.material.uniforms.elapsedTime.value = elapsedTime * 10;

    Christmasify.snow.camera.position.set( Christmasify.snow.cameraX, Christmasify.snow.cameraY, Christmasify.snow.cameraZ );
    Christmasify.snow.camera.lookAt( Christmasify.snow.cameraTarget );

    Christmasify.snow.renderer.clear();
    Christmasify.snow.renderer.render( Christmasify.snow.scene, Christmasify.snow.camera );
  }
};
