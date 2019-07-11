/*mrbrAssembly 
Copyright 2019 Martin Ruppersburg
Licensed under MIT (https://github.com/mrbrirup/mrbrAssembly/blob/master/licence.md)*/class {static debounce(t,e,a){var c;return()=>{const l=this,n=arguments,s=a&&!c;clearTimeout(c),c=setTimeout(function(){c=null,a||t.apply(l,n)},e),s&&t.apply(l,n)}}}