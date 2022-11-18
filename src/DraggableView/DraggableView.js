import {useId,View,capitalize} from "../index";
import css from "./DraggableView.module.css";


export default function DraggableView(props){
    const {parent,ref=useId("draggableview"),id=ref,position,horizontalDrag=true,verticalDrag=true}=props;
    const draggableview=View({
        parent,id,
        style:props.style,
        className:`${css.draggableview} ${props.className||""}`,
    }),state={
        coords:{
            x:null,//relative to parent
            y:null,//relative to parent
            dx:null,dy:null,//relative to last position
        },
        dragX:null,dragY:null,//drag position relative to parent
        dragDX:null,dragDY:null,//drag position relative to the draggableview
        onDrag:props.onDrag,
        onMove:props.onMove,
        onDrop:props.onDrop,
        isTouchDevice:isTouchDevice(),
    },{coords}=state;
    
    draggableview.innerHTML="";

    if(verticalDrag||horizontalDrag){
        const {style}=draggableview,{isTouchDevice}=state;
        style.position="absolute";
        draggableview.addEventListener(isTouchDevice?"touchstart":"mousedown",(event)=>{
            const {clientX:cx,clientY:cy}=(isTouchDevice?event.changedTouches[0]:event);
            Object.assign(coords,{dx:0,dy:0});
            state.dragX=cx;
            state.dragY=cy;
            state.dragDX=cx-coords.x;
            state.dragDY=cy-coords.y;
            const {onDrag}=state;
            onDrag&&onDrag(structuredClone(coords),draggableview);
            function onPointerMove(event){
                const {clientX:cx,clientY:cy}=(isTouchDevice?event.changedTouches[0]:event);
                draggableview.setPosition({
                    x:cx-state.dragDX,
                    y:cy-state.dragDY,
                    asratio:false,
                });
            }
            window.addEventListener(isTouchDevice?"touchmove":"mousemove",onPointerMove);
            window.addEventListener(isTouchDevice?"touchend":"mouseup",()=>{
                const {onDrop}=state;
                onDrop&&onDrop(structuredClone(coords),draggableview);
                window.removeEventListener(isTouchDevice?"touchmove":"mousemove",onPointerMove);
            },{once:true});
        });
    }

    draggableview.setEventListener=(type,listener)=>{
        if(type&&eventtypes.includes(type)){
            type=capitalize(type);
            state[`on${type}`]=listener;
        }
    }
    draggableview.getPosition=(asratio)=>{
        const {x,y}=coords;
        let position;
        if(asratio){
            const {width,height}=parent.getBoundingClientRect();
            position={x:x/width,y:y/height};
        }
        else{
            position={x,y};
        }
        return position;
    };
    draggableview.setPosition=({x,y,asratio=true,duration,easing},triggerOnMove=true)=>{
        const {width=1,height=1}=asratio?parent.getBoundingClientRect():{};
        if(typeof(x)==="number"){
            coords.x=x*width;
        }
        if(typeof(y)==="number"){
            coords.y=y*height;
        }
        const hasDuration=typeof(duration)==="number",{style}=draggableview;;
        if(hasDuration){
            style.transition=`${duration}ms ${easing||"ease-out"}`;
        } 
        style.transform=`translate(${horizontalDrag?coords.x:0}px,${verticalDrag?coords.y:0}px)`;
        hasDuration&&setTimeout(()=>{
            style.transition=null;
        },duration);
        Object.assign(coords,{
            dx:coords.x+state.dragDX-state.dragX,
            dy:coords.y+state.dragDY-state.dragY,
        });
        if(triggerOnMove){
            const {onMove}=state;
            onMove&&onMove(structuredClone(coords),draggableview);
        }
    }
    position&&draggableview.setPosition(position,false);

    return draggableview;
}

const eventtypes=["drag","move","drop"];
const isTouchDevice=()=>((("ontouchstart" in window)||(navigator.maxTouchPoints>0)||(navigator.msMaxTouchPoints>0)));
