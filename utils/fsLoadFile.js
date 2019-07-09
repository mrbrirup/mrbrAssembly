class {
    static get inherits() {return [];}
    static get using() { return []; }
    static get manifest() { return []; }
    constructor(...args) {
        this.base(...args)
    }
    static loadFile (fileName){
        const fs = require("fs-extra")
        const loader = Mrbr.System.Assembly.loader;
        if (loader.hasOwnProperty(url)) {
            let loadUrlObject = loader[url];
            if (loadUrlObject.loaded === true) {
                return Promise.resolve();
            }
            else {
                return loadUrlObject.promise;
            }
        }
        else {
            let resolver,
                rejecter,
                prm = new Promise((resolve, reject) => {
                    resolver = resolve;
                    rejecter = reject;
                });
            fetch(url, {
                method: 'GET'
            })
                .then(response => response.text()
                    .then(text => {
                        loader[url].result = text;
                        loader[url].loaded = true;
                        delete loader[url].promise
                        resolver(text);
                    })
                    .catch(function (error) { rejecter(error) }))
                .catch(function (error) { rejecter(error) })
            loader[url] = { promise: prm, result: undefined, loaded: false };
            return prm;
        }        
    } 
}