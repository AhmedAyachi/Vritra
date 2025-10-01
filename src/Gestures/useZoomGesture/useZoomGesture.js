import usePinchGesture from "../usePinchGesture/usePinchGesture";


export default function useZoomGesture(options){
    const {element,minScale=1,maxScale=10,onZoomStart,onZoom,onZoomEnd}=options;
    let origin,initialStyle;

    usePinchGesture({
        element,
        minPointerCount:2,
        maxPointerCount:2,
        onStart:((event)=>{
            const {style}=element;
            initialStyle=Object.assign({},{
                transition:style.transition,
                transformOrigin:style.transformOrigin,
                transitionDuration:style.transitionDuration,
            });
            origin=getOrigin(element);
            Object.assign(style,{
                transition:null,
                transformOrigin:"50% 50%",
                transitionDuration:null,
            });
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
            const {style}=element;
            style.transition=`${statics.transitionDuration}ms`;
            style.transform="scale(1) translate(0,0)";
            setTimeout(()=>{
                Object.assign(style,initialStyle);
            },statics.transitionDuration);
            onZoomEnd&&onZoomEnd();
        },
    });
    screen.orientation.addEventListener("change",()=>{
        setTimeout(()=>{
            origin=getOrigin(element);
        },statics.transitionDuration);
    });
}

const statics={
    transitionDuration:200,
}

const getOrigin=(element)=>{
    const {width,height,left,top}=element.getBoundingClientRect();
    return {
        x:(window.innerWidth/2+(left+width/2))/2,
        y:(window.innerHeight/2+(top+height/2))/2,
    };
}