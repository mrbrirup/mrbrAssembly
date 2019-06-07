class {
    static get using() { return ["Mrbr.Geometry.Size","Mrbr.Geometry.Point"]; }
    constructor(...args) {
        let size = (args && args.length > 0 && args[0].size) ? args[0].size : [0, 0, 32, 24];
        this.x = size[0];
        this.y = size[1];
        this.width = size[2];
        this.height = size[3];
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