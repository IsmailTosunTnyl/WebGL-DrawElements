var canvas;
var gl;


var vPosition;
var transformationMatrix, transformationMatrixLoc;

var vertices = [
    vec2( -0.15, 0.25 ),
    vec2( -0.05, 0.25 ),
    vec2( 0.05, 0.25),
    vec2( 0.15, 0.25),
    vec2( -0.15, 0.15 ),
    vec2( -0.05, 0.15 ),
    vec2( 0.05, 0.15),
    vec2( 0.15, 0.15),
    vec2( -0.15, 0.05),
    vec2( -0.05, 0.05),
    vec2( 0.05, 0.05   ),
    vec2( 0.15, 0.05  ), //half
    vec2( -0.15, -0.05),
    vec2( -0.05, -0.05 ),
    vec2( 0.05, -0.05 ),
    vec2( 0.15, -0.05 ),
    vec2( -0.15, -0.15  ),
    vec2( -0.05, -0.15 ),
    vec2( 0.05, -0.15 ),
    vec2( 0.15, -0.15 ),
    vec2( -0.15, -0.25 ),
    vec2( -0.05, -0.25 ),
    vec2( 0.05, -0.25 ),
    vec2( 0.15, -0.25 ),

];

var blocks = [
    [4,5,1,0],
    [5,6,2,1],
    [6,7,3,2],
    [8,9,5,4],
    [9,10,6,5],
    [10,11,7,6],
    [12,13,9,8],
    [13,14,10,9],
    [14,15,11,10],
    [16,17,13,12],
    [17,18,14,13],
    [18,19,15,14],
    [20,21,17,16],
    [21,22,18,17],
    [22,23,19,18],

];
var numberBlocks = [
    [0,1,2,3,5,6,8,9,11,12,13,14],          //0
    [2,5,8,11,14],                          //1
    [0,1,2,5,6,7,8,9,12,13,14],             //2
    [0,1,2,5,6,7,8,11,12,13,14],            //3
    [0,2,3,5,6,7,8,11,14],                  //4
    [0,1,2,3,6,7,8,11,12,13,14],             //5
    [0,3,6,7,8,9,11,12,13,14],              //6
    [0,1,2,5,8,11,14],                      //7
    [0,1,2,3,5,6,7,8,9,11,12,13,14],        //8
    [0,1,2,3,5,6,7,8,11,14]                 //9
];
var indices = [];

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Make the numbers
    
	

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    calculateVertices(5)
    //indices = [0,1,4,4,5,1,1,2,5,2,6,5]
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),gl.STATIC_DRAW);

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );
/*
	document.getElementById("inp_number").oninput = function(event) {
        //TODO: fill here to adjust number to display input value
    };
	
    document.getElementById("inp_objX").oninput = function(event) {
        //TODO: fill here to adjust translation according to slider value
    };
    document.getElementById("inp_objY").oninput = function(event) {
        //TODO: fill here to adjust translation according to slider value
    };
    document.getElementById("inp_obj_scaleX").oninput = function(event) {
        //TODO: fill here to adjust scale according to slider value
    };
    document.getElementById("inp_obj_scaleY").oninput = function(event) {
        //TODO: fill here to adjust scale according to slider value
    };
    document.getElementById("inp_rotation").oninput = function(event) {
        //TODO: fill here to adjust rotation according to slider value
    };
    document.getElementById("redSlider").oninput = function(event) {
        //TODO: fill here to adjust color according to slider value
    };
    document.getElementById("greenSlider").oninput = function(event) {
        //TODO: fill here to adjust color according to slider value
    };
    document.getElementById("blueSlider").oninput = function(event) {
        //TODO: fill here to adjust color according to slider value
    };
    */
   
   
    console.log("ssss")
    
    render();

};


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

	//TODO: send color to shader
	//TODO: calculate and send transformation matrix
	//TODO: draw digits
	
    transformationMatrix = mat4();
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix) );

    /*gl.bindBuffer( gl.ARRAY_BUFFER, bufferNum1 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 3 );
	
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferNum2 );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );*/
   
    
	
    for(var i = 0; i < indices.length; i += 4)
    gl.drawElements( gl.TRIANGLE_FAN, 4, gl.UNSIGNED_BYTE, i );

    //window.requestAnimFrame(render);
}

function calculateVertices(digit){
    indices = []
    for(var i = 0 ; i<numberBlocks[digit].length ; i++){
        
        for( var j=0 ; j<blocks[numberBlocks[digit][i]].length ;j++){
            indices.push(blocks[numberBlocks[digit][i]][j])

        }
    }
    console.log(indices)
}