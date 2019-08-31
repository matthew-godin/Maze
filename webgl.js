var cubeRotation = 0.0;
var camRotationX = 0.0, camRotationY = 0.0;
var ZTranslation = 0.0, XTranslation = 0.0;
var WDown = false, ADown = false, SDown = false, DDown = false, aRight = false, aLeft = false, aUp = false, aDown = false;

main();


function logKeyDown(e) {
  if (e.code == "KeyA") {
    ADown = true;
  } else if (e.code == "KeyW") {
    WDown = true;
  } else if (e.code == "KeyS") {
    SDown = true;
  } else if (e.code == "KeyD") {
    DDown = true;
  } else if (e.code == "ArrowLeft") {
    aLeft = true;
  } else if (e.code == "ArrowRight") {
    aRight = true;
  } else if (e.code == "ArrowDown") {
    aDown = true;
  } else if (e.code == "ArrowUp") {
    aUp = true;
  }
}

function logKeyUp(e) {
  if (e.code == "KeyA") {
    ADown = false;
  } else if (e.code == "KeyW") {
    WDown = false;
  } else if (e.code == "KeyS") {
    SDown = false;
  } else if (e.code == "KeyD") {
    DDown = false;
  } else if (e.code == "ArrowLeft") {
    aLeft = false;
  } else if (e.code == "ArrowRight") {
    aRight = false;
  } else if (e.code == "ArrowDown") {
    aDown = false;
  } else if (e.code == "ArrowUp") {
    aUp = false;
  }
}

//
// Start here
//
function main() {
  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl');

  document.addEventListener('keydown', logKeyDown);
  document.addEventListener('keyup', logKeyUp);

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying highp vec2 vTextureCoord;

    uniform sampler2D uSampler;

    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aTextureCoord and also
  // look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  const texture = loadTexture(gl, 'img/grass.jpg');

  var then = 0;

  // Draw the scene repeatedly
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, texture, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple three-dimensional cube.
//
function initBuffers(gl) {

  // Create a buffer for the cube's vertex positions.

  const positionBuffer = gl.createBuffer();

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the cube.
  const halfSize = 1.0
  var cubeOffsetX = 0.0, cubeOffsetY = 3.0, cubeOffsetZ = 0.0, aas = 3.0;

  var positions = [
    -halfSize+cubeOffsetX, -halfSize+cubeOffsetY,  -halfSize+cubeOffsetZ,
    halfSize+cubeOffsetX, -halfSize+cubeOffsetY,  -halfSize+cubeOffsetZ,
    -halfSize+cubeOffsetX, halfSize+cubeOffsetY,  -halfSize+cubeOffsetZ,
    halfSize+cubeOffsetX, halfSize+cubeOffsetY,  -halfSize+cubeOffsetZ,
    -halfSize+cubeOffsetX, -halfSize+cubeOffsetY,  halfSize+cubeOffsetZ,
    halfSize+cubeOffsetX, -halfSize+cubeOffsetY,  halfSize+cubeOffsetZ,
    -halfSize+cubeOffsetX, halfSize+cubeOffsetY,  halfSize+cubeOffsetZ,
    halfSize+cubeOffsetX, halfSize+cubeOffsetY,  halfSize+cubeOffsetZ,

    /*-halfSize+aas, -halfSize+cubeOffsetY,  -halfSize+cubeOffsetZ,
    halfSize+aas, -halfSize+cubeOffsetY,  -halfSize+cubeOffsetZ,
    -halfSize+aas, halfSize+cubeOffsetY,  -halfSize+cubeOffsetZ,
    halfSize+aas, halfSize+cubeOffsetY,  -halfSize+cubeOffsetZ,
    -halfSize+aas, -halfSize+cubeOffsetY,  halfSize+cubeOffsetZ,
    halfSize+aas, -halfSize+cubeOffsetY,  halfSize+cubeOffsetZ,
    -halfSize+aas, halfSize+cubeOffsetY,  halfSize+cubeOffsetZ,
    halfSize+aas, halfSize+cubeOffsetY,  halfSize+cubeOffsetZ*/
  ];

  /*cubeOffsetY = 12.0;
  var positions2 = [
    -halfSize+cubeOffsetX, -halfSize+cubeOffsetY,  -halfSize+cubeOffsetZ,
    halfSize+cubeOffsetX, -halfSize+cubeOffsetY,  -halfSize+cubeOffsetZ,
    -halfSize+cubeOffsetX, halfSize+cubeOffsetY,  -halfSize+cubeOffsetZ,
    halfSize+cubeOffsetX, halfSize+cubeOffsetY,  -halfSize+cubeOffsetZ,
    -halfSize+cubeOffsetX, -halfSize+cubeOffsetY,  halfSize+cubeOffsetZ,
    halfSize+cubeOffsetX, -halfSize+cubeOffsetY,  halfSize+cubeOffsetZ,
    -halfSize+cubeOffsetX, halfSize+cubeOffsetY,  halfSize+cubeOffsetZ,
    halfSize+cubeOffsetX, halfSize+cubeOffsetY,  halfSize+cubeOffsetZ
  ];
  positions = positions.concat(positions2);*/
  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Now set up the texture coordinates for the faces.

  const textureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

  var textureCoordinates = [
    // Front
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Front
    /*0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0,
    // Back
    0.0,  0.0,
    1.0,  0.0,
    1.0,  1.0,
    0.0,  1.0*/
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                gl.STATIC_DRAW);

  // Build the element array buffer; this specifies the indices
  // into the vertex arrays for each face's vertices.

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.

  var indices = [
    0,  1,  3,      0,  3,  2,    // front
    /*4,  5,  6,      4,  6,  7,    // back
    2,  3,  7,     2,  7, 6,   // top
    1, 0, 5,     0, 5, 6,   // bottom
    1, 5, 7,     1, 7, 3,   // right
    4, 0, 2,     4, 2, 6,   // left

    8,  9,  11,      8, 11,  10,    // front
    12,  13, 14,      12,  14,  15,    // back
    10,  11,  15,     10,  15, 14,   // top
    9, 8, 13,     8, 13, 14,   // bottom
    9, 13, 15,     9, 15, 11,   // right
    12, 8, 10,     12, 10, 14   // left*/
  ];

  /*var indices2 = [...indices];
  {
    var i;
    for (i = 0; i < indices2.length; i++) indices2[i] += 8;
  }
  indices = indices.concat(indices2);*/

  // Now send the element array to GL

  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    textureCoord: textureCoordBuffer,
    indices: indexBuffer,
  };
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, buffers, texture, deltaTime) {
  gl.clearColor(0.0, 0.0, 0.0, 0.0);  // Clear to white, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);
  mat4.translate(projectionMatrix,     // destination matrix
                 projectionMatrix,     // matrix to translate
                 [2*XTranslation, -5.0, -15.0+2*ZTranslation]);  // amount to translate
  mat4.rotate(projectionMatrix,  // destination matrix
              projectionMatrix,  // matrix to rotate
              camRotationX,     // amount to rotate in radians
              [0.0, 1.0, 0.0]);
  mat4.rotate(projectionMatrix,  // destination matrix
              projectionMatrix,  // matrix to rotate
              camRotationY,     // amount to rotate in radians
              [1.0, 0.0, 0.0]);   
  /*mat4.lookAt(projectionMatrix,
              [XTranslation, -5.0, -15.0+ZTranslation],
              [-3.0, -3.0, -6.0],
              [0.0, 1.0, 0.0]);*/

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.
  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-3.0, -3.0, -6.0]);  // amount to translate
  /*mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              cubeRotation,     // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around (Z)
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              cubeRotation * .7,// amount to rotate in radians
              [0, 1, 0]);       // axis to rotate around (X)*/

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute
  {
    const numComponents = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // Tell WebGL how to pull out the texture coordinates from
  // the texture coordinate buffer into the textureCoord attribute.
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
        programInfo.attribLocations.textureCoord,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.textureCoord);
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  // Specify the texture to map onto the faces.

  // Tell WebGL we want to affect texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Tell the shader we bound the texture to texture unit 0
  gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

  {
    const vertexCount = 72;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }

  // Update the rotation for the next draw

  cubeRotation += deltaTime;
  if (WDown) {
    ZTranslation += deltaTime;
  }
  if (SDown) {
    ZTranslation -= deltaTime;
  }
  if (DDown) {
    XTranslation -= deltaTime;
  }
  if (ADown) {
    XTranslation += deltaTime;
  }
  if (aDown) {
    camRotationY -= deltaTime;
  }
  if (aUp) {
    camRotationY += deltaTime;
  }
  if (aLeft) {
    camRotationX -= deltaTime;
  }
  if (aRight) {
    camRotationX += deltaTime;
  }
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

