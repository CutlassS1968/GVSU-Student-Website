/*
triangle-rotate.js
Erik Fredericks, c/o Ed Angel
This file does the actual drawing of the triangle
*/

// Global variables we'll need
var gl;
var points;

var x = 0.0;
var y = 0.0;
var xLoc, yLoc;
var xDir = 1.0;
var yDir = 1.0;

// This function executes our WebGL code AFTER the window is loaded.
// Meaning, that we wait for our canvas element to exist.
window.onload = function init() {
  // Grab the canvas object and initialize it
  var canvas = document.getElementById('gl-canvas');
  gl = WebGLUtils.setupWebGL(canvas);

  // Error checking
  if (!gl) { alert('WebGL unavailable'); }

  // triangle vertices
  var vertices = [
    vec2(-0.25, -0.25),
    vec2(0, 0.25),
    vec2(0.25, -0.25)
  ];

  // configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // load shaders and initialize attribute buffers
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);

  // Link shaders to application
  xLoc = gl.getUniformLocation(program, "x");
  yLoc = gl.getUniformLocation(program, "y");

  // load data into GPU
  var bufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // set its position and render it
  var vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  render();
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

// Render whatever is in our gl variable
function render() {

  // Update position
  x += 0.05 * xDir;
  y += 0.1 * yDir;

  // Add side collision
  if (y > 0.9) {
    y = 0.9;
    yDir *= -1.0;
  }

  if (x > 0.9) {
    x = 0.9;
    xDir *= -1.0;
  }

  if (y < -0.9) {
    y = -0.9;
    yDir *= -1.0;
  }

  if (x < -0.9) {
    x = -0.9;
    xDir *= -1.0;
  }

  // Letting HTML access x and y
  gl.uniform1f(xLoc, x);
  gl.uniform1f(yLoc, y);

  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  window.requestAnimFrame(render);
}