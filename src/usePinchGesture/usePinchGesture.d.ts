

export default function usePinchGesture(options:{
    element:HTMLElement,
    /**
     * Minimum number of pointers that triggers the pinch gesture
     * @see Minimum possible value : 2
     * @default 2
     */
    minPointerCount?:Number,
    /**
     * Maximum number of pointers for the pinch gesture.
     * If the number of pointers is high, the gesture is cancelled
     * @see Minimum possible value : 2
     * @default 2
     */
    maxPointerCount?:Number,
    onStart(event:PinchEvent):void,
    onMove(event:PinchEvent):void,
    onEnd(event:PinchEvent):void,
}):void;

interface PinchEvent extends TouchEvent {
    scale:Number,
    barycenter:{x:Number,y:Number},
    dx:Number,
    dy:Number,
    distance:Number,
    dtime:Number,
}
