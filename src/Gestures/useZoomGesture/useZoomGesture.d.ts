import {PinchEvent} from "./usePinchGesture"


export default function useZoomGesture(options:{
    /**
     * Element to zoom
     */
    element:HTMLElement,
    /**
     * Minimun scale value
     * @default 1
     */
    minScale:number,
    /**
     * Maximum scale value
     * @default 10
     */
    maxScale:number,
    onZoomStart(event:ZoomEvent):void,
    onZoom(event:ZoomEvent):void,
    onZoomEnd():void,
}):void;

interface ZoomEvent extends PinchEvent {
    /**
     * Element translateX value in pixels
     */
    translateX:Number,
    /**
     * Element translateY value in pixels
     */
    translateY:Number,
}
