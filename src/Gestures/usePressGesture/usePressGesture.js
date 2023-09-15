import {isTouchDevice} from "../../index";



export default function usePressGesture(options){
    const {element,threshold=0,timestamp=0,onStart,onPressing,onEnd}=options;
    if(element instanceof HTMLElement){
        const touchable=isTouchDevice();
        const startEvent=touchable?"touchstart":"mousedown";
        const endEvent=touchable?"touchend":"mouseup";
        const onTriggerGesture=(event)=>{
            let pressing=true,triggered=false;
            let start,elapsed,stamptracker=0;
            const toPressEvent=(event)=>{
                event.duration=elapsed-threshold;
                const {changedTouches}=event;
                if(changedTouches){event.force=changedTouches[0].force}
                else{event.force=1}
                if(!triggered){
                    event.cancel=(triggerOnEnd=true)=>{
                        pressing=false;
                        triggered=false;
                        triggerOnEnd&&onEnd&&onEnd(event);
                    }
                    event.remove=()=>{
                        event.cancel();
                        element.removeEventListener(startEvent,onTriggerGesture);
                    }
                }
                return event;
            }
            requestAnimationFrame(function onPressGesture(time){
                if(start===undefined){start=time};
                elapsed=time-start;
                if(triggered){
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
