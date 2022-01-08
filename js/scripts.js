var scene = {
  objects: [
    { type: "earth",
      x: 280,
      y: 180,
      width: 50,
      height: 50
    },
    { type: "asteroid",
      x: 450,
      y: 130,
      width: 30,
      height: 30,
      direction: 135
    },
  ]
}

document.onreadystatechange = function () {
   if (document.readyState == "complete") {
     // document is ready. Do your stuff here
    var space = document.getElementById("space");
     makeDraggable(space);
     scene.objects.forEach( function(obj) {
        switch(obj.type) {
          case "earth":
            earth = makeEarth(obj.x, obj.y, obj.width, obj.height);
            space.appendChild(earth);
            break;
          case "asteroid":
            asteroid = makeAsteroid(obj.x, obj.y, obj.width, obj.height);
            space.appendChild(asteroid);
            var arrowX = obj.x + obj.width/2 + 1*obj.width*Math.cos(obj.direction * Math.PI /180);
            var arrowY = obj.y + obj.height/2 - 1*obj.height*Math.sin(obj.direction * Math.PI / 180);
            arrow = makeArrow(arrowX, arrowY, obj.direction, 40);
            space.append(arrow);
            break;
        }
     });
   }
 }

function arrowDragStart(event) {
  console.log(event);
}

function makeArrow(x, y, angle, length) {

//  <polygon points="440,150 440,140 400,140 400,130 380,145 400,160 400,150"
//  style="fill:#0a0;stroke:purple;stroke-width:2;" />
  function appendElmt(elmt) {
    console.log(elmt);
    var xv, yv =  elmt;
    points = points + xv+","+yv+" ";
  };
  var arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  var p = ["", [0,5], [0,-5], [40, -5], [40, -15], [60,0], [40, 15], [40, 5]];
  p.forEach(function(elmt) {
    if (typeof(elmt) != 'string') {
      console.log(elmt);
      var radang = -angle * Math.PI/180;
      var dx = elmt[0]*Math.cos(radang) - elmt[1]*Math.sin(radang);
      var dy = elmt[0]*Math.sin(radang) + elmt[1]*Math.cos(radang);
      elmt[0] = x + dx;
      elmt[1] = y + dy;
      console.log(elmt);
    }
  
  });
  var points = p.reduce(function(old, n) {
    var [x,y] = n
    return old + String(x) + "," + String(y) + " ";
  });
  console.log(points);
  arrow.setAttribute('points',points);
  arrow.setAttribute('id',"arrow");
  arrow.classList.add("draggable");
  return arrow;

}

function makeAsteroid(x,y,w,h) {
   var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
   image.setAttribute('href', "./asteroid.png");
   image.setAttribute('width', w);
   image.setAttribute('height', h);
   image.setAttribute('x', x);
   image.setAttribute('y', y);
   return image;

}
function makeEarth(x,y, w, h) {
   var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
   image.setAttribute('href', "./3dglobe.png");
   image.setAttribute('width', w);
   image.setAttribute('height', h);
   image.setAttribute('x', x);
   image.setAttribute('y', y);
   return image;

}

// Based on https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
//
function makeDraggable(svg) {
  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);

  var selectedElement = false;
  var x,y;

  function startDrag(evt) {
    if (evt.target.classList.contains('draggable')) {
      selectedElement = evt.target;
      x = evt.offsetX;
      y = evt.offsetY;
    }
  }
  
  function drag(evt) {
    if (selectedElement) {
      evt.preventDefault();
      var dx = evt.offsetX - x;
      var dy = evt.offsetY - y;
      x = evt.offsetX;
      y = evt.offsetY;
      var points = selectedElement.getAttributeNS(null, "points").trim().split(" ");
      var newpoints = "";
      console.log(x,y);
      points.forEach(function(elmt) {
        ielmts = elmt.split(",").map(x => parseInt(x));
        var newdx = ielmts[0] + dx;
        var newdy = ielmts[1] + dy;
        newpoints += `${newdx},${newdy} `;
      });
      selectedElement.setAttributeNS(null, "points", newpoints);
    }
  }
  
  function endDrag(evt) {
    selectedElement = false;
  }

}
