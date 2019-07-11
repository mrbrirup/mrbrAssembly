/*
Copyright (c) 2019 Martin Ruppersburg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
class {
    constructor(points) {
        this.points = points;
    }
    static pointInTriangle(point, triangle) {
        var cx = point.x, cy = point.y,            
            t0 = triangle.points[0], t1 = triangle.points[1], t2 = triangle.points[2],
            v0x = t2.x - t0.x, v0y = t2.y - t0.y,
            v1x = t1.x - t0.x, v1y = t1.y - t0.y,
            v2x = cx - t0.x, v2y = cy - t0.y,

            dot00 = v0x * v0x + v0y * v0y,
            dot01 = v0x * v1x + v0y * v1y,
            dot02 = v0x * v2x + v0y * v2y,
            dot11 = v1x * v1x + v1y * v1y,
            dot12 = v1x * v2x + v1y * v2y
        var b = (dot00 * dot11 - dot01 * dot01),
            inv = b === 0 ? 0 : (1 / b),
            u = (dot11 * dot02 - dot01 * dot12) * inv,
            v = (dot00 * dot12 - dot01 * dot02) * inv
        return u >= 0 && v >= 0 && (u + v < 1)
    }
}