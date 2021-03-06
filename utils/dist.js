const exec = require("./exec"),
    path = require("path"),
    vm = require("vm"),
    fs = require("fs");
global.require = require;
new vm.Script(fs.readFileSync("./src/system/assembly.js", "utf8")).runInThisContext();
const loadFile = function (...args) {
    const prms = args[0],
    url = prms.url,
    alias =  prms.alias ? prms.alias : prms.url,
    formattedUrl = prms.formattedUrl ? prms.formattedUrl : prms.url;
    const fs = require("fs-extra"),
        loader = Mrbr.System.Assembly.loader,
        assembly = Mrbr.System.Assembly,
        assemblyLoadedFile = assembly.loadedFile;
    if (loader.hasOwnProperty(url)) {
        const loadUrlObject = loader[url];
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
            loader[url] = { promise: prm, result: undefined, loaded: false };
            if (formattedUrl !== url) { loader[formattedUrl] = loader[url]; }
            if (alias !== url) { loader[alias] = loader[url]; }
        fs.readFile(url, "utf8")
            .then(function (result) {
                loader[url].result = result;
                loader[url].loaded = true;
                delete loader[url].promise;
                const prm = { url: url, text: result }
                result = (assembly._fileInterceptor === undefined) ? assemblyLoadedFile(prm) : assembly.fileInterceptor.intercept(assemblyLoadedFile, undefined,prm)[1];
                resolver(result);
            })
            .catch(function (error) { rejecter(error) })
        return prm;
    }
}
Mrbr.System.Assembly.initialised({
    assemblyResolvers: [
        { replace: new RegExp("^App\\.Utils","i"), with: path.resolve(__dirname, "./../utils/") + "/" },
        { replace: new RegExp("^Mrbr\\.","i"), with: path.resolve(__dirname, "./../src/") + "/" },
        { replace: new RegExp("\\.", "g"), with: "/" }
    ],
    loadFile: loadFile
})
    .then(function (result) {
        var entry = Mrbr.System.ManifestEntry,
            fileTypes = Mrbr.System.ManifestEntry.FileTypes;
        Mrbr.System.Assembly.loadManifest([
            new entry(fileTypes.Class, "App.Utils.TerserMinifier"),
            new entry(fileTypes.Class, "Mrbr.Interceptor.Interceptor")
        ])
            .then(function (result) {
                let terserMinifier = new App.Utils.TerserMinifier({ __dirname: __dirname });
                terserMinifier.buildSourceDistributionList(
                    terserMinifier.dirSrc,
                    terserMinifier.dirDest,
                    terserMinifier.processEntries.bind(terserMinifier)
                )
            })
            .catch(function (error) {
                console.log(error);
            })
    })
    .catch(function (error) {
        console.log(error)
    })