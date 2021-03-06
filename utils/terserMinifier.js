class {
    static get inherits() { return []; }
    static get using() { return []; }
    static get manifest() { return []; }
    constructor(...args) {
        var self = this;
        self.fs = require("fs-extra");
        self.path = require('path');
        self.Terser = require("terser");
        self.dirSrc = self.path.resolve(args[0].__dirname, "../src");
        self.dirDest = self.path.resolve(args[0].__dirname, "../dist");
        self.typeDir = 0;
        self.typeFile = 1;
        self.findClassStart = /^\s*class\s+{/m;
        self.tempClassName = `class é {`;
        self.rxTempClassName = /^\s*class é\s*{/m;
        self.resetTempClassName = `class {`;
    }
    buildSourceDistributionList(src, dest, done) {
        const self = this,
            fs = self.fs,
            path = self.path,
            typeDir = self.typeDir,
            typeFile = self.typeFile;
        let results = [];
        fs.readdir(src, function (err, list) {
            if (err) return done(err);
            let toProcessCount = list.length;
            if (!toProcessCount) return done(null, results);
            list.forEach(function (file) {
                const fileSrc = path.resolve(src, file),
                    fileDest = path.resolve(dest, file);
                fs.stat(fileSrc, function (err, stat) {
                    if (stat && stat.isDirectory()) {
                        results.push({ src: fileSrc, dest: fileDest, type: typeDir });
                        self.buildSourceDistributionList.call(self, fileSrc, fileDest, function (err, res) {
                            results = results.concat(res);
                            if (!--toProcessCount) done(null, results);
                        });
                    } else {
                        results.push({ src: fileSrc, dest: fileDest, type: typeFile });
                        if (!--toProcessCount) done(null, results);
                    }
                });
            });
        });
    }
    processEntries(err, result) {
        const self = this,
            fs = self.fs,
            Terser = self.Terser,
            typeDir = self.typeDir,
            selfFindClassStart = self.findClassStart,
            selfTempClassName = self.tempClassName,
            selfRxTempClassName = self.rxTempClassName,
            selfResetTempClassName = self.resetTempClassName,
            licence = fs.readFileSync("./licence.md", "utf8"),
            shortLicence = fs.readFileSync("./shortLicence.md", "utf8"),
            rxCopyRight = /\/\*\s*Copyright \(c\)/g;
        result.forEach(entry => {
            if (entry.type === typeDir) {
                console.log(`Directory Processed: ${entry.src}`)
            }
            else if (entry.src.endsWith(".js")) {
                let content = fs.readFileSync(entry.src, "utf8")
                let m;
                if (content.match(rxCopyRight) === null) {
                    fs.outputFileSync(entry.src, `/*\n${licence}\n*/\n${content}`, function (err) {
                        if (err) {
                            console.log("x   Error: ", err)
                        }
                    })
                }
                const tempClassCode = content.replace(selfFindClassStart, selfTempClassName);
                var terserResult = Terser.minify(tempClassCode);
                const minifiedCode = terserResult.code.replace(selfRxTempClassName, selfResetTempClassName);
                if (terserResult.err) {
                    console.log("Minify Error")
                    fs.outputFileSync(entry.dest, content, function (err) {
                        if (err) {
                            console.log("x   Error: ", err)
                        }
                    })
                }
                else {
                    let outFileContent = `/*${shortLicence}*/${minifiedCode}`
                    let fileExists = false;
                    let fileDiff = true;
                    fs.stat(entry.dest, function (err, stat) {
                        if (err == null) {
                            fileExists = true;
                            let destContent = fs.readFileSync(entry.dest, "utf8")
                            fileDiff = (outFileContent !== destContent);
                        }
                        if (!fileExists || fileDiff) {
                            console.log(`File change written: ${entry.dest}`);
                            fs.outputFileSync(entry.dest, outFileContent, function (err) {
                                if (err) {
                                    console.log("x   Error: ", err)
                                }
                            })
                        }
                        else {
                            console.log(`File unchanged: ${entry.dest}`);
                        }
                    });
                }
            }
            else if (entry.src.endsWith(".json")) {
                const content = fs.readFileSync(entry.src, "utf8")            
                let outFileContent = JSON.stringify(JSON.parse(content))
                let fileExists = false;
                let fileDiff = true;
                fs.stat(entry.dest, function (err, stat) {
                    if (err == null) {
                        fileExists = true;
                        let destContent = fs.readFileSync(entry.dest, "utf8")
                        fileDiff = (outFileContent !== destContent);
                    }
                    if (!fileExists || fileDiff) {
                        console.log(`File change written: ${entry.dest}`);
                        fs.outputFileSync(entry.dest, outFileContent, function (err) {
                            if (err) {
                                console.log("x   Error: ", err)
                            }
                        })
                    }
                    else {
                        console.log(`File unchanged: ${entry.dest}`);
                    }
                });
            }
        })
    }
}