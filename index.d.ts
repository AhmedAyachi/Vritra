declare module "vritra";


export {default as View,ViewProps,View as ViewInterface} from "./src/View/View";
export {default as Fragment} from "./src/Fragment/Fragment";
export {default as NativeView} from "./src/NativeView/NativeView";
export {default as SideBarNavigator,SideBarNavigatorProps} from "./src/SideBarNavigator/SideBarNavigator";
export {default as DrawerNavigator} from "./src/DrawerNavigator/DrawerNavigator";
export {default as TabNavigator} from "./src/TabNavigator/TabNavigator";
export {default as Switch} from "./src/Switch/Switch";
export {default as PopupView} from "./src/PopupView/PopupView";
export {default as ActionSetView} from "./src/ActionSetView/ActionSetView";
export {default as Accordion,AccordionView} from "./src/Accordion/Accordion";
export {default as Palette} from "./src/Palette/Palette";
export {default as FlatList} from "./src/FlatList/FlatList";
export {default as DraggableView,} from "./src/DraggableView/DraggableView";
export {default as FooMap} from "./src/FooMap/FooMap";
export {HashRouter} from "./src/HashRouter/HashRouter";
export {useZoomGesture,usePinchGesture,useSwipeGesture,usePressGesture} from "./src/Gestures";
export {default as withSequence} from "./src/withSequence/withSequence";


/**
 * 
 * @param hexcolor 
 * @param asarray if true the color rgba representation is returned an an array of decimals [r,g,b,a]
 * @default false
 */
export function hexColorToRGBA<AsArray extends boolean|undefined>(hexcolor:string,asArray:AsArray):AsArray extends true?number[]:string;

export function hexToDecimal(hexcode:string):number;

/**
 * 
 * @param invalue 
 * Value from within the input range that should be mapped to a value from the output range
 * @param inrange 
 * An array of numbers that contains points that indicate the range of the input value. 
 * Values should be increasing
 * @param outrange 
 * An array of numbers that contains points that indicate the range of the output value. 
 * It should have the exact same number of points as the input range.
 * @param extrapolationType >
 * - extend : approximates the value even outside the range
 * - clamp : clamps the value to the edge of the output range
 * - identity : returns the value that is being interpolated
 * @default "extend"
 */
export function interpolate(
    invalue:number,
    inrange:number[],
    outrange:number[],
    extrapolationType:"extend"|"clamp"|"identity",
):number;

/**
 * @param date supported delimiters: "/" "-" " " ","
 * @param format date format:
 * 
 * "dmy" : day-month-year
 * 
 * "mdy" : month-day-year
 * 
 * "ymd" : year-month-day
 * @default "dmy"
 * @param offset 
 * 
 * 1 will return tomorrow's date
 * 
 * -1 will return yesterday's date
 * @default 1
 * @returns a date with the chosen format
 */
export function getAdjacentDate(date:string,format:"dmy"|"mdy"|"ymd",offset=1):string;
export function getAdjacentDate(date:string,offset=1):string;

/**
 * Returns true if device supports touch gestures
 */
export function isTouchDevice():boolean;

/**
 * returns a random item from an array 
 * @param array
 */
export function randomItem<Type>(array:Type[]):Type;

/**
 * Uses JSON.parse method to parse json parameter but returns null in case of an error
 * @param json json string to parse
 */
export function parseJSON(json:string):any|null;

/**
 * Extratcts ImageData from Blob
 * @param blob 
 * @param callback 
 */
export function useBlobImageData(blob:Blob,callback:(imageData:ImageData)=>void):void;

/**
 * Returns the duration between two times in seconds
 * @formats 
 * hh:mm:ss 
 * h:m:s
 * h:m::
 * h::
 */
export function getTimeDuration(start:string,end:string):number;

/**
 * returns an array of objects representing the months of the year
 * @param isLeapYear
 * if true, february daycount value would be 29 else 28
 * @default false
 * @property name 
 * @property length : number of days
 */
export function getMonths(isLeapYear=false):{
    name:string,
    ordinal:number,
    daycount:number,
}[];

/**
 * @param year year to check, default to current year
 */
export function isLeapYear(year?:number):boolean;

/**
 * returns an array containing the 7 days of the week with start as first day
 * @param start first day of the week
 * @default "monday"
 */
export function getDays(first?:"monday"|"tuesday"|"wednesday"|"thursday"|"friday"|"saturday"|"sunday"):string[];
/**
 * Returns a random string
 * @param prefix 
 * A string prefixing the random part
 * @param length random part length
 * @default prefix "" length 15
 */
export function randomId(prefix="",length=15):string;
/**
 * 
 * @deprecated renamed to randomId and will be removed in future version
 */
export function useId(prefix="",separator="_"):string;

export function groupBy<Type>(array:Type[],filter:(item:Type,index:number,array:Type[])=>any):{predicate:any,items:Type[]}[];

export function map<Type>(array:Type[],callback:(item:Type,index:number,array:Type[])=>string):string;
export function map(iteration:number,callback:(index:number)=>string):string;

/**
 * @param str string to sanitize
 * @param whitelist Characters to keep in addition to letters, numbers and spaces
 * @returns string that only contains numbers, letters and spaces along with the whitelisted characters
 * @notice If the string starts with "-" or "+" followed by a number and there are no whitelisted characters
 * then only numbers are kept along with "-"/"+"
 */
export function sanitize(str:string,whitelist?:string):string;
/**
 * @param escape if true, certain characters will be replaced by a hexadecimal escape sequence 
 * @param whitelist characters to skip escaping, skips spaces by default
 * @default " "
 */
export function sanitize(str:string,escape?:boolean,whitelist?:string):string;

/**
 * 
 * @param element 
 * @param display element display value when visible, default: element's display value when fadeIn called
 * @param duration fade duration in ms, default: 200
 * @param callback 
 * @returns the element
 */
export function fadeIn<Type extends HTMLElement>(element:Type,display:string,duration:number,callback:()=>void):Type;
export function fadeIn<Type extends HTMLElement>(element:Type,duration:number,callback:()=>void):Type;
export function fadeIn<Type extends HTMLElement>(element:Type,callback:()=>void):Type;
/**
 * 
 * @param element 
 * @param duration fade duration in ms, default: 200 
 * @param callback 
 * @returns the element
 */
export function fadeOut<Type extends HTMLElement>(element:Type,duration:number,callback:()=>void):Type;
export function fadeOut<Type extends HTMLElement>(element:Type,callback:()=>void):Type;

/**
 * 
 * @param andFrom
 * Array of colors to add to the possible returned values 
 * @returns 
 * hsl(*,100%,50%) color in rgb format 
 * or a color from the andFrom array if specified
 */
export function randomColor(andFrom?:string[]):string;
export function createCode(length:number):string;
export function replaceAt(index:number,replaceValue:string,targetstring:string):string;

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
export function capitalize(str:string,count=0):string;

export function isEmail(str:string):boolean;

export function removeItem<Type>(array:Type[],predicate:(item:Type,index:number,array:Type[])=>boolean):Type;
export function removeItem<Type>(array:Type[],item:Type):Type;
/**
 * 
 * @param array array to search
 * @param predicate 
 * Calls predicate once for each element of the array, in ascending order, 
 * until it finds one where predicate returns true. If such an element is found,
 * an object containing the element and its index is returned, else null is returned.
 * @param descending default to false
*/
export function findItem<Type>(
    array:Type[],
    predicate:(item:Type,index:number,array:Type[])=>boolean,
    descending:boolean,
):{value:Type,index:number};
export function replaceAll(target:string,searchValue:string,replaceValue:string):string;
export function factorial(n:number):number;
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
export function getCharsInBetween(startChar:string,endChar:string,from:string):string;
