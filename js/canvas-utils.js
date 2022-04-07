class DraggableObject {
  constructor(object) {
    this.universe = null;
    this.element = object;
    this.element.addEventListener('dragstart', this.onDragStart.bind(this));
  }
  onDragStart(event) {
    console.log("Drag start");
    if (this.universe) {
      this.universe.dragged = this;
      console.log(this);
    }
  }
}


class Universe {
  constructor(canvas) {
    this.canvas = canvas;
    this.dragged = null;
    this.objects = [];
    this.canvas.addEventListener( 'dragenter', elmt => { elmt.preventDefault(); console.log('drag enter'); } );
    this.canvas.addEventListener( 'dragover', elmt => elmt.preventDefault() );
    this.canvas.addEventListener( 'drop', function(evt) {
      console.log(evt);
      this.evt = evt;
      this.objects.forEach( function(e) {
        if (e == this.dragged ) {
          console.log(e.element);
          var ctx = this.canvas.getContext("2d");
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(this.evt.offsetX, this.evt.offsetY, 5, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }.bind(this));
    }.bind(this) );
  }
  add(obj) {
    this.objects.push(obj);
    obj.universe = this;
  }
}
