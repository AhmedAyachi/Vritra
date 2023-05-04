import {useId,CherryView,capitalize,isTouchDevice} from "../index";
import css from "./DraggableView.module.css";


export default function DraggableView(props){
    const {parent,ref=useId("draggableview"),id=ref,position,boundary,horizontalDrag=true,verticalDrag=true}=props;
    const draggableview=CherryView({
        parent,id,
        at:props.at,
        style:props.style,
        className:`${css.draggableview} ${props.className||""}`,
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
        isTouchDevice:isTouchDevice(),
    },{coords}=state;
    
    draggableview.innateHTML=`
    `;

    if(verticalDrag||horizontalDrag){
        const {isTouchDevice}=state,{xmin,xmax,ymin,ymax}=boundary||{};
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
    draggableview.setPosition=({x,y,asratio,duration,easing},triggerOnMove=true)=>{
        const {width=1,height=1}=asratio?parent.getBoundingClientRect():{};
        if(typeof(x)==="number"){
            coords.x=x*width;
        }
        if(typeof(y)==="number"){
            coords.y=y*height;
        }
        const hasDuration=typeof(duration)==="number",{style}=draggableview;
        if(hasDuration&&(duration>0)){
            style.transition=`${duration}ms ${easing||"ease-out"}`;
            setTimeout(()=>{style.transition=null},duration);
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

