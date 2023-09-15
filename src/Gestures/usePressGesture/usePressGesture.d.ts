

export default function usePressGesture(options:{
    element:HTMLElement,
    /**
     * For how long in milliseconds the element should kept pressed to trigger the gesture
     * @default 0
     */
    threshold:number,
    /**
     * Pressing timestamp in milliseconds
     * @default 0
     */
    timestamp:number,
    onStart(event:PressEvent):void,
    onPressing(event:PressEvent):void,
    onEnd(event:PressEvent):void,
}):void;


type PressEvent=Event&{
    readonly duration:Number,
    /**
     * This is a value between 0.0 (no pressure) and 1.0 (the maximum amount of pressure the hardware can recognize)
     */
    readonly force:Number,
    /**
     * Calls cancel and removes the PressEvent listeners
     */
    remove():void;
    /**
     * Cancels the current gesture 
     * @param triggerOnEnd if true, onEnd will be called
     * @default true
     */
    cancel(triggerOnEnd:boolean):void,
}
