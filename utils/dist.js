const fs = require("fs-extra");
const path = require('path');
const Terser = require("terser");
const dirSrc = path.resolve(__dirname, "../src");
const dirDest = path.resolve(__dirname, "../dist");
const typeDir = 0;
const typeFile = 1;
const findClassStart = /^\s*class\s+{/
function buildSourceDistributionList(src, dest, done) {
    let results = [];
    fs.readdir(src, function (err, list) {
        if (err) return done(err);

        var pending = list.length;

        if (!pending) return done(null, results);

        list.forEach(function (file) {
            //const f1 = file;
            const fileSrc = path.resolve(src, file),
                fileDest = path.resolve(dest, file);


            fs.stat(fileSrc, function (err, stat) {
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    // Add directory to array [comment if you need to remove the directories from the array]
                    results.push({ src: fileSrc, dest: fileDest, type: typeDir });
                    buildSourceDistributionList(fileSrc, fileDest, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    results.push({ src: fileSrc, dest: fileDest, type: typeFile });
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};
function processEntries(err, result) {
    result.forEach(entry => {
        if (entry.type === typeDir) {
            console.log(`Directory Processed: ${entry.src}`)
        }
        else if (entry.src.endsWith(".js")) {
            console.log(`File Processed: ${entry.dest}`);
            const content = fs.readFileSync(entry.src, "utf8")
            const regex = /^\s*class\s+{/m;
            const str = content;
            const subst = `class é {`;

            const result = str.replace(regex, subst);
            var code = result;
            var tresult = Terser.minify(code);
            const regex1 = /^\s*class é\s*{/m;
            const str1 = tresult.code;
            const subst1 = `class {`;

            const result1 = str1.replace(regex1, subst1);

            if(tresult.err){
                console.log("Minify Error")
                fs.outputFileSync(entry.dest, content, function (err) {
                    if (err) {
                        console.log("x   Error: ", err)
                    }
                })
            }
            else{
                fs.outputFileSync(entry.dest, result1, function (err) {
                    if (err) {
                        console.log("x   Error: ", err)
                    }
                })
            }

        }
    })
}
buildSourceDistributionList(dirSrc, dirDest, processEntries);