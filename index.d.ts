declare module "vanilla";


export {default as DraggableView} from "./src/DraggableView/DraggableView";
export {default as FlatList} from "./src/FlatList/FlatList";
export {default as Modal} from "./src/Modal/Modal";
export {HashRouter} from "./src/HashRouter/HashRouter";

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
 * returns an array containing the 7 days of the week
 * starting with monday
 */
export function getDays():String[];

export function useId(startsWith:String):String;
/**
 * @deprecated
 * use useId instead
 */
export function useRef(startsWith:String):String;
export function groupBy(array:any[],filter:(item:any,index:Number,array:any[])=>any):{predicate:any,items:any[]}[];
export function map(array:any[],callback:(item:any,index:Number,array:any[])=>String):String;
export function map(iteration:Number,callback:(index:Number)=>String):String;
export function useSwipeGesture(params:{
    element:HTMLElement,
    length:number,
    onSwipeLeft(eventRemover:()=>void,eventAdder:()=>void):void,
    onSwipeRight(eventRemover:()=>void,eventAdder:()=>void):void,
}):void;
export const specialchars="+=}°)]@ç^_\\`-|(['{\"#~&²£$¤*µ%ù§!/:.;?,<>";
export function fadeIn(
    element:HTMLElement,
    props:{display:String,duration:Number},
    callback:()=>void,
):void;
export function fadeOut(
    element:HTMLElement,
    duration:Number,
    callback:()=>void,
):void;
export function toggle(
    element:HTMLElement,
    props:{display:String,duration:Number},
    callback:()=>void,
):void;
export function randomColor(from?:String[]):String;
export function createCode(length:Number):String;
export function replaceAt(index:Number,replaceValue:String,targetString:String):String;
export function capitalize(str:String):String;
export function emailCheck(str:String):boolean;
export function getArrayMax(array:any[],start:Number,end:Number):{
    value:any,
    index:Number,
};
export function removeItem(array:any[],predicate:(item:any,index:Number,array:any[])=>boolean):any;
export function removeItem(array:any[],item:any):any;
/**
 * 
 * @param array array to search
 * @param predicate 
 * Calls predicate once for each element of the array, in ascending order, 
 * until it finds one where predicate returns true. If such an element is found,
 * an object containing the element and its index is returned, else null is returned.
*/
export function findItem(array:any[],predicate:(item:any,index:Number,array:any[])=>boolean):{value:any,index:number};
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
