import {randomId,NativeView,fadeIn,fadeOut} from "../index";
import css from "./PopupView.module.css";


export default function PopupView(props){
    const {parent=document.documentElement,id=randomId("popupview"),target,avoidable=true,onRemove,onUnmount}=props;
    const popupview=NativeView({
        parent,id,
        at:props.at,
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
        if(!target.closest(`#${id}`)){
            popupview.unmount();
        }
    }
    avoidable&&statics.avoidEvents.forEach(type=>{
        window.addEventListener(type,onTouchScreen);
    });

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
            onRemove?onRemove():onUnmount&&onUnmount();
        }
    })();
    popupview.unmount=()=>{
        fadeOut(popupview,()=>{popupview.remove()});
    };
    
    target&&setTimeout(()=>{
        Object.assign(popupview.style,getPosition(popupview,target,parent,props.offset||props.position));
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
    else{
        defaultOffset={x:0,y:0};
    }
    const {left,top}=target.getBoundingClientRect();
    const {left:containerLeft,top:containerTop}=container.getBoundingClientRect();
    const targetLeft=left-containerLeft;
    const targetTop=top-containerTop;
    const {clientWidth:width,clientHeight:height}=popupview,position={};
    const spacingRight=container.clientWidth-targetLeft-defaultOffset.x;
    if(width<spacingRight){
        position.left=targetLeft+defaultOffset.x;
    }
    else{
        const right=spacingRight,offsetLeft=right+width;
        if(offsetLeft>=container.clientWidth){
            position.bottom=offsetLeft-container.clientWidth;
        }
        else{
            position.right=right;
        }
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
        position[key]=`${100*position[key]/window.innerWidth}vw`;
    }
    return position;
}
