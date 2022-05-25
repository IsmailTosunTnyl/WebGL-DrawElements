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
    [4,5,1,0],                            // block 0
    [5,6,2,1],                            // block 1
    [6,7,3,2],                            // block 2      
    [8,9,5,4],                            // block 3  
    [9,10,6,5],                           // etc..  
    [10,11,7,6],                          // We used block oriented method   
    [12,13,9,8],                          // We have 15 block   
    [13,14,10,9],                         // so we can easyl draw anything with choosing appropriate blocks   
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
    [0,1,2,3,6,7,8,11,12,13,14],            //5
    [0,3,6,7,8,9,11,12,13,14],              //6
    [0,1,2,5,8,11,14],                      //7
    [0,1,2,3,5,6,7,8,9,11,12,13,14],        //8
    [0,1,2,3,5,6,7,8,11,14]                 //9
];
var program;
var indices = [];
var x = 0;
var y = 0;
var scaleX = 1;
var scaleY = 1;
var rotateZ = 0;
var colorArray = [Math.random() ,Math.random(),Math.random(),1.0]
var firstDigit; 
var secondDigit;
var studentsNumberEnd = 20;
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
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Make the numbers
    
	

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    
   
    
    

    transformationMatrixLoc = gl.getUniformLocation( program, "transformationMatrix" );

	document.getElementById("inp_number").oninput = function(event) {
        //first digit 0 check
        if(this.value < 10)
          firstDigit = 0;
        else
          firstDigit = Math.floor(this.value / 10) ;
        //second digit calculation  
        secondDigit =  this.value%10;
        render();
    };
	
    document.getElementById("inp_objX").oninput = function(event) {
        x = this.value;
        render();
        
    };
    document.getElementById("inp_objY").oninput = function(event) {
        y = this.value;
        render();
    };
    document.getElementById("inp_obj_scaleX").oninput = function(event) {
        scaleX = this.value;
        render();
    };
    document.getElementById("inp_obj_scaleY").oninput = function(event) {
        scaleY= this.value;
        render();
    };
    document.getElementById("inp_rotation").oninput = function(event) {
        
        rotateZ = this.value;
        render();
    };
    document.getElementById("redSlider").oninput = function(event) {
        colorArray[0] = this.value;
        render();
    };
    document.getElementById("greenSlider").oninput = function(event) {
        colorArray[1] = this.value;
        render();
    };
    document.getElementById("blueSlider").oninput = function(event) {
        colorArray[2] = this.value;
        render();
    };

    // initilaze input elements values   
    document.getElementById("redSlider").value=colorArray[0]
    document.getElementById("greenSlider").value=colorArray[1]
    document.getElementById("blueSlider").value=colorArray[2]
    document.getElementById("inp_number").value = studentsNumberEnd;
    if(studentsNumberEnd < 10)
        firstDigit = 0;
    else
        firstDigit = Math.floor(studentsNumberEnd / 10) ;
    secondDigit =  studentsNumberEnd%10;
   
    
    
    render();

};


function render() {

    //--------------------------------------------------------------//
    
    //common parts for all digits
    gl.clear( gl.COLOR_BUFFER_BIT );
    //define color
    var color = vec4(colorArray[0],colorArray[1],colorArray[2],1.0);
	var colorLoc = gl.getUniformLocation(program,"color");
	gl.uniform4fv(colorLoc,color);

    // calculate common Matrix
    transformationMatrix = mat4();
    
    commonMatrix = mult(transformationMatrix,translate([x,y,0]))
    commonMatrix = mult(commonMatrix,scalem([scaleX,scaleY,1]))
    commonMatrix = mult(commonMatrix,rotate(rotateZ,0,0,1))
   
    //--------------------------------------------------------------//
	
	//DIGIT 1

    //use Common Matrix
    transformationMatrix = mult(transformationMatrix,commonMatrix)

    //seperate digits
    transformationMatrix = mult(transformationMatrix,translate([-0.18,0,0]))
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix));

    calculateIndices(firstDigit)
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),gl.STATIC_DRAW);
   
    for(var i = 0; i < indices.length; i += 4)
    gl.drawElements( gl.TRIANGLE_FAN, 4, gl.UNSIGNED_BYTE, i );

    //--------------------------------------------------------------//

    //DIGIT2

    transformationMatrix = mat4();
    //use Common Matrix
    transformationMatrix = mult(transformationMatrix,commonMatrix)

    //seperate digits
    transformationMatrix = mult(transformationMatrix,translate([0.18,0,0]))
    gl.uniformMatrix4fv( transformationMatrixLoc, false, flatten(transformationMatrix));


    calculateIndices(secondDigit)
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices),gl.STATIC_DRAW);
   
    for(var i = 0; i < indices.length; i += 4)
    gl.drawElements( gl.TRIANGLE_FAN, 4, gl.UNSIGNED_BYTE, i );

    //--------------------------------------------------------------//

    //window.requestAnimFrame(render); render only change
}

function calculateIndices(digit){
    //calculates necessary indices for given digit
    indices = []
    for(var i = 0 ; i<numberBlocks[digit].length ; i++){
        
        for( var j=0 ; j<blocks[numberBlocks[digit][i]].length ;j++){
            indices.push(blocks[numberBlocks[digit][i]][j])

        }
    }
    
}