declare module "vanilla";


export function HashRouter(
    target:HTMLElement,
    routes:[{
        hash:String,
        memorize:boolean,
        component:(props:{parent:HTMLElement})=>HTMLElement,
    }]
):void;

interface DraggableView extends HTMLElement{
    setEventListener(
        type:"drag"|"move"|"drop",
        listener:(element:DraggableView,state:DraggableViewState)=>void
    ):void,
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
    ref:String,
    className:String,
    horizontalDrag:boolean,
    verticalDrag:boolean,
    onDrag(element:DraggableView,state:DraggableViewState):void,
    onMove(element:DraggableView,state:DraggableViewState):void,
    onDrop(element:DraggableView,state:DraggableViewState):void,
}):DraggableView;

interface FlatList extends HTMLElement{
    addItems(items:any[],renderItem:(props:{parent:HTMLElement,item:any,index:Number,data:any[]})=>HTMLElement):void,
    showItems(items:any[]):void,
    container:HTMLElement,
}
export function FlatList(props:{
    parent:HTMLElement,
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
    onSwipe(params:{direction:String,index:Number,container:HTMLElement}):void,
    onReachEnd(container:HTMLElement):void,
}):FlatList;

interface Modal extends HTMLElement{
    show(display:String,callback:()=>void):void,
    hide(callback:()=>void):void,
}
export function Modal(props:{
    parent:HTMLElement,
    ref:String,
    className:String,
    onMount(element:Modal):void,
}):Modal;

export function useRef(startsWith:String):String;
export function map(array:any[],callback:(item:any,index:Number,array:any[])=>String):String;
export function map(iteration:Number,callback:(index:Number)=>String):String;
export function useSwipeGesture(params:{
    element:HTMLElement,
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
export function removeItem(array:any[],predicate:(item:any,index:Number,array:any[])=>void):void;
export function replaceAll(target:String,searchValue:String,replaceValue:String):String;
export function factorial(n:Number):Number;
export function getCharsInBetween(startChar:String,endChar:String,from:String):String;
