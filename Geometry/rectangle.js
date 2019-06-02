class {
    constructor(...args) {
        let size = args[0].size || [0, 0, 32, 24];
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
}   