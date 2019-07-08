class {constructor(e){this.collection={}}get collectionLength(){return null==this.collection&&(this.collection={}),Object.keys(this.collection).length}set collectionLength(e){}has(e){return this.collection.hasOwnProperty(e)}get(e){return this.collection[e]}set(e,t){if(!this.has(e.toString()))throw new Error(`Item with key "${e}" does not exist in collection`);this.collection[e]=t}add(e,t){if(this.has(e.toString()))throw new Error(`Item with key "${e}" exists in collection`);this.collection[e.toString()]=t}remove(e){delete this.collection[e.toString()]}get keys(){return Object.keys(this.collection)}values(){var e=this.collection;return this.keys.map(t=>e[t])}toArray(){var e=this.collection;return this.keys.map(t=>[t,e[t]])}keyValues(){var e=this.collection;return this.keys.map(t=>new{key:t,value:e[t]})}clear(){this.keys().forEach(e=>{delete this.collection[e]})}addEach(e){var t=this.collection,r=e.keys;return r.forEach(e=>{if(t.has(e))throw new Error(`Key "${e}" already exists in collection`)}),r.forEach(r=>{var o=Object.assign(e[r]);t.add(r,o)}),t}merge(e){var t=this.collection;return e.keys().forEach(r=>{var o=Object.assign(e[r]);t.has(r)?t.set(r,o):t.add(r,o)}),t}removeEach(e){var t=[],r=this.collection;e.forEach(e=>{r.has(e)&&(r.remove(e),t.push(e))})}forEach(e){this.collection.forEach(element,e)}iterate(e=0,t=1/0,r=1){var o=this.keys();t!==1/0&&t>=o.length&&(t=o.length)}map(e){return this.toArray().map(e)}filter(e){return this.toArray().filter(fnCompare)}reduce(e,t){return this.toArray().reduce(e,t)}reduceRight(e,t){return this.toArray().reverse().reduce(e,t)}group(e){var t={};return this.toArray().map(e).forEach(e=>{t.hasOwnProperty(e.group)||(t[e.group]=[]),t[e.group].push(e.key)}),Object.keys(t).map(e=>t[e].map(e=>e))}}