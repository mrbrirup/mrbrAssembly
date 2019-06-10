class {
    static get inherits() { return ["Mrbr.Geometry.Size","Mrbr.Geometry.Point"]; }
    constructor(...args) {
        // let size = args[0].size || {x:0, y:0, width:32, height: 24};
        // this.x = size.x;
        // this.y = size.y;
        // this.width = size.width;
        // this.height = size.height;
        this.base(...args);
        //console.log("size:", size)
    }
    get right() { return this.x + this.width - 1 }
    get bottom() { return this.y + this.height - 1 }
    static PointInRectangle(point, rectangle) {
        return (point.x >= rectangle.x && point.x <= rectangle.right && point.y >= rectangle.y && point.y <= rectangle.bottom)
    }
    set size(value) {
        if (this.typeMatch(value, Mrbr.Geometry.Size)) {
            this.width = value.width;
            this.height = value.height;
        }
    }
    get size(){
        return new Mrbr.Geometry.Size(this.width, this.height)
    }
    set position(value) { 
        if (this.typeMatch(value,Mrbr.Geometry.Point)) {
            this.x = value.x;
            this.y = value.y;
        }        
    }   
    get position(){
        return new Mrbr.Geometry.Point(this.x, this.y);
    }
}