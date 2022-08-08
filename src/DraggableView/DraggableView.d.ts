import Component from "../Component/Component";


export default function DraggableView(props:{
    parent:Component|HTMLElement,
    id:String,
    className:String,
    /**
     * @param x in 0..1
     * @param y in 0..1
     */
    position:{x:number,y:number},
    horizontalDrag:boolean,
    verticalDrag:boolean,
    style:String,
    onDrag(component:DraggableView,state:DraggableViewState):void,
    onMove(component:DraggableView,state:DraggableViewState):void,
    onDrop(component:DraggableView,state:DraggableViewState):void,
}):DraggableView;

interface DraggableView extends Component {
    setEventListener(
        type:"drag"|"move"|"drop",
        listener:(component:DraggableView,state:DraggableViewState)=>void,
    ):void,
    getPosition():DraggableViewPosition,
    setPosition(position:DraggableViewPosition):void,
}
interface DraggableViewState{
    x:Number,y:Number,
    dragX:Number,dragY:Number,dragDX:Number,dragDY:Number,
    dropX:Number,dropY:Number,dropDX:Number,dropDY:Number,
    onDrag(component:DraggableView,state:DraggableViewState):void,
    onMove(component:DraggableView,state:DraggableViewState):void,
    onDrop(component:DraggableView,state:DraggableViewState):void,

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
