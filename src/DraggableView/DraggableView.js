import {NativeView,capitalize,isTouchDevice,touchable} from "../index";
import css from "./DraggableView.module.css";


export default function DraggableView(props){
    const {parent,position,boundary,horizontalDrag=true,verticalDrag=true}=props;
    const draggableview=NativeView({
        parent,at:props.at,
        id:props.id,tag:props.tag,
        style:props.style,
        className:[css.draggableview,props.className],
    }),state={
        coords:{
            x:0,y:0,//relative to parent
            dx:0,dy:0,//relative to last position
        },
        dragX:null,dragY:null,//drag position relative to parent
        dragDX:null,dragDY:null,//drag position relative to the draggableview
        onDrag:props.onDrag,
        onMove:props.onMove,
        onDrop:props.onDrop,
        touchable:isTouchDevice(),
        animTimeout:null,
        initialTransition:null,
    },{coords}=state;
    
    draggableview.innateHTML=`
    `;

    if(verticalDrag||horizontalDrag){
        const {touchable}=state,{xmin,xmax,ymin,ymax}=boundary||{};
        let dragging=false;
        draggableview.addEventListener(touchable?"touchstart":"mousedown",(event)=>{
            const {clientX:cx,clientY:cy}=touchable?event.changedTouches[0]:event;
            Object.assign(coords,{dx:0,dy:0});
            state.dragX=cx;
            state.dragY=cy;
            state.dragDX=cx-coords.x;
            state.dragDY=cy-coords.y;
            dragging=true;
            const {onDrag}=state;
            onDrag&&onDrag(structuredClone(coords),draggableview);
            let start=0,frameId;
            function onTouchMove(event){if(dragging){
                frameId=requestAnimationFrame(timestamp=>{
                    start=timestamp;
                    const {clientX:cx,clientY:cy}=touchable?event.changedTouches[0]:event;
                    let x,y;
                    if(horizontalDrag){
                        x=cx-state.dragDX;
                        if((typeof(xmin)==="number")&&(x<xmin)){x=xmin}
                        else if((typeof(xmax)==="number")&&(x>xmax)){x=xmax}
                    }
                    if(verticalDrag){
                        y=cy-state.dragDY;
                        if((typeof(ymin)==="number")&&(y<ymin)){y=ymin}
                        else if((typeof(ymax)==="number")&&(y>ymax)){y=ymax}
                    }
                    draggableview.setPosition({x,y,asratio:false});
                });
            }}
            const moveEvent=touchable?"touchmove":"mousemove";
            window.addEventListener(moveEvent,onTouchMove);
            window.addEventListener(touchable?"touchend":"mouseup",()=>{
                window.removeEventListener(moveEvent,onTouchMove);
                dragging=false;
                cancelAnimationFrame(frameId);//To prevent the requestAnimationFrame callback from setting the view's position after dropping
                const {onDrop}=state;
                onDrop&&onDrop(structuredClone(coords),draggableview);
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
    draggableview.setPosition=({x,y,asratio,duration,easing},triggerOnMove=true)=>{
        clearTimeout(state.animTimeout);
        const {width=1,height=1}=asratio?parent.getBoundingClientRect():{};
        if(typeof(x)==="number"){
            coords.x=x*width;
        }
        if(typeof(y)==="number"){
            coords.y=y*height;
        }
        const {style}=draggableview;
        if((typeof(duration)==="number")&&(duration>0)){
            if(!state.animTimeout){
                state.initialTransition=style.transition;
            }
            style.transition=`${duration}ms ${easing||"ease-out"}`;
            state.animTimeout=setTimeout(()=>{
                delete state.animTimeout;
                style.transition=state.initialTransition;
                delete state.initialTransition;
            },duration);
        }
        style.translate=`${coords.x||0}px ${coords.y||0}px`;
        Object.assign(coords,{
            dx:coords.x+state.dragDX-state.dragX,
            dy:coords.y+state.dragDY-state.dragY,
        });
        if(triggerOnMove){
            const {onMove}=state;
            onMove&&onMove(structuredClone(coords),draggableview);
        }
    }
    position&&draggableview.setPosition({asratio:true,...position},false);

    return draggableview;
}

const eventtypes=["drag","move","drop"];
