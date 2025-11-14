import {View,ViewProps} from "../View/View";


export default function DraggableView<Tag extends keyof HTMLElementTagNameMap|undefined=undefined>(props:ViewProps<Tag>&{
    position?:DraggableViewPositionSetter,
    /**
     * Sets the DraggableView boundaries
     * 
     * Values can be exceeded with setPosition method
     */
    boundary?:DraggableViewBoundary,
    horizontalDrag?:boolean,
    verticalDrag?:boolean,
    onDrag?(coords:DraggableViewCoords,element:DraggableView<Tag>):void,
    /**
     * @notice No need to use requestAnimationFrame because that would be redundant
     * as onMove is already using it
     */
    onMove?(coords:DraggableViewCoords,element:DraggableView<Tag>):void,
    onDrop?(coords:DraggableViewCoords,element:DraggableView<Tag>):void,
}):Tag extends undefined?DraggableView<"div">:DraggableView<Tag>;

type DraggableView<Tag>=View<Tag>&{
    setEventListener(
        type:"drag"|"move"|"drop",
        listener:(coords:DraggableViewCoords,element:DraggableView<Tag>)=>void,
    ):void,
    /**
     * @param asratio if true returns values as fractions relative 
     * to width and height of parent/viewport
     * @default false
     */
    getPosition(asratio:boolean):DraggableViewPosition,
    /**
     * 
     * @param position 
     * @param triggerOnMove default: true
     */
    setPosition(position:DraggableViewPositionSetter,triggerOnMove?:boolean):void,

}

interface DraggableViewPosition {
    /**
    * X-position relative to its initial position
    */
    readonly x:number,
    /**
     * Y-position relative to its initial position
     */
    readonly y:number,
}

interface DraggableViewBoundary {
    /**
     * minimum x value in pixels
     */
    xmin:number,
    /**
     * maximum x value in pixels
     */
    xmax:number,
    /**
     * minimum y value in pixels
     */
    ymin:number,
    /**
     * maximum y value in pixels
     */
    ymax:number,
}

interface DraggableViewPositionSetter extends DraggableViewPosition {
    /**
     * if true, x and y values will be multiplied respectively by width and height of the parent element.
     * 
     * if false, x and y values are pixel values.
     * @examples 
     * x=1 : left offset of the draggableview is 100% of the width of its parent
     * 
     * y=0.5 : top offset of the draggableview is 50% of the height of its parent
     * @default true when setting the position prop, false when using setPosition method
     */
    asratio?:boolean,
    /**
     * if the value is of type number, an animation is triggered 
     */
    duration?:number,
    /**
     * Animation Easing function. Same as transition-timing-function CSS property.
     * @default "ease-out"
     */
    easing?:string,
}

interface DraggableViewCoords extends DraggableViewPosition {
    /**
     * X-distance relative to last position
     * @notice value is always 0 on onDrag event
     * 
     * \>0 : element went right
     * 
     * \<0 : element went left
     */
    readonly dx:number,
    /**
     * Y-distance relative to last position
     * @notice value is always 0 on onDrag event
     * 
     * \>0 : element went down
     * 
     * \<0 : element went up
     */
    readonly dy:number,
}
