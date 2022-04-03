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
      direction: 0
    },
  ]
}

const arrowOffset = 0.5;  // .5 * width of anchored object


const arrowPoints = [ [0,5], [0,-5], [40, -5], [40, -15], [60,0], [40, 15], [40, 5]];

var draggedObject = null;


function doesPointCollide(x,y,box) {
    return !(x < box.left || x > box.right || y > box.bottom || y < box.top)
}
function renderCanvas (canvas) {
  var ctx = canvas.getContext("2d");
  var img = document.querySelector("img[alt='asteroid']");
  ctx.drawImage(img, 10, 10, 25, 25);
}

document.onreadystatechange = function () {
   if (document.readyState == "complete") {
     // document is ready. Do your stuff here
     var canvas = document.getElementById("universe");
     renderCanvas(canvas);
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
            var arrowX = obj.x + obj.width/2 + arrowOffset*obj.width*Math.cos(obj.direction * Math.PI /180);
            var arrowY = obj.y + obj.height/2 - arrowOffset*obj.height*Math.sin(obj.direction * Math.PI / 180);
            arrow = makeArrow(arrowX, arrowY, obj.direction, 40);
            obj['arrow'] = { polygon:arrow, x: arrowX, y:arrowY, direction: 40};
            space.append(arrow);
            break;
        }
     });  // forEach

     var objblock = document.getElementById("object-block-1");
     objblock.addEventListener("dragstart", function(evt) {
       draggedObject = evt.target;
     
     });
     objblock.addEventListener("dragend", function(evt) {
        var x = evt.clientX;
        var y = evt.clientY;
        var src = draggedObject.getBoundingClientRect();
        console.log([x,y]);
        var space = document.getElementById("space");
        var tgt = space.getBoundingClientRect();
        if (doesPointCollide(x,y,tgt)) {
          //asteroid = makeAsteroid(x, y, 50, 50);
          //space.appendChild(asteroid);
        }
     });
     objblock.addEventListener("drag", function(evt) {
        var space = document.getElementById("space");
        var rect = space.getBoundingClientRect();
        var src = draggedObject.getBoundingClientRect();
        var x = (src.x - rect.x) + evt.clientX;
        var y = (src.y + rect.y) + evt.clientY;
        document.getElementsByName("drag-x")[0].value = parseInt(x);
        document.getElementsByName("drag-y")[0].value = parseInt(y);
     
     });
   } // document readyState
 } // onReadyStateChange

function rotatePoints ( points, centre, radang) {
  var [cx,cy] = centre;
  var relPoints = points.map( ([x,y]) => [ x - cx, y - cy ]);
  var newpoints = [];
  relPoints.forEach(function([x,y]) {
    var newx = parseInt(x*Math.cos(radang) - y*Math.sin(radang));
    var newy = parseInt(x*Math.sin(radang) + y*Math.cos(radang));
    console.log(newx, newy);
    newpoints.push([newx, newy]);
  });
  var resPoints = newpoints.map( ([x,y]) => [ x + cx, y + cy ]);
  return resPoints;
}

function stringifyPoints( points ) {
  var newpoints = Array.from(points);
  newpoints.unshift("");
  pointsStr = newpoints.reduce( (s, [x,y]) => s + String(x)+","+String(y) + " " ).trimEnd();
  return pointsStr;
}

function makeArrow(x, y, angle, length) {

//  <polygon points="440,150 440,140 400,140 400,130 380,145 400,160 400,150"
//  style="fill:#0a0;stroke:purple;stroke-width:2;" />
  var arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  var p = arrowPoints;
  p = rotatePoints(p, [0,0], -angle*Math.PI/180).map( ([px,py]) => [x + px, y + py]);
  var points = stringifyPoints (p);
  arrow.setAttribute('points',points);
  arrow.classList.add("draggable");
  arrow.classList.add("arrow");
  return arrow;

}

function makeAsteroid(x,y,w,h) {
   var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
   image.setAttributeNS(null, 'href', "./asteroid.png");
   image.setAttributeNS(null, 'width', w);
   image.setAttributeNS(null, 'height', h);
   image.setAttributeNS(null, 'x', x);
   image.setAttributeNS(null, 'y', y);
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

function getObjectArrowAttachedTo( arrow ) {
  var elmtFound = null;
  scene.objects.forEach( function (elmt) { 
    if ( elmt.hasOwnProperty( "arrow" ) ) {
      if ( elmt.arrow.polygon === arrow ) {
        elmtFound = elmt;
      }
    } 
  });
  return elmtFound;
}
// Based on https://www.petercollingridge.co.uk/tutorials/svg/interactive/dragging/
//
function makeDraggable(svg) {
  svg.addEventListener('mousedown', startDrag);
  svg.addEventListener('mousemove', drag);
  svg.addEventListener('mouseup', endDrag);
  svg.addEventListener('mouseleave', endDrag);

  var selectedElement = false;
  var clickX,ClickY;
  var angleChange;
  var attachedObj = null;
  var initialR = null;

  function startDrag(evt) {
    if (evt.target.classList.contains('draggable')) {
      selectedElement = evt.target;
      clickX = evt.offsetX;
      clickY = evt.offsetY;
      if (selectedElement.classList.contains("arrow")) {
        var attachedObj = getObjectArrowAttachedTo (selectedElement);
        angleChange = attachedObj.direction;
        var dx = clickX - attachedObj.x;
        var dy = clickY - attachedObj.y;
        initalR = Math.sqrt(dx*dx + dy*dy);
        document.getElementsByName("R")[0].value=parseInt(initialR);
      }
    }
  }
  


  function drag(evt) {

    document.getElementsByName("x")[0].setAttribute("value",evt.offsetX)
    document.getElementsByName("y")[0].setAttribute("value",evt.offsetY)

    if (selectedElement) {
      evt.preventDefault();
      if (selectedElement.classList.contains("arrow")) {
        var attachedObj = getObjectArrowAttachedTo (selectedElement);
        var cx = attachedObj.x + attachedObj.width/2;
        var cy = attachedObj.y + attachedObj.height/2;
        var direction = attachedObj.direction;
        // compute change in direction
        var dotProduct =  (1) * (evt.offsetX - cx) + (0)* (evt.offsetY - cy);
        var mag1 = 1; //Math.sqrt( (clickX-cx)**2 + (clickY-cy)**2) ;
        var mag2 = Math.sqrt( (evt.offsetX - cx)**2 + (evt.offsetY - cy)**2);
        angleChange = Math.acos(dotProduct/(mag1 * mag2)); // radians
        // The dotProduct above doesn't distinquish between clockwise
        // or counter clockwise rotation so we have to fudge it using
        // the Y coordinate position 
        if (evt.offsetY > cy) angleChange = 2*Math.PI - angleChange;

        document.getElementsByName("angle")[0].setAttribute("value",parseInt(angleChange*180/Math.PI));
        var dx = evt.offsetX - attachedObj.x;
        var dy = evt.offsetY - attachedObj.y;
        var R = Math.sqrt(dx*dx + dy*dy);
        document.getElementsByName("R")[0].value = parseInt(R);
        var arrowAbsPoints = arrowPoints.map( ([x,y]) => [parseInt(.02*R*x+cx+arrowOffset*attachedObj.width), y+cy]);
        var newpoints = stringifyPoints(rotatePoints(arrowAbsPoints, [cx, cy], -angleChange));
        console.log(newpoints);
        selectedElement.setAttributeNS(null, "points", newpoints);
      } else {
        var dx = evt.offsetX - x;
        var dy = evt.offsetY - y;
      }

    }
  }
  
  function endDrag(evt) {
    if (attachedObj) attachedObj.direction = angleChange;
    attachedObj = null;
    draggedObject = null;
    selectedElement = false;
  }

}
