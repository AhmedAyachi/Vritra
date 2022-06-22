declare module "vanilla";


export function HashRouter(
    target:HTMLElement,
    routes:[{
        hash:String,
        memorize:boolean,
        component:(props:{parent:HTMLElement})=>HTMLElement,
    }]
):void;

interface DraggableViewPosition{
    /**
     * value in 0..1
    */
    x:number,
    /**
     * value in 0..1
    */
    y:number,
}
interface DraggableView extends HTMLElement{
    setEventListener(
        type:"drag"|"move"|"drop",
        listener:(element:DraggableView,state:DraggableViewState)=>void,
    ):void,
    getPosition():DraggableViewPosition,
    setPosition(position:DraggableViewPosition):void,
}
interface DraggableViewState{
    x:Number,y:Number,
    dragX:Number,dragY:Number,dragDX:Number,dragDY:Number,
    dropX:Number,dropY:Number,dropDX:Number,dropDY:Number,
    onDrag(element:DraggableView,state:DraggableViewState):void,
    onMove(element:DraggableView,state:DraggableViewState):void,
    onDrop(element:DraggableView,state:DraggableViewState):void,

}
export function DraggableView(props:{
    parent:HTMLElement,
    id:String,
    /**
     * @deprecated
     * use id prop instead
     */
    ref:String,
    className:String,
    /**
     * @param x in 0..1
     * @param y in 0..1
     */
    position:{x:number,y:number},
    horizontalDrag:boolean,
    verticalDrag:boolean,
    style:String,
    onDrag(element:DraggableView,state:DraggableViewState):void,
    onMove(element:DraggableView,state:DraggableViewState):void,
    onDrop(element:DraggableView,state:DraggableViewState):void,
}):DraggableView;

interface FlatList extends HTMLElement{
    addItems(items:any[]):void,
    showItems(items:any[],renderItem:(props:{parent:HTMLElement,item:any,index:Number,data:any[]})=>HTMLElement):void,
    container:HTMLElement,
}
export function FlatList(props:{
    parent:HTMLElement,
    id:String,
    /**
     * @deprecated
     * use id prop instead
     */
    ref:String,
    className:String,
    containerClassName:String,
    popupClassName:String,
    data:any[],
    horizontal:boolean,
    backwards:boolean,
    pagingEnabled:boolean,
    threshold:Number,
    transition:String,
    renderItem(props:{parent:HTMLElement,item:any,index:Number,data:any[]}):HTMLElement,
    onSwipe(params:{direction:"left"|"right",index:Number,container:HTMLElement}):void,
    onReachEnd(container:HTMLElement):void,
}):FlatList;

interface Modal extends HTMLElement{
    show(display:String,callback:()=>void):void,
    hide(callback:()=>void):void,
}
export function Modal(props:{
    parent:HTMLElement,
    id:String,
    /**
     * @deprecated
     * use id prop instead
     */
    ref:String,
    className:String,
    onMount(element:Modal):void,
}):Modal;

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
 * an object containing the element and its index is returned
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
