declare module "vanilla";


export function HashRouter(
    target:HTMLElement,
    routes:[{
        hash:string,
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
    x:number,y:number,
    dragX:number,dragY:number,dragDX:number,dragDY:number,
    dropX:number,dropY:number,dropDX:number,dropDY:number,
    onDrag(element:DraggableView,state:DraggableViewState):void,
    onMove(element:DraggableView,state:DraggableViewState):void,
    onDrop(element:DraggableView,state:DraggableViewState):void,

}
export function DraggableView(props:{
    parent:HTMLElement,
    ref:string,
    className:string,
    horizontalDrag:boolean,
    verticalDrag:boolean,
    onDrag(element:DraggableView,state:DraggableViewState):void,
    onMove(element:DraggableView,state:DraggableViewState):void,
    onDrop(element:DraggableView,state:DraggableViewState):void,
}):DraggableView;

interface FlatList extends HTMLElement{
    addItems(items:any[]):void,
}
export function FlatList(props:{
    parent:HTMLElement,
    ref:string,
    className:string,
    containerClassName:string,
    data:any[],
    horizontal:boolean,
    pagingEnabled:boolean,
    threshold:number,
    transition:string,
    renderItem(props:{parent:HTMLElement,item:any,index:number,data:any[]}):HTMLElement,
    onReachEnd(container:HTMLElement):void,
}):FlatList;

interface Modal extends HTMLElement{
    show(display:string,callback:()=>void):void,
    hide(callback:()=>void):void,
}
export function Modal(props:{
    parent:HTMLElement,
    ref:string,
    className:string,
    onMount(element:Modal):void,
}):Modal;

export function useRef(startsWith:string):string;
export function map(array:any[],callback:(item:any,index:number,array:any[])=>string):string;
export function setSwipeAction(params:{
    element:HTMLElement,
    onSwipeLeft():void,
    onSwipeRight():void,
}):void;
export const specialchars="+=}°)]@ç^_\\`-|(['{\"#~&²£$¤*µ%ù§!/:.;?,<>";
export function fadeIn(
    element:HTMLElement,
    props:{display:string,duration:number},
    callback:()=>void,
):void;
export function fadeOut(
    element:HTMLElement,
    duration:number,
    callback:()=>void,
):void;
export function toggle(
    element:HTMLElement,
    props:{display:string,duration:number},
    callback:()=>void,
):void;
export function randomColor(
    style:"color"|"hue-rotate",
    colors:string[],
):string;
export function createCode(length:number):string;
export function replaceAt(index:number,replaceValue:string,targetString:string):string;
export function capitalize(str:string):string;
export function emailCheck(str:string):boolean;
export function getArrayMax(array:any[],start:number,end:number):{
    value:any,
    index:number,
};
export function removeItem(array:any[],predicate:(item:any,index:number,array:any[])=>void):void;
export function replaceAll(target:string,searchValue:string,replaceValue:string):string;
export function factorial(n:number):number;
export function getCharsInBetween(startChar:string,endChar:string,from:string):string;
