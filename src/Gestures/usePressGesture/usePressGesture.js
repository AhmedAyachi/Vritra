import {isTouchDevice} from "../../index";



export default function usePressGesture(options){
    const {element,threshold=0,timestamp=0,onStart,onPressing,onEnd}=options;
    if(element instanceof HTMLElement){
        const touchable=isTouchDevice();
        const startEvent=touchable?"touchstart":"mousedown";
        const moveEvent=touchable?"touchmove":"mousemove";
        const endEvent=touchable?"touchend":"mouseup";
        const onTriggerGesture=(event)=>{
            event.stopPropagation();
            let pressing=true,triggered=false;
            let start,elapsed,stamptracker=0;
            const toPressEvent=(event)=>{
                event.duration=elapsed-threshold;
                const {changedTouches}=event;
                if(changedTouches){event.force=changedTouches[0].force}
                else{event.force=1}
                if(!triggered){
                    event.cancelGesture=event.cancel=(triggerOnEnd=true)=>{
                        cancelGesture();
                        triggerOnEnd&&onEnd&&onEnd(event);
                    }
                    event.removeGesture=event.remove=()=>{
                        event.cancelGesture();
                        element.removeEventListener(startEvent,onTriggerGesture);
                    }
                }
                return event;
            }
            requestAnimationFrame(function onPressGesture(time){
                if(start===undefined){start=time};
                elapsed=time-start;
                if(triggered){
                    element.removeEventListener(moveEvent,cancelGesture);
                    if(onPressing&&pressing){
                        toPressEvent(event);
                        if(timestamp>0){
                            const {duration}=event;
                            if(((duration-stamptracker)>=timestamp)||(!stamptracker)){
                                stamptracker=duration;
                                onPressing(event);
                            }
                        }
                        else{onPressing(event)};
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
            const cancelGesture=()=>{
                triggered=false;
                element.removeEventListener(moveEvent,cancelGesture);
                element.removeEventListener(endEvent,onPressEnd);
                onPressEnd();
            }
            const onPressEnd=(event)=>{
                pressing=false;
                if(triggered){
                    onEnd&&onEnd(toPressEvent(event));
                }
            }
            element.addEventListener(moveEvent,cancelGesture,{once:true});
            element.addEventListener(endEvent,onPressEnd,{once:true});
        }
        element.addEventListener(startEvent,onTriggerGesture);
    }
}
