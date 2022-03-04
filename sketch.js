const render = gpu.createKernel(function() {
  //UV Coordinates
  let u=(this.thread.x/5000)*2-1;
  let v=(this.thread.y/5000)*2-1;
  let rd=[u,v,1];
  let ro=[0,0,-5];
  let color=[0,0,0];
  
  let total_distance_traveled=0;
  const NUMBER_OF_STEPS = 32;
  const MINIMUM_HIT_DISTANCE = 0.001;
  const MAXIMUM_TRACE_DISTANCE = 1000;
  for (let i = 0; i < NUMBER_OF_STEPS; i++){
    //Calculate current position along the ray
    const current_position=[
      rd[0]*total_distance_traveled+ro[0],
      rd[1]*total_distance_traveled+ro[1],
      rd[2]*total_distance_traveled+ro[2]
    ];
    let p=current_position;
    let c=[0,0,0];
    let r=2;
    const distance_to_closest = Math.sqrt((p[0]-c[0])*(p[0]-c[0])+(p[1]-c[1])*(p[1]-c[1])+(p[2]-c[2])*(p[2]-c[2]))-r;
    if(distance_to_closest < MINIMUM_HIT_DISTANCE){
      let p=current_position;
      const small_step=0.001;
      let v=[p[0]+small_step,p[1],p[2]];
      let gradx=Math.sqrt((v[0]-c[0])*(v[0]-c[0])+(v[1]-c[1])*(v[1]-c[1])+(v[2]-c[2])*(v[2]-c[2]))-r;
      v=[p[0]-small_step,p[1],p[2]];
      gradx-=Math.sqrt((v[0]-c[0])*(v[0]-c[0])+(v[1]-c[1])*(v[1]-c[1])+(v[2]-c[2])*(v[2]-c[2]))-r;
      v=[p[0],p[1]+small_step,p[2]];
      let grady=Math.sqrt((v[0]-c[0])*(v[0]-c[0])+(v[1]-c[1])*(v[1]-c[1])+(v[2]-c[2])*(v[2]-c[2]))-r;
      v=[p[0],p[1]-small_step,p[2]];
      grady-=Math.sqrt((v[0]-c[0])*(v[0]-c[0])+(v[1]-c[1])*(v[1]-c[1])+(v[2]-c[2])*(v[2]-c[2]))-r;
      v=[p[0],p[1],p[2]+small_step];
      let gradz=Math.sqrt((v[0]-c[0])*(v[0]-c[0])+(v[1]-c[1])*(v[1]-c[1])+(v[2]-c[2])*(v[2]-c[2]))-r;
      v=[p[0],p[1],p[2]-small_step];
      gradz-=Math.sqrt((v[0]-c[0])*(v[0]-c[0])+(v[1]-c[1])*(v[1]-c[1])+(v[2]-c[2])*(v[2]-c[2]))-r;
    
      const n=[gradx,grady,gradz];
      const length=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);
      const normal=[n[0]/length,n[1]/length,n[2]/length];
      const light_position=[2,-5,3];
      // Calculate the unit direction vector that points from
      // the point of intersection to the light source
      let direction_to_light=[
        ro[0]-light_position[0],
        ro[1]-light_position[1],
        ro[2]-light_position[2],
      ];
      const length1=Math.sqrt(direction_to_light[0]*direction_to_light[0]+direction_to_light[1]*direction_to_light[1]+direction_to_light[2]*direction_to_light[2]);
      direction_to_light=[direction_to_light[0]/length1,direction_to_light[1]/length1,direction_to_light[2]/length1];
      
      let diffuse_intensity=normal[0]*direction_to_light[0]+normal[1]*direction_to_light[1]+normal[2]*direction_to_light[2];
      diffuse_intensity=diffuse_intensity>0?diffuse_intensity:0;
      
      color=[diffuse_intensity,0,diffuse_intensity];
      break;
    }
    if(total_distance_traveled > MAXIMUM_TRACE_DISTANCE){
      break;//miss
    }
    
    // accumulate the distance traveled thus far
    total_distance_traveled += distance_to_closest;
  }
  this.color(color[0], color[1], color[2], 1);
}).setOutput([5000, 5000]).setGraphical(true);

console.log(render());

render();

let canvas = render.canvas;
document.getElementsByTagName('body')[0].appendChild(canvas);
