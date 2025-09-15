

export default class FooMap<Key,Value> extends Map {

    constructor(entries?:Array<[Key,Value]>,options?:{
        onChange?:function(this:FooMap<Key,Value>):void;
    });
    /**
     * 
     * @param index used to target pair at index
     * @param isValue used to specify if the returned value is a Key or Value type
     * @returns if value is true returns value at index otherwise returns the key
     */
    at<isValue extends boolean=false>(
        index:number,
        isValue?:isValue,
    ):isValue extends true?Value:Key;
    indexOf<isValue extends boolean=false>(
        item:isValue extends true?Value:Key,
        isValue?:isValue,
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

    /**
     * @deprecated use size instead
     */
    readonly length:number;
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
