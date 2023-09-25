

export default function useSwipeGesture(options:{
    element:HTMLElement,
    /**
     * Minimum swipe length in pixels from start position to the end position that triggers listeners
     * @default 40
     */
    length?:number,
    /**
     * Tolerated gesture offset in pixels
     * @default 50
     */
    offset?:number,
    /**
     * The exact number of pointers that triggers the Swipe Gesture.
     * @default 1 
     */
    pointerCount?:number,
    /**
     * Called When the exact number of pointers is detected and the listeners are ready 
     */
    onReady(event:TouchEvent):void,
    /**
     * Called when a swipe gesture is captured
     * @param event 
     */
    onSwipe(event:SwipeEvent):void,
}):void;

interface SwipeEvent extends TouchEvent {
    readonly axis:"horizontal"|"vertical";
    readonly direction:"top"|"left"|"bottom"|"right";
    readonly dx:Number,
    readonly dy:Number,
}
