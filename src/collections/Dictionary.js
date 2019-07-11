/*
Copyright (c) 2019 Martin Ruppersburg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
class {
    constructor(options) {        
        this.collection = {}
    }
    get collectionLength() {
        var self = this;
        if (self.collection == undefined) {
            self.collection = {}
        }
        return Object.keys(self.collection).length
    }
    set collectionLength(value) { }
    has(key) { return this.collection.hasOwnProperty(key) }
    get(key) { return this.collection[key] }
    set(key, value) {
        if (this.has(key.toString())) {
            this.collection[key] = value
        }
        else {
            throw new Error(`Item with key "${key}" does not exist in collection`)
        }
    }
    add(key, value) {
        if (this.has(key.toString())) {
            throw new Error(`Item with key "${key}" exists in collection`)
        }
        else {
            this.collection[key.toString()] = value
        }
    }
    remove(key) { delete this.collection[key.toString()] }
    get keys() { return Object.keys(this.collection) }
    values() {
        var self = this,
            collection = self.collection;
        return self.keys.map(key => collection[key]);
    }
    toArray() {
        var self = this,
            collection = self.collection;
        return self.keys.map(key => [key, collection[key]]);
    }
    keyValues() {
        var self = this,
            collection = self.collection;
        return self.keys.map(key => new { key: key, value: collection[key] });
    }
    clear() {
        var keys = this.keys();
        keys.forEach(key => {
            delete this.collection[key];
        })
    }
    addEach(values) {
        var collection = this.collection;
        var keys = values.keys;

        keys.forEach(key => {
            if (collection.has(key)) {
                throw new Error(`Key "${key}" already exists in collection`)
            }
        })
        keys.forEach(key => {
            var newValue = Object.assign(values[key])
            collection.add(key, newValue)
        })
        return collection
    }
    merge(values) {
        var collection = this.collection;
        var keys = values.keys();

        keys.forEach(key => {
            var newValue = Object.assign(values[key])
            if (collection.has(key)) {
                collection.set(key, newValue)
            }
            else {
                collection.add(key, newValue)
            }
        })
        return collection
    }
    removeEach(keys) {
        var deleted = [];
        var collection = this.collection
        keys.forEach(key => {
            if (collection.has(key)) {
                collection.remove(key);
                deleted.push(key);
            }
        })
    }
    forEach(callback) {
        var collection = this.collection;
        collection.forEach(element, callback);
    }
    iterate(start = 0, end = Infinity, step = 1) {
        var self = this,
            keys = self.keys();
        let nextIndex = start;
        let iterationCount = 0;
        if (end !== Infinity && end >= keys.length) {
            end = keys.length;
        }
        const iterator = {
            next: function () {
                let result;
                if (nextIndex <= end) {
                    result = { value: collection[keys[nextIndex]], done: false }
                    nextIndex += step;
                    iterationCount++;
                    return result;
                }
                return { value: iterationCount, done: true }
            }
        }
    }
    map(fn) {
        return this.toArray().map(fn);
    }
    filter(comparator) {
        return this.toArray().filter(fnCompare)
    }
    reduce(callback, basis) {
        return this.toArray().reduce(callback, basis)
    }
    reduceRight(callback, basis) {
        return this.toArray().reverse().reduce(callback, basis)
    }
    group(fnGroup) {
        var groups = {}
        this.toArray().map(fnGroup).forEach(element => {
            if (!groups.hasOwnProperty(element.group)) {
                groups[element.group] = [];
            }
            groups[element.group].push(element.key)
        })
        return Object.keys(groups).map(key => groups[key].map(k => k));
    }

    /*
    
    some(callback, thisp?)
    Returns whether any entry in this collection passes a given test.
    
    every(callback, thisp?)
    Returns whether every entry in this collection passes a given test.
    
    any()
    Returns whether any value in the collection is truthy.
    
    all()
    Returns whether all values in the collection are truthy.
    
    one()
    Returns one, arbitrary value from this collection, or undefined if there are none.
    
    only()
    Returns the only value in this collection, or undefined if there is more than one value, or if there are no values in the collection.
    
    sorted(compare?)
    Returns a sorted array of the values in this collection.
    
    reversed()
    Returns a copy of this collection with the values in reverse order.
    
    join(delimiter?)
    Returns a string of all the values in the collection delimited by the given string.
    
    sum(zero?)
    Returns the sum of all values in this collection.
    
    average()
    Returns the arithmetic mean of the collection, by computing its sum and the count of values and returning the quotient.
    
    min()
    Returns the smallest value in this collection.
    
    max()
    Returns the largest value in this collection.
    
    zip(...iterables)
    Returns an array of the respective values in this collection and in each collection provided as an argument.
    
    enumerate(start?)
    Returns an array of [index, value] entries for each value in this collection, counting all values from the given index.
    
    concat(...iterables)
    Returns a new collection of the same type containing all the values of itself and the values of any number of other iterable collections in order.
    
    flatten()
    Assuming that this is a collection of collections, returns a new collection that contains all the values of each nested collection in order.
    
    toArray()
    Returns an array of each value in this collection.
    
    toObject()
    Returns an object with each property name and value corresponding to the entries in this collection.
    
    toJSON()
    Used by JSON.stringify to create a JSON representation of the collection.
    
    equals(value, equals?)
    Returns whether this collection is equivalent to the given collection.
    
    clone(depth?, memo?)
    Creates a deep replica of this collection.
    
    constructClone(values?)
    Creates a shallow clone of this collection.
    
    addMapChangeListener(listener, token?, beforeChange?)
    Adds a listener for when the value for a key changes, or when entries are added or removed.
    
    addBeforeMapChangeListener(listener, token?)
    Adds a listener for before map entries are created, deleted, or updated.
    
    removeMapChangeListener(listener, token?, beforeChange?)
    Unregisters a map change listener provided by addMapChangeListener.
    
    removeBeforeMapChangeListener(listener, token?)
    Unregisters a map change listener provided by addBeforeMapChangeListener or addMapChangeListener with the beforeChange flag.
    
    dispatchMapChange(key, value, beforeChange?)
    Informs map change listeners that an entry was created, deleted, or updated.
    
    dispatchBeforeMapChange(key, value)
    Informs map change listeners that an entry will be created, deleted, or updated.
    
    addOwnPropertyChangeListener(key, listener, beforeChange?)
    Adds a listener for an owned property with the given name.
    
    addBeforeOwnPropertyChangeListener(name, listener)
    Adds a listener for before a property changes.
    
    removeOwnPropertyChangeListener(name, listener, beforeChange?)
    Unregisters a property change listener provided by addOwnPropertyChangeListener.
    
    removeBeforeOwnPropertyChangeListener(key, listener)
    Unregisters a property change listener provided by addBeforeOwnPropertyChangeListener or addOwnPropertyChangeListener with the beforeChange flag.
    
    dispatchOwnPropertyChange(key, value, beforeChange?)
    Informs property change listeners that the value for a property name has changed.
    
    dispatchBeforeOwnPropertyChange(key, value)
    Informs property change listeners that the value for a property name will change.
    
    makePropertyObservable(name)
    May perform internal changes necessary to dispatch property changes for a particular name.
    */
}