import {View} from "../View/View";


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
    onDrag(coords:DraggableViewCoords,element:DraggableView):void,
    onMove(coords:DraggableViewCoords,element:DraggableView):void,
    onDrop(coords:DraggableViewCoords,element:DraggableView):void,
}):DraggableView;

interface DraggableView extends View {
    setEventListener(
        type:"drag"|"move"|"drop",
        listener:(coords:DraggableViewCoords,element:DraggableView)=>void,
    ):void,
    getPosition():DraggableViewPosition,
    /**
     * 
     * @param position 
     * @param triggerOnMove default: true
     */
    setPosition(position:DraggableViewPositionSetter,triggerOnMove?:Boolean):void,
}
interface DraggableViewCoords {
    /**
     * X-position relative to viewport
     */
    x:Number,
    /**
     * Y-position relative to viewport
     */
    y:Number,
    /**
     * X-distance relative to last position
     * @see value is always 0 on onDrop event
     * 
     * \>0 : element went right
     * 
     * \<0 : element went left
     */
    dx:Number,
    /**
     * Y-distance relative to last position
     * @see value is always 0 on onDrop event
     * 
     * \>0 : element went down
     * 
     * \<0 : element went up
     */
    dy:Number,
    /**
     * X-position relative to parent
     */
    px:Number,
    /**
     * Y-position relative to parent
     */
    py:Number,
}

interface DraggableViewPositionSetter {
    /**
     * value between 0..1 relative to parent width
     */
    x:Number,
    /**
     * value between 0..1 relative to parent height
     */
    y:Number,
}

interface DraggableViewPosition extends DraggableViewPositionSetter {
    px:Number,py:Number,
    /**
     * value between 0 and 100 relative to viewport width
    */
    xpercent:Number
    /**
     * value between 0 and 100 relative to viewport height
    */
    ypercent:Number,
    /**
     * value between 0 and 100 relative to parent width
    */
    pxpercent:Number
    /**
     * value between 0 and 100 relative to parent height
    */
    pypercent:Number,
}
