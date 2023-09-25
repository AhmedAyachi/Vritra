

export {default as usePressGesture} from "./usePressGesture/usePressGesture";
export {default as useZoomGesture} from "./useZoomGesture/useZoomGesture";
export {default as usePinchGesture} from "./usePinchGesture/usePinchGesture";
export {default as useSwipeGesture} from "./useSwipeGesture/useSwipeGesture";

export const getBaryCenter=(touches)=>{
    const touchcount=touches.length;
    let totalx=0,totaly=0;
    if(touchcount===1){
        const touch=touches[0];
        totalx=touch.clientX;
        totaly=touch.clientY;
    }
    else{
        for(let i=0;i<touchcount;i++){
            totalx+=touches[i].clientX;
            totaly+=touches[i].clientY;
        }
    }
    return {x:totalx/touchcount,y:totaly/touchcount}
}
