

export default class FooMap extends Map {
    /**
     * 
     * @param index used to target pair at index
     * @param isValue used to specify if the returned value is a Key or Value type
     * @returns if value is true returns value at index otherwise returns the key
     */
    at(index:Number,isValue:Boolean=false):Key|Value;
    /**
     * Returns a frozen array of keys
     */
    keys():Array<any>;
    /**
     * Returns an iterable of keys in the map
     */
    keysAsIterableIterator():IterableIterator<any>;
    /**
     * Returns a frozen array of values
     */
    values():Array<any>;
    /**
     * Returns an iterable of values in the map
     */
    valuesAsIterableIterator():IterableIterator<any>;
    /**
     * Returns a frozen array of frozen key, value pairs for every entry in the map
     */
    entries():Array<[any,any]>;
    /**
     * Returns an iterable of key, value pairs for every entry in the map
     */
    entriesAsIterableIterator():IterableIterator<[any,any]>;
    /**
     * Same as size property
     */
    readonly length:Number;
}
