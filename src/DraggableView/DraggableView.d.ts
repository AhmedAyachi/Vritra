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
    /**
     * @param asratio if true returns values as fractions relative to width and height of parent/viewport
     * @default false
     */
    getPosition(asratio:Boolean):DraggableViewPosition,
    /**
     * 
     * @param position 
     * @param triggerOnMove default: true
     */
    setPosition(position:{x:number,y:number},triggerOnMove?:Boolean):void,
    /**
     * 
     * @param ratio
     * @param triggerOnMove default: true
     * 
     * Sets the position of the draggableview with values relative to the width and height of the parent element 
     */
    setPositionRatio(ratio:DraggableViewPositionRatio,triggerOnMove?:Boolean):void,
}
interface DraggableViewCoords {
    /**
     * X-position relative to viewport
     */
     pagex:Number,
     /**
      * Y-position relative to viewport
      */
     pagey:Number,
    /**
     * X-position relative to parent
     */
    x:Number,
    /**
     * Y-position relative to parent
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
}

interface DraggableViewPositionRatio {
    /**
     * value between 0 and 1 relative to parent width
     */
    x:Number,
    /**
     * value between 0 and 1 relative to parent height
     */
    y:Number,
}

interface DraggableViewPosition {
    pagex:Number,pagey:Number,
    x:Number,y:Number,
}
