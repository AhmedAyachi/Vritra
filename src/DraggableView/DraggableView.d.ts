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
    position:DraggableViewPositionSetter,
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
    setPosition(position:DraggableViewPositionSetter,triggerOnMove?:Boolean):void,

}

interface DraggableViewPosition {
    /**
    * X-position relative to parent
    */
    x:Number,
    /**
     * Y-position relative to parent
     */
    y:Number,
}

interface DraggableViewPositionSetter extends DraggableViewPosition {
    /**
     * if true, x and y values will be multiplied respectively by width and height of the parent element.
     * 
     * if false, x and y values are pixel values.
     * @example 
     * x=1 : left value of the draggableview is 100% of the width of its parent
     * y=0.5 : top value of the draggableview is 50% of the height of its parent
     * @default true
     */
    asratio:Boolean,
}

interface DraggableViewCoords extends DraggableViewPosition {
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
