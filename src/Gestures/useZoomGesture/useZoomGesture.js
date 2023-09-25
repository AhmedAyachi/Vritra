import usePinchGesture from "../usePinchGesture/usePinchGesture";


export default function useZoomGesture(options){
    const {element,minScale=1,maxScale=10,onZoomStart,onZoom,onZoomEnd}=options;
    element.style.transformOrigin="50% 50%"; 
    let origin;

    usePinchGesture({
        element,
        maxPointerCount:2,
        onStart:((event)=>{
            origin=getOrigin(element);
            onZoomStart&&onZoomStart(Object.assign(event,{translateX:0,translateY:0}));
        }),
        onMove:(event)=>{
            const {scale}=event;
            if((minScale<=scale)&&(scale<=maxScale)){
                const {barycenter}=event,dscale=scale-1;
                const translateX=event.dx+(origin.x-barycenter.x)*dscale/scale;
                const translateY=event.dy+(origin.y-barycenter.y)*dscale/scale;
                element.style.transform=`scale(${scale}) translate(${translateX}px,${translateY}px)`;
                onZoom&&onZoom(Object.assign(event,{translateX,translateY}));
            }
        },
        onEnd:()=>{
            const transition=element.style.transition,{style}=element;
            style.transition=`${statics.transition}ms`;
            style.transform="scale(1) translate(0,0)";
            setTimeout(()=>{
                style.transition=transition;
            },statics.transition);
            onZoomEnd&&onZoomEnd();
        },
    });
    screen.orientation.addEventListener("change",()=>{
        setTimeout(()=>{origin=getOrigin(element)},statics.transition);
    });
}

const statics={
    transition:200,
}

const getOrigin=(element)=>{
    const {width,height,left,top}=element.getBoundingClientRect();
    return {
        x:(window.innerWidth/2+(left+width/2))/2,
        y:(window.innerHeight/2+(top+height/2))/2,
    };
}