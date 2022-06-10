import {useId,capitalize} from "../index";
import css from "./DraggableView.module.css";


export default function DraggableView(props){
    const {parent,ref=useId("draggableview"),id=ref,className="",horizontalDrag=true,verticalDrag=true,onDrag,onMove,onDrop,style}=props;
    parent.insertAdjacentHTML("beforeend",`<div id="${id}" class="${css.draggableview} ${className}" style="font-size:1em;${style||""}"></div>`);
    const draggableview=parent.querySelector(`#${id}`),state={
        x:null,y:null,
        dragX:null,dragY:null,dragDX:null,dragDY:null,
        dropX:null,dropY:null,dropDX:null,dropDY:null,
        onDrag,onMove,onDrop,
        isTouchDevice:isTouchDevice(),
    }
    
    draggableview.innerHTML="";

    if(verticalDrag||horizontalDrag){
        const {style}=draggableview,{isTouchDevice}=state;
        style.position="absolute";
        draggableview.addEventListener(isTouchDevice?"touchstart":"mousedown",(event)=>{
            const {clientX:x,clientY:y}=(isTouchDevice?event.changedTouches[0]:event),{offsetLeft,offsetTop}=draggableview,{onDrag}=state;
            state.dragX=x;
            state.dragY=y;
            state.dragDX=x-offsetLeft;
            state.dragDY=y-offsetTop;
            onDrag&&onDrag(draggableview,state);
            function onPointerMove(event){
                const {clientX:x,clientY:y}=(isTouchDevice?event.changedTouches[0]:event),{onMove,dragDX,dragDY}=state;
                state.x=x-dragDX;
                state.y=y-dragDY;
                if(horizontalDrag){
                    style.left=`${state.x}px`;
                }
                if(verticalDrag){
                    style.top=`${state.y}px`;
                }
                onMove&&onMove(draggableview,state);
            }
            window.addEventListener(isTouchDevice?"touchmove":"mousemove",onPointerMove);
            window.addEventListener(isTouchDevice?"touchend":"mouseup",(event)=>{
                const {clientX:x,clientY:y}=(isTouchDevice?event.changedTouches[0]:event),{onDrop}=state,{offsetLeft,offsetTop}=draggableview;
                state.dropX=x;
                state.dropY=y;
                state.dropDX=x-offsetLeft;
                state.dropDY=y-offsetTop;
                onDrop&&onDrop(draggableview,state);
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

    return draggableview;    
}

const eventtypes=["drag","move","drop"];
const isTouchDevice=()=>((("ontouchstart" in window)||(navigator.maxTouchPoints>0)||(navigator.msMaxTouchPoints>0)));