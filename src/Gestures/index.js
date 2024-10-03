

export {default as usePressGesture} from "./usePressGesture/usePressGesture";
export {default as useZoomGesture} from "./useZoomGesture/useZoomGesture";
export {default as usePinchGesture} from "./usePinchGesture/usePinchGesture";
export {default as useSwipeGesture} from "./useSwipeGesture/useSwipeGesture";

export const getBaryCenter=(touches)=>{
    const touchcount=touches.length;
    let totalX=0,totalY=0;
    if(touchcount===1){
        const touch=touches[0];
        totalX=touch.clientX;
        totalY=touch.clientY;
    }
    else{
        for(let i=0;i<touchcount;i++){
            totalX+=touches[i].clientX;
            totalY+=touches[i].clientY;
        }
    }
    return {x:totalX/touchcount,y:totalY/touchcount};
}
