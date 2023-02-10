import {getBaryCenter} from "./index";


export default function useSwipeGesture(options){
    const state={
        ...options,
        barycenter:null,
        offset:options?.offset||50,
        length:options?.length||40,
        pointerCount:Math.max(1,options?.pointerCount||0),
    },{element,length,offset,pointerCount,onReady,onSwipe}=state;
    element.addEventListener("touchstart",(event)=>{
        const {touches}=event,touchcount=touches.length;
        if(touchcount===pointerCount){
            state.barycenter=getBaryCenter(touches);
            if(onSwipe){
                element.addEventListener("touchcancel",onTouchEnd);
                element.addEventListener("touchend",onTouchEnd);
            }
            onReady&&onReady(event);
        }
        else if((touchcount>pointerCount)&&onSwipe){
            element.removeEventListener("touchcancel",onTouchEnd);
            element.removeEventListener("touchend",onTouchEnd);
        }
    });

    const onTouchEnd=(event)=>{
        const {changedTouches,touches}=event,touchcount=changedTouches.length+touches.length;
        if(touchcount===pointerCount){
            const {x,y}=getBaryCenter([...touches,...changedTouches]),{barycenter}=state;
            const dx=x-barycenter.x,dy=y-barycenter.y;
            const swipewidth=Math.abs(dx),swipeheight=Math.abs(dy);
            let axis,direction;
            if((swipeheight<offset)&&(swipewidth>=length)){
                axis="horizontal";
                direction=(dx>length)?"right":((dx<-length)&&"left");
            }
            else if((swipewidth<offset)&&(swipeheight>=length)){
                axis="vertical";
                direction=(dy>length)?"bottom":((dy<-length)&&"top");
            };
            delete state.barycenter;
            element.removeEventListener("touchcancel",onTouchEnd);
            element.removeEventListener("touchend",onTouchEnd);
            axis&&direction&&onSwipe(Object.assign(event,{axis,direction,dx,dy}));
        };
    }
}
