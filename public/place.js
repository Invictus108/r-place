var time = 0;
var isrun = false;
var canClick = true;

$(document).ready(() => {
    var socket = io()

    var canvas = $("#place")[0]
    var ctx = canvas.getContext("2d")
   
    socket.on("draw", draw) 
    
    function draw(data) {
        ctx.fillStyle = data.color
        ctx.fillRect(data.x, data.y, 10, 10)
        io.emit("canvas", canvas)
    }

        
        

        
    
    
        

    socket.on("canvas", canvasData =>{
        canvasData.forEach((row, rowIndex) => {
            row.forEach((col, colIndex) => {
                ctx.fillStyle = col
                ctx.fillRect(colIndex * 10, rowIndex * 10, 10, 10) //size of squares. fillRect(x, y, width, height). 15

            })
        });
    })


    

    $("#submit").click(() => {
        if (isrun == false) {
            if (parseInt($("#x-coord").val()) <= 75 && parseInt($("#y-coord").val()) <= 75 && parseInt($("#x-coord").val()) > 0 && parseInt($("#y-coord").val()) > 0) {
                socket.emit("color", {
                    col: parseInt($("#x-coord").val()),
                    row: parseInt($("#y-coord").val()),
                    color: $("#color").val()
        
                })
                time = 5
                canClick = false
                
                if (isrun == false) {
                    timer2()
                    isrun = true
                    
                }
            }
        }
    })
        

    function getMousePosition(canvas, event) {
        let rect = canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        document.getElementById("x-coord").value = parseInt(x/10 + 1) //15
        document.getElementById("y-coord").value = parseInt(y/10 + 1) //15
        if (canClick) {
            socket.emit("color", {
                col: parseInt($("#x-coord").val()),
                row: parseInt($("#y-coord").val()),
                color: $("#color").val()
                
            })
            time = 5
            
            canClick = false

            if (isrun == false) {
                timer2()
                isrun = true
            
            }
    }
    }
    
    //let canvas = document.querySelector("canvas");
    canvas.addEventListener("mousedown", 
    function(e){
        getMousePosition(canvas, e);
    });
    
    
    function timer2() {
        //minutes * 60 se
        
       let refreshIntervalId = setInterval(updateCountdown, 1000); //update every 1 second
    
       function updateCountdown() {
               const minutes = Math.floor(time / 60); // rounds a number DOWN to the nearest integer
               let seconds = time % 60;
    
               seconds = seconds < 10 ? '0' + seconds : seconds; 
               const contdownEl = document.getElementById("f1"); 
               contdownEl.innerHTML = `${minutes}:${seconds}`;
               
    
        if (isrun){
           time--;
           
           document.getElementById("submit").style.visibility="hidden";  
           if (time < 0) { //stop the setInterval whe time = 0 for avoid negative time
            clearInterval(refreshIntervalId);
            isrun = false
            canClick = true
            document.getElementById("submit").style.visibility="visible"; 

           }
          
        }
        }
    
      
    }
   
})



