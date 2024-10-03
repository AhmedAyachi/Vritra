import {isTouchDevice} from "../../index";
import {getBaryCenter} from "../index";


export default function usePinchGesture(options){
    const {element,onStart,onMove,onEnd}=options;
    const state={
        barycenter:null,
        stime:null,
        perimeter:null,
        hasNoScale:true,//Check if the TouchEvent has no read-only scale property 
        minPointerCount:Math.max(1,options.minPointerCount||0),
        maxPointerCount:Math.max(1,options.maxPointerCount||Infinity),
        touchable:isTouchDevice(),
    },{minPointerCount,maxPointerCount,touchable}=state;
    const startEvent=touchable?"touchstart":"mousedown";
    const moveEvent=touchable?"touchmove":"mousemove";
    const endEvent=touchable?"touchend":"mouseup";
    function onStartGesture(event){
        state.hasNoScale=event.scale===undefined;
        const touchlist=touchable&&event.touches,touchcount=touchable?touchlist.length:1;
        if(touchcount>maxPointerCount){
            endPinchGesture();
        }
        else if(touchcount>=minPointerCount){
            const touches=touchable?[...touchlist]:[event];
            state.perimeter=getPerimeter(touches);
            state.barycenter=getBaryCenter(touches);
            state.stime=Date.now();
            state.pinchevent=getPinchEvent(touches,event);
            onStart&&onStart(state.pinchevent);
            if(touchcount===minPointerCount){
                onMove&&window.addEventListener(moveEvent,onTouchMove);
                window.addEventListener(endEvent,onTouchEnd);
            }
        }
    }
    element.addEventListener(startEvent,onStartGesture);
    function onTouchMove(event){
        const touches=touchable?[...event.touches]:[event];
        state.pinchevent=getPinchEvent(touches,event);
        onMove(state.pinchevent);
    }

    function onTouchEnd(event){
        let triggerOnPinchEnd=true;
        if(touchable){
            const touchlist=event.touches;
            triggerOnPinchEnd=(touchlist.length<minPointerCount);
        }
        triggerOnPinchEnd&&endPinchGesture();
    }

    function endPinchGesture(){
        window.removeEventListener(moveEvent,onTouchMove);
        window.removeEventListener(endEvent,onTouchEnd);
        const {pinchevent}=state;
        delete state.pinchevent;
        pinchevent.removeGesture=()=>{
            element.removeEventListener(startEvent,onStartGesture);
        }
        onEnd&&onEnd(pinchevent);
    }

    const getPinchEvent=(touches,event={})=>{
        const pinchevent=event;
        if(state.hasNoScale){
            pinchevent.scale=touchable?(getPerimeter(touches)/state.perimeter):1;
        }
        const barycenter=pinchevent.barycenter=getBaryCenter(touches),startbarycenter=state.barycenter;
        const dx=pinchevent.dx=barycenter.x-startbarycenter.x;
        const dy=pinchevent.dy=barycenter.y-startbarycenter.y;
        pinchevent.distance=Math.sqrt(dx**2+dy**2);
        pinchevent.dtime=Date.now()-state.stime;
        return pinchevent;
    }
}



const getPerimeter=(touches)=>{
    let perimeter=0;
    const {length}=touches;
    for(let i=1;i<length;i++){
        const pretouch=touches[i-1],touch=touches[i];
        perimeter+=getDistance(pretouch,touch);
    }
    return perimeter;
}

const getDistance=(touch0,touch1)=>{
    const x0=touch0.clientX||touch0.x,y0=touch0.clientY||touch0.y;
    const x1=touch1.clientX||touch1.x,y1=touch1.clientY||touch1.y;
    return Math.sqrt((x0-x1)**2+(y0-y1)**2);
};
