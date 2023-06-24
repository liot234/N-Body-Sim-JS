(function(){

   
    var width = 1300;
    var height= 1300;
    var context = document.getElementById("canvas").getContext("2d")
    context.canvas.width = width;
	context.canvas.height = height;
    

    var particles = [];
    var new_point = true;
    function ammountPart(){
        document.getElementById("partamm").innerHTML = 'Particles:   '+particles.length;
    }
    
    function getMass(){
        var mass = document.getElementById("mass").value
        return mass;
    }
    
    is2D();
    function drawPoints(particles) {
		for(var i = 0; i<particles.length; i++){
            
			
           
            context.beginPath();
			context.arc(particles[i][0],particles[i][1],7.5,0,20*Math.PI);
			context.fillStyle = "white";
			context.fill();
			context.stroke();
            
		}
	};
    var soft = 1;
    function calcAcc(posxi, posxj, posyi, posyj, mj){

        var G = document.getElementById('G').value
        var rxij = posxi-posxj;
        var ryij = posyi-posyj;
         
        var r2i_r2j = (rxij*rxij)+(ryij*ryij)
        if(r2i_r2j> soft*soft && is2D()=='3d'){
            var accx = ((-G*mj*rxij)/r2i_r2j*Math.sqrt(r2i_r2j))
            var accy = ((-G*mj*ryij)/r2i_r2j*Math.sqrt(r2i_r2j))
        }else if(r2i_r2j> soft*soft && is2D()=='2d'){
            var accx = ((-G*mj*rxij)/r2i_r2j)
            var accy = ((-G*mj*ryij)/r2i_r2j)
        }
        else{
            var accx = ((-G*mj*rxij)/soft)
            var accy = ((-G*mj*ryij)/soft)
        }
        
        return [accx, accy]
    }

    var dt = 0.001

    function mainLoop() {
        var accel_x,accel_y;
        var pos_x, pos_y;
        var vel_x, vel_y;
        var mass;
        var newparts;
        
        context.fillStyle = "black";
	    context.fillRect(0, 0, width, height);
        
        $(document).mousedown(function (event){
			if (new_point){     
				var new_x = event.pageX-canvas.offsetLeft;
				var new_y = event.pageY-canvas.offsetTop;
				if (new_x > 0 && new_y > 0 && new_x < width && new_y < height){
					particles.push([event.pageX-canvas.offsetLeft ,event.pageY-canvas.offsetTop,0,0,getMass()]);
					new_point = false
				}
                //console.log(getMass())
			}
		});
        $(document).mouseup(function (event){
			new_point = true
		});
        var speed;
        speed = Math.pow(10,$("#speed").val());
		$("#speeddisplay").html(Math.round(speed)+"");

        for(let iter=0; iter<speed; iter++){
            newparts =[];
            for (let i = 0; i < particles.length; i++) {
                accel_x= 0;
                accel_y= 0;
                for (let j = 0; j < particles.length; j++) {
                    if(i!=j){
                        accel_x += calcAcc(particles[i][0],particles[j][0],particles[i][1],particles[j][1],particles[j][4])[0];
                        accel_y += calcAcc(particles[i][0],particles[j][0],particles[i][1],particles[j][1],particles[j][4])[1];
                        //console.log(accel_x);
                    }

                    
                    
                }
                vel_x = particles[i][2] + accel_x*(dt/2);
                vel_y = particles[i][3] + accel_y*(dt/2);
                pos_x = particles[i][0] + vel_x*dt;
                pos_y = particles[i][1] + vel_y*dt;
                mass = particles[i][4]
                newparts.push([pos_x,pos_y, vel_x, vel_y, mass]);
            }
            particles = newparts;

        }
        ammountPart();
        drawPoints(particles);
        //console.log(particles)
        setTimeout(mainLoop, 1); 
        
    }
    mainLoop();
    function is2D(){
        var is2d = document.getElementById("is2D").value
        
        return is2d;
    }
    

}).call()
