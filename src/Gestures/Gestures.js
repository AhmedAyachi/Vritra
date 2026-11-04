

export {default as useZoomGesture} from "./useZoomGesture/useZoomGesture.js";
export {default as usePressGesture} from "./usePressGesture/usePressGesture.js";
export {default as usePinchGesture} from "./usePinchGesture/usePinchGesture.js";
export {default as useSwipeGesture} from "./useSwipeGesture/useSwipeGesture.js";

export const getBaryCenter=(touches)=>{
    const touchcount=touches.length;
    let totalX=0,totalY=0;
    if(touchcount===1){
        const touch=touches[0];
        totalX=touch.clientX;
        totalY=touch.clientY;
    } else {
        for(let i=0;i<touchcount;i++){
            totalX+=touches[i].clientX;
            totalY+=touches[i].clientY;
        }
    }
    return {
        x:totalX/touchcount,
        y:totalY/touchcount,
    };
}
