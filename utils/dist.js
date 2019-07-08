const fs = require("fs-extra");
const path = require('path');
const dir = path.resolve(__dirname, "../src");

fs.readdir(dir, function(err,list){
    console.log(list)
})

// function filewalker(dir, done) {
//     let results = [];

//     fs.readdir(dir, function(err, list) {
//         if (err) return done(err);

//         var pending = list.length;

//         if (!pending) return done(null, results);

//         list.forEach(function(file){
//             const f1 = file;
//             file = path.resolve(dir, file);

//             fs.stat(file, function(err, stat){
//                 // If directory, execute a recursive call
//                 if (stat && stat.isDirectory()) {
//                     // Add directory to array [comment if you need to remove the directories from the array]
//                     results.push(f1);

//                     filewalker(file, function(err, res){
//                         results = results.concat(res);
//                         if (!--pending) done(null, results);
//                     });
//                 } else {
//                     results.push(file);

//                     if (!--pending) done(null, results);
//                 }
//             });
//         });
//     });
// };
// console.log(dir)
// function log(err,result){
//     // result.forEach(resFile=>{
//     //     async function example () {
//     //         const { bytesRead, buffer } = await fs.read(fd, Buffer.alloc(length), offset, length, position)
//     //     }
//     // })
//     console.log(result)
// }
// filewalker(dir, log);