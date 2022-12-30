declare module "vanilla";


export {default as PopupView} from "./src/PopupView/PopupView";
export {default as ActionSetView} from "./src/ActionSetView/ActionSetView";
export {default as AccordionView} from "./src/AccordionView/AccordionView";
export {default as ColorPicker} from "./src/ColorPicker/ColorPicker";
export {default as FlatList} from "./src/FlatList/FlatList";
export {default as DraggableView} from "./src/DraggableView/DraggableView";
export {default as View} from "./src/View/View";
export {default as HashMap} from "./src/HashMap/HashMap";
export {HashRouter} from "./src/HashRouter/HashRouter";

/**
 * returns a random item for an array 
 * @param array
 */
export function randomItem<type>(array:type[]):type;

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
export function getMonths(isLeapYear=false):{name:String,length:Number}[];

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
     * @see Minimum possible value : 40
     * @default 40
     */
    length:number,
    onSwipeLeft(event:SwipeEvent):void,
    onSwipeRight(event:SwipeEvent):void,
    onSwipeTop(event:SwipeEvent):void,
    onSwipeBottom(event:SwipeEvent):void,
}):void;
interface SwipeEvent extends TouchEvent {
    /**
     * Removes the event listener
     */
     removeListener():void,
}

/**
 * @param str String to sanitize
 * @param whitelist Characters to keep in addition to letters, numbers and spaces
 * @returns string that only contains numbers, letters and spaces along with the whitelisted characters
 * @see If the string starts with "-" or "+" followed by a number and there are no whitelisted characters
 * then only numbers are kept along with "-"/"+"
 */
export function sanitize(str:string,whitelist?:string):String;
/**
 * @param escape if true, certain characters will be replaced by a hexadecimal escape sequence 
 * @param whitelist characters to skip escaping, skips spaces by default
 * @default " "
 */
export function sanitize(str:string,escape?:boolean,whitelist?:string):String;

/**
 * 
 * @param element 
 * @param display element display value when visible, default: element's display value when fadeIn called
 * @param duration fade duration in ms, default: 200
 * @param callback 
 */
export function fadeIn(element:HTMLElement,display:String,duration:Number,callback:()=>void):void;
export function fadeIn(element:HTMLElement,duration:Number,callback:()=>void):void;
export function fadeIn(element:HTMLElement,callback:()=>void):void;
/**
 * 
 * @param element 
 * @param duration fade duration in ms, default: 200 
 * @param callback 
 */
export function fadeOut(element:HTMLElement,duration:Number,callback:()=>void):void;
export function fadeOut(element:HTMLElement,callback:()=>void):void;
/**
 * alternates between fadeIn and fadeOut
 * @param element target HTMLElement
 * @param props 
 * display: element display (flex,block,...), default: block
 * duration: fade duration in ms, default: 200
 * @param callback 
 */
export function toggle(
    element:HTMLElement,
    props:{display:String,duration:Number},
    callback:()=>void,
):void;
export function toggle(element:HTMLElement,callback:()=>void):void;

export function randomColor(from?:String[]):String;
export function createCode(length:Number):String;
export function replaceAt(index:Number,replaceValue:String,targetString:String):String;

/**
 * 
 * @param str string to capitalize
 * @param count number of words to capitalize
 * 
 * 0 => all
 * 
 * 2 => first two words
 * @default 0 => all
 */
export function capitalize(str:String,count=0):String;

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
