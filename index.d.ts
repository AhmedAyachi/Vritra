declare module "vanilla";


export {HashRouter} from "./src/HashRouter/HashRouter";
export {default as HashMap} from "./src/HashMap/HashMap";
export {default as View} from "./src/View/View";
export {default as DraggableView} from "./src/DraggableView/DraggableView";
export {default as FlatList} from "./src/FlatList/FlatList";

/**
 * Uses JSON.parse method to parse json parameter but returns null in case of an error
 * @param json json string to parse
 */
export function parseJSON(json:String):any|null;

export function useBlobImageData(blob:Blob,callback:(imageData:ImageData)=>void):ImageData;

/**
 * Returns the duration between two times in seconds
 * @formats 
 * hh:mm:ss 
 * h:m:s
 * h:m::
 * h::
 */
export function getTimeDuration(start:String,end:String):Number;

/**
 * returns an array of objects representing the months of the year;
 * @param isLeapYear
 * if true, february length value would be 29 else 28
 * @default false
 * @property name 
 * @property length : number of days
 */
export function getMonths(isLeapYear:Boolean=false):{name:String,length:Number}[];

/**
 * @param year year to check, default to current year
 */
export function isLeapYear(year?:Number):Boolean;

/**
 * returns an array containing the 7 days of the week
 * @param start first day of the week
 * @default "monday"
 */
export function getDays(start?:"monday"|"tuesday"|"wednesday"|"thursday"|"friday"|"saturday"|"sunday"):String[];

export function useId(startsWith:String):String;
/**
 * @deprecated
 * use useId instead
 */
export function useRef(startsWith:String):String;
export function groupBy<type>(array:type[],filter:(item:type,index:Number,array:type[])=>any):{predicate:any,items:type[]}[];
export function map<type>(array:type[],callback:(item:type,index:Number,array:type[])=>String):String;
export function map(iteration:Number,callback:(index:Number)=>String):String;

export function useSwipeGesture(params:{
    element:HTMLElement,
    /**
     * Minimum swipe length in pixels from start position to the end position that triggers listeners
     * @default 40
     */
    length:number,
    onSwipeLeft(event:SwipeEvent):void,
    onSwipeRight(event:SwipeEvent):void,
}):void;
interface SwipeEvent extends TouchEvent {
    /**
     * Removes the event listener
     */
     removeListener():void,
}

/**
 * @param str String to sanitize
 * @returns string that only contains numbers or letters
 * @see If the string starts with "-" and contains numbers then only numbers are kept 
 */
export function sanitize(str:String):String;

/**
 * 
 * @param element 
 * @param duration fade duration in ms
 * @param callback 
 */
export function fadeIn(element:HTMLElement,duration:Number,callback:()=>void):void;
export function fadeIn(element:HTMLElement,callback:()=>void):void;
/**
 * 
 * @param element 
 * @param duration fade duration in ms
 * @param callback 
 */
export function fadeOut(element:HTMLElement,duration:Number,callback:()=>void):void;
export function fadeOut(element:HTMLElement,callback:()=>void):void;
/**
 * alternates between fadeIn and fadeOut
 * @param element target HTMLElement
 * @param duration fade duration in ms
 * @param callback 
 */
export function toggle(element:HTMLElement,duration:Number,callback:()=>void):void;
export function toggle(element:HTMLElement,callback:()=>void):void;

export function randomColor(from?:String[]):String;
export function createCode(length:Number):String;
export function replaceAt(index:Number,replaceValue:String,targetString:String):String;
export function capitalize(str:String):String;
export function isEmail(str:String):boolean;
export function getArrayMax<type>(array:type[],start:Number,end:Number):{
    value:type,
    index:Number,
};
export function removeItem<type>(array:type[],predicate:(item:type,index:Number,array:type[])=>boolean):type;
export function removeItem<type>(array:type[],item:type):type;
/**
 * 
 * @param array array to search
 * @param predicate 
 * Calls predicate once for each element of the array, in ascending order, 
 * until it finds one where predicate returns true. If such an element is found,
 * an object containing the element and its index is returned, else null is returned.
*/
export function findItem<type>(array:type[],predicate:(item:type,index:Number,array:type[])=>boolean):{value:type,index:number};
export function replaceAll(target:String,searchValue:String,replaceValue:String):String;
export function factorial(n:Number):Number;
/**
 * Extracts all characters between the two limiters specified.
 * Limiters are not included 
 * @param startChar
 * Left limiter character
 * @param endChar
 * Right limiter character
 * @Note
 * Pass empty string as parameter to include first or last character
*/
export function getCharsInBetween(startChar:String,endChar:String,from:String):String;
