/*mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)*/class {use(i){var n=this;this.go=function(t){return function(s,...c){t.call(n,function(){i.call(n,s.bind(n),...c)},...c)}.bind(this)}(this.go)}go(i,...n){i(...n)}}