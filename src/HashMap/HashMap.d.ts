

export default class HashMap extends Map {
    /**
     * 
     * @param index used to target pair at index
     * @param isValue used to specify if the returned value is a Key or Value type
     * @returns if value is true returns value at index otherwise returns the key
     */
    at(index:Number,isValue:Boolean=false):Key|Value;
    /**
     * Same as size property
     */
    readonly length:Number;
}
