import {getBaryCenter} from "../index";


export default function usePinchGesture(options){
    const {element,onStart,onMove,onEnd}=options;
    const state={
        barycenter:null,
        stime:null,
        perimeter:null,
        hasNoScale:true,//Check if the TouchEvent has no read-only scale property 
        minPointerCount:Math.max(2,options.minPointerCount||0),
        maxPointerCount:Math.max(2,options.maxPointerCount||Infinity),
    },{minPointerCount,maxPointerCount}=state;
    element.addEventListener("touchstart",(event)=>{
        state.hasNoScale=event.scale===undefined;
        const touchlist=event.touches,touchcount=touchlist.length;
        if(touchcount>maxPointerCount){
            endPinchGesture();
        }
        else if(touchcount>=minPointerCount){
            const touches=[...touchlist];
            state.perimeter=getPerimeter(touches);
            state.barycenter=getBaryCenter(touches);
            state.stime=Date.now();
            state.pinchevent=getPinchEvent(touches,event);
            onStart&&onStart(state.pinchevent);
            if(touchcount===minPointerCount){
                onMove&&element.addEventListener("touchmove",onTouchMove);
                element.addEventListener("touchend",onTouchEnd);
            }
        }
    });
    function onTouchMove(event){
        const touches=[...event.touches];
        state.pinchevent=getPinchEvent(touches,event);
        onMove(state.pinchevent);
    }

    function onTouchEnd(event){
        const touchlist=event.touches;
        (touchlist.length<minPointerCount)&&endPinchGesture();
    }

    function endPinchGesture(){
        element.removeEventListener("touchmove",onTouchMove);
        element.removeEventListener("touchend",onTouchEnd);
        const {pinchevent}=state;
        delete state.pinchevent;
        onEnd&&onEnd(pinchevent);
    }

    const getPinchEvent=(touches,event={})=>{
        const pinchevent=event;
        if(state.hasNoScale){
            pinchevent.scale=getPerimeter(touches)/state.perimeter;
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
