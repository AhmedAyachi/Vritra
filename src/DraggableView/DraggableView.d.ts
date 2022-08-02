import View from "../View/View";


export default function DraggableView(props:{
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

interface DraggableView extends View {
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
