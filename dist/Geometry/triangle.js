/*
mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)
*/
class {constructor(t){this.points=t}static pointInTriangle(t,n){var s=t.x,i=t.y,o=n.points[0],r=n.points[1],x=n.points[2],y=x.x-o.x,p=x.y-o.y,a=r.x-o.x,c=r.y-o.y,e=s-o.x,l=i-o.y,u=y*y+p*p,g=y*a+p*c,h=y*e+p*l,v=a*a+c*c,I=a*e+c*l,T=u*v-g*g,b=0===T?0:1/T,d=(v*h-g*I)*b,f=(u*I-g*h)*b;return d>=0&&f>=0&&d+f<1}}