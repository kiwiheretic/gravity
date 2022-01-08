document.onreadystatechange = function () {
   if (document.readyState == "complete") {
     // document is ready. Do your stuff here
    var space = document.getElementById("space");
     makeDraggable(space);
     earth = makeEarth(280, 180);
     asteroid = makeAsteroid(450, 130);
     arrow = makeArrow(440,145, 180, 40);
     space.appendChild(earth);
     space.appendChild(asteroid);
     space.append(arrow);
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
  var p = ["", [0,5], [0,-5], [-40, -5], [-40, -15], [-60,0], [-40, 15], [-40, 5]];
  p.forEach(function(elmt) {
    if (typeof(elmt) != 'string') {
      elmt[0] += x;
      elmt[1] += y;
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

function makeAsteroid(x,y) {
   var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
   image.setAttribute('href', "./asteroid.png");
   image.setAttribute('width', 30);
   image.setAttribute('height', 30);
   image.setAttribute('x', x);
   image.setAttribute('y', y);
   return image;

}
function makeEarth(x,y) {
   var image = document.createElementNS("http://www.w3.org/2000/svg", "image");
   image.setAttribute('href', "./3dglobe.png");
   image.setAttribute('width', 50);
   image.setAttribute('height', 50);
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
