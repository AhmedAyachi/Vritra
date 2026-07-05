import {isTouchDevice,NativeView,fadeIn,fadeOut,randomId} from "../index";
import css from "./PopupView.module.css";


export default function PopupView(props){
    const {parent=document.documentElement,target,avoidable=true,fadeDuration=200,onRemove}=props;
    const popupview=NativeView({
        parent,at:props.at,
        id:props.id||randomId("p"),
        tag:props.tag,
        style:props.style,
        className:[css.popupview,props.className],
    }),state={
        onTouchScreenListener:null,
        isStaticParent:(parent instanceof Element)&&(getComputedStyle(parent).getPropertyValue("position")==="static"),
    },{isStaticParent}=state;

    popupview.innateHTML=`
    `;

    if(isStaticParent) parent.style.position="relative";
    if(avoidable){
        state.onTouchScreenListener=(event)=>{
            const GestureEvent=isTouchDevice()?TouchEvent:MouseEvent;
            if(event instanceof GestureEvent){
                const {target}=event;
                if(!target.closest(`#${popupview.id}`)){
                    popupview.unmount();
                }
            }
        }
        statics.avoidEvents.forEach(type=>{
            window.addEventListener(type,state.onTouchScreenListener);
        });
    }

    popupview.position=()=>{if(target instanceof Element){
        const position=getPosition(popupview,parent,props);
        Object.assign(popupview.style,position);
    }};
    popupview.remove=(()=>{
        const remove=popupview.remove.bind(popupview);
        return ()=>{
            if(avoidable) statics.avoidEvents.forEach(type=>{
                window.removeEventListener(type,state.onTouchScreenListener);
            });
            if(isStaticParent) parent.style.position=null;
            remove();
            onRemove&&onRemove();
        }
    })();
    popupview.unmount=()=>{
        if(fadeDuration) fadeOut(popupview,fadeDuration,()=>{ popupview.remove() }); 
        else popupview.remove();
    };
    
    if(target) setTimeout(popupview.position,0);
    return fadeDuration?fadeIn(popupview,fadeDuration):popupview;
}

const statics={
    avoidEvents:["touchstart","mousedown"],
}

const getPosition=(popupview,container,props)=>{
    const {target}=props;
    let defaultOffset=props.offset;
    if(defaultOffset&&typeof(defaultOffset)==="object"){
        if(!Number.isFinite(defaultOffset.x)) defaultOffset.x=0;
        if(!Number.isFinite(defaultOffset.y)) defaultOffset.y=0;
    }
    else defaultOffset={x:0,y:0};
    const {left,top}=target.getBoundingClientRect();
    const {
        top:containerTop,
        left:containerLeft,
        width:containerWidth,
        height:containerHeight,
    }=container.getBoundingClientRect();
    const targetTop=top-containerTop,targetLeft=left-containerLeft;
    const {clientWidth:width,clientHeight:height}=popupview,position={
        /* top:null,
        left:null,
        right:null,
        bottom:null, */
    };
    const spacingRight=containerWidth-targetLeft-defaultOffset.x;
    if(width<spacingRight) position.left=targetLeft+defaultOffset.x;
    else{
        const offsetLeft=spacingRight+width;
        if(offsetLeft>=containerWidth){
            position.bottom=offsetLeft-containerWidth;
        }
        else position.right=spacingRight;
    }
    const spacingBottom=containerHeight-targetTop-defaultOffset.y;
    if(height<spacingBottom){
        position.top=targetTop+defaultOffset.y;
    } else {
        const offsetTop=spacingBottom+height;
        position.bottom=offsetTop>=containerHeight?offsetTop-containerHeight:spacingBottom;  
    }
    for(const key in position){
        const value=position[key];
        if(Number.isFinite(value)) position[key]=`${100*value/window.innerWidth}vw`;
        //else delete position[key];
    }
    return position;
}
