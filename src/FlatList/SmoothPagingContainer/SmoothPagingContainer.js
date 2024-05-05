import {DraggableView,findItem} from "../../index";
//import css from "./SmoothPagingContainer.module.css";


export default function SmoothPagingContainer(props){
    const {parent,horizontal,data}=props,state={
        dragTime:null,
    },{itemsmap}=data;
    const smoothpagingcontainer=parent.container=DraggableView({
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
            const forward=horizontal?(dx<0):(dy<0);
            const velocity=100*distance/dtime;
            if((dtime<100)&&(velocity>40)){
                parent.scrollToIndex(data.infocusIndex+(forward?1:-1),{duration:2.5*velocity});
            }
            else{
                const {offsetThreshold=50}=props;
                if(distance>=offsetThreshold){
                    const scrollLength=horizontal?-x:-y;
                    if(scrollLength<0){
                        parent.scrollToOffset(0);
                    }
                    else{
                        const clientLength="client"+(horizontal?"Width":"Height");
                        const item=findItem(itemsmap.values(),(element)=>{
                            const offset=element[data.offsetSide];
                            return forward?(scrollLength>(offset-parent[clientLength])):
                            (offset+element[clientLength]>=(scrollLength));
                        },forward)||{index:0};
                        parent.scrollToIndex(item.index,{duration:Math.max(2.5*velocity,200)});
                    }
                }
                else{
                    parent.scrollToIndex(data.infocusIndex);
                }
            }
        },
    });

    smoothpagingcontainer.beforeEndHTML=`
    `;

    return smoothpagingcontainer;
}
