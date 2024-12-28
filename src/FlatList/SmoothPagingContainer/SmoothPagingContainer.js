import {DraggableView,findItem} from "../../index";
//import css from "./SmoothPagingContainer.module.css";


export default function SmoothPagingContainer(props){
    const {parent,horizontal,backwards,data}=props,state={
        dragTime:null,
        easing:"ease-out",
    },{easing}=state,{itemsmap}=data;
    const smoothpagingcontainer=DraggableView({
        parent,style:props.style,
        className:props.className,
        verticalDrag:!horizontal,
        horizontalDrag:horizontal,
        onDrag:()=>{
            state.dragTime=performance.now();
        },
        onDrop:({x,y,dx,dy})=>{
            const dtime=performance.now()-state.dragTime;
            const distance=Math.abs(horizontal?dx:dy);
            const forward=backwards?(horizontal?(dx>0):(dy>0)):(horizontal?(dx<0):(dy<0));
            const velocity=100*distance/dtime;
            if((dtime<100)&&(velocity>40)){
                parent.scrollToIndex(data.infocusIndex+(forward?1:-1),{
                    easing,
                    duration:Math.min(200,2.5*velocity),
                });
            }
            else{
                const {snapOffsetThreshold}=props;
                if(distance>=snapOffsetThreshold){
                    const scrollLength=(horizontal?x:y)*(backwards?1:-1);
                    if(scrollLength<0){
                        parent.scrollToOffset(0);
                    }
                    else{
                        const clientLength="client"+(horizontal?"Width":"Height");
                        const item=findItem(itemsmap.values(),(element)=>{
                            const offset=element[data.offsetSide];
                            return forward?(scrollLength>(offset-parent[clientLength])):
                            (offset+element[clientLength]>=(scrollLength));
                        },forward);
                        parent.scrollToIndex(item?.index||0,{
                            easing,
                            duration:Math.max(2*velocity,250),
                        });
                    }
                }
                else{
                    parent.scrollToIndex(data.infocusIndex);
                }
            }
        },
    });

    smoothpagingcontainer.innateHTML=`
    `;

    return smoothpagingcontainer;
}
