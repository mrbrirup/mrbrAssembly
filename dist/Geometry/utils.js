class {static pointInTriangle(n,t){var i=n.x,s=n.y,x=t.points[0],y=t.points[1],a=t.points[2],o=a.x-x.x,p=a.y-x.y,r=y.x-x.x,c=y.y-x.y,e=i-x.x,l=s-x.y,g=o*o+p*p,u=o*r+p*c,v=o*e+p*l,I=r*r+c*c,T=r*e+c*l,b=g*I-u*u,d=0===b?0:1/b,f=(I*v-u*T)*d,h=(g*T-u*v)*d;return f>=0&&h>=0&&f+h<1}}