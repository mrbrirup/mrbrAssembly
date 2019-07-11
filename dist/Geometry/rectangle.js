/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {static get inherits(){return["Mrbr.Geometry.Size","Mrbr.Geometry.Point"]}constructor(...t){this.base(...t)}get right(){return this.x+this.width-1}get bottom(){return this.y+this.height-1}static PointInRectangle(t,e){return t.x>=e.x&&t.x<=e.right&&t.y>=e.y&&t.y<=e.bottom}set size(t){this.typeMatch(t,Mrbr.Geometry.Size)&&(this.width=t.width,this.height=t.height)}get size(){return new Mrbr.Geometry.Size(this.width,this.height)}set position(t){this.typeMatch(t,Mrbr.Geometry.Point)&&(this.x=t.x,this.y=t.y)}get position(){return new Mrbr.Geometry.Point(this.x,this.y)}}