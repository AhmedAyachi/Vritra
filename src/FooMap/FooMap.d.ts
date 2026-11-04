

export default class FooMap<Key,Value> implements Omit<
    Map<Key,Value>,
    "set"|"keys"|"values"|"entries"|"forEach"
    > {
    constructor(entries?:Array<[Key,Value]>,options?:{
        onChange?:(this:FooMap<Key,Value>)=>void;
    });
    /**
     * 
     * @param index used to target pair at index
     * @param isValue used to specify if the returned value is a Key or Value type
     * @returns if isValue is true, it returns value at index otherwise returns the key
     */
    at<isValue extends boolean=false>(
        index:number,
        isValue?:isValue,
    ):isValue extends true?Value:Key;
    /**
     * 
     * @param item
     * @param inValues if true, it looks for the item among values otherwise among keys.
     */
    indexOf<inValues extends boolean=false>(
        item:inValues extends true?Value:Key,
        inValues?:inValues,
    ):number;
    /**
     * Returns a frozen array of keys
     */
    keys():Array<Key>;
    /**
     * @returns an iterator for keys
     */
    keyIterator():FooIterator<Key>;
    /**
     * Returns an iterable of keys in the map
     */
    keyIterableIterator():IterableIterator<Key>;
    /**
     * Returns a frozen array of values
     */
    values():Array<Value>;
    /**
     * @returns an iterator for values
     */
    valueIterator():FooIterator<Value>;
    /**
     * Returns an iterable of values in the map
     */
    valueIterableIterator():IterableIterator<Value>;
    /**
     * Returns a frozen array of frozen key, value pairs for every entry in the map
     */
    entries():Array<[Key,Value]>;
    /**
     * Returns an iterable of key, value pairs for every entry in the map
     */
    entryIterableIterator():IterableIterator<[Key,Value]>;
    /* Map fields */
    /**
     * Adds a new element with a specified key and value to the Map. If an element with the same key already exists, the element will be updated.
     */
    set(key:Key,value:Value):this;
    get(key:Key):Value|undefined;
    has(key:Key):boolean;
    clear():void;
    delete(key:Key):boolean;
    /**
     * Executes a provided function once per each key/value pair in the Map, in insertion order.
     */
    forEach(callbackfn:(value:Value,key:Key,map:this)=>void,thisArg?:any):void;
    readonly size:number;
    readonly [Symbol.toStringTag]:string;
    [Symbol.iterator]():IterableIterator<[Key,Value]>;
}


interface FooIterator<Type> {
    next():{
        done:boolean,
        value:Type,
    };
    /**
     * the item returned by the last next call.
     */
    readonly current:Type|null;
    /**
     * the index of the current item
     */
    readonly currentIndex:number;
    /**
     * true if the iterator has more items
     */
    readonly hasNext:boolean;
    /**
     * @returns the removed item returned by the previous next call.
     * @throws if no item to remove 
     */
    remove():Type;
}
