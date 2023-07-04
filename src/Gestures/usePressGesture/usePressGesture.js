import {isTouchDevice} from "../../index";



export default function usePressGesture(options){
    const {element,threshold=0,onStart,onPressing,onEnd}=options;
    if(element instanceof HTMLElement){
        const touchable=isTouchDevice();
        const startEvent=touchable?"touchstart":"mousedown";
        const endEvent=touchable?"touchend":"mouseup";
        const onTriggerGesture=(event)=>{
            let pressing=true,start,elapsed;
            let triggered=false;
            const toPressEvent=(event)=>{
                event.duration=elapsed-threshold;
                const {changedTouches}=event;
                if(changedTouches){event.force=changedTouches[0].force}
                else{event.force=1}
                event.cancel=(triggerOnEnd=true)=>{
                    pressing=false;
                    triggered=false;
                    triggerOnEnd&&onEnd&&onEnd(event);
                }
                event.remove=()=>{
                    event.cancel();
                    element.removeEventListener(startEvent,onTriggerGesture);
                }
                return event;
            }
            requestAnimationFrame(function onPressGesture(time){
                if(!start){start=time};
                elapsed=time-start;
                
                if(triggered){
                    if(pressing){
                        onPressing&&onPressing(toPressEvent(event));
                    }
                }
                else if(elapsed>=threshold){
                    toPressEvent(event);
                    event.duration=0;
                    onStart&&onStart(event);
                    triggered=true;
                }
                pressing&&requestAnimationFrame(onPressGesture);
            });
            element.addEventListener(endEvent,(event)=>{
                pressing=false;
                if(triggered){
                    onEnd&&onEnd(toPressEvent(event));
                }
            },{once:true});
        }
        element.addEventListener(startEvent,onTriggerGesture);
    }
}
