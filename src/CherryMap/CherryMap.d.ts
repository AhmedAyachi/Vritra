

export default class CherryMap extends Map {
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
     * Same as size property
     */
    readonly length:Number;
}
