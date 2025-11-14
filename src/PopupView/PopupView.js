import {NativeView,fadeIn,fadeOut, randomId} from "../index";
import css from "./PopupView.module.css";


export default function PopupView(props){
    const {parent=document.documentElement,target,avoidable=true,onRemove}=props;
    const popupview=NativeView({
        parent,at:props.at,
        id:props.id||randomId("p"),
        tag:props.tag,
        style:props.style,
        className:[css.popupview,props.className],
    }),state={
        isStaticParent:getComputedStyle(parent).getPropertyValue("position")==="static",
    },{isStaticParent}=state;

    popupview.innateHTML=`
    `;

    if(isStaticParent) parent.style.position="relative";
    function onTouchScreen(event){
        const {target}=event;
        if(!target.closest(`#${popupview.id}`)){
            popupview.unmount();
        }
    }
    avoidable&&statics.avoidEvents.forEach(type=>{
        window.addEventListener(type,onTouchScreen);
    });

    popupview.position=()=>{
        const position=getPosition(popupview,target,parent,props.offset);
        Object.assign(popupview.style,position);
    }
    popupview.cleanupEventListeners=()=>{
        avoidable&&statics.avoidEvents.forEach(type=>{
            window.removeEventListener(type,onTouchScreen);
        });
    }
    popupview.remove=(()=>{
        const remove=popupview.remove.bind(popupview);
        return ()=>{
            popupview.cleanupEventListeners();
            if(isStaticParent) parent.style.position=null;
            remove();
            onRemove&&onRemove();
        }
    })();
    popupview.unmount=()=>{
        fadeOut(popupview,()=>{
            popupview.remove();
        });
    };
    
    target&&setTimeout(()=>{
        popupview.position();
    },0);
    return fadeIn(popupview,200);
}

const statics={
    avoidEvents:["touchstart","mousedown"],
}

const getPosition=(popupview,target,container,defaultOffset)=>{
    if(defaultOffset&&typeof(defaultOffset)==="object"){
        if(typeof(defaultOffset.x)!=="number") defaultOffset.x=0;
        if(typeof(defaultOffset.y)!=="number") defaultOffset.y=0;
    }
    else defaultOffset={x:0,y:0};
    const {left,top}=target.getBoundingClientRect();
    const {left:containerLeft,top:containerTop}=container.getBoundingClientRect();
    const targetTop=top-containerTop,targetLeft=left-containerLeft;

    const {clientWidth:width,clientHeight:height}=popupview,position={
        top:null,
        left:null,
        right:null,
        bottom:null,
    };
    const spacingRight=container.clientWidth-targetLeft-defaultOffset.x;
    if(width<spacingRight) position.left=targetLeft+defaultOffset.x;
    else{
        const offsetLeft=spacingRight+width;
        if(offsetLeft>=container.clientWidth){
            position.bottom=offsetLeft-container.clientWidth;
        }
        else position.right=spacingRight;
    }
    const spacingBottom=container.clientHeight-targetTop-defaultOffset.y;
    if(height<spacingBottom){
        position.top=targetTop+defaultOffset.y;
    }
    else{
        const bottom=spacingBottom,offsetTop=bottom+height;
        if(offsetTop>=container.clientHeight){
            position.bottom=offsetTop-container.clientHeight;
        }
        else{
            position.bottom=bottom;
        }        
    }
    for(const key in position){
        const value=position[key];
        if(typeof(value)==="number") position[key]=`${100*value/window.innerWidth}vw`;
    }
    return position;
}
