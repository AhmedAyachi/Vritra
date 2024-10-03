

export default function usePinchGesture(options:{
    element:HTMLElement,
    /**
     * Minimum number of pointers that triggers the pinch gesture
     * @notice Minimum possible value : 1
     * 
     * on Desktop this value is always 1
     * @default 1
     */
    minPointerCount?:Number,
    /**
     * Maximum number of pointers for the pinch gesture.
     * If the number of pointers is higher, the gesture is ended
     * @notice Minimum possible value : 1
     * 
     * on Desktop this value is always 1
     * @default Infinity
     */
    maxPointerCount?:Number,
    onStart(event:PinchEvent):void,
    onMove(event:PinchEvent):void,
    onEnd(event:PinchEvent&{
        /**
         * Removes the gesture listeners
         */
        removeGesture():void,
    }):void,
}):void;

type PinchEvent=TouchEvent&MouseEvent&{
    /**
     * always 1 on desktop
     */
    readonly scale:Number,
    readonly barycenter:{
        readonly x:Number,
        readonly y:Number,
    },
    readonly dx:Number,
    readonly dy:Number,
    readonly distance:Number,
    /**
     * Gesture delta time in milliseconds
     */
    readonly dtime:Number,
}
