import {useId,CherryView,removeItem,CherryMap,useSwipeGesture} from "../index";
import css from "./FlatList.module.css";
import EmptyIndicator from "./EmptyIndicator/EmptyIndicator";


export default function FlatList(props){
    const {parent,id=useId("flatlist"),emptymessage,renderItem,horizontal,backwards,pagingEnabled,swipeEnabled=true,threshold=0.5,transition="250ms",onReachEnd,onRemoveItem,onAddItems,onSwipe}=props;
    const flatlist=CherryView({
        parent,id,
        at:props.at,
        style:props.style,
        className:`${css.flatlist} ${props.className||""}`,
    }),state={
        data:Array.isArray(props.data)&&[...props.data],
        index:null,//last created element index
        itemEl:null,//last created element (observed)
        focus:null,//for paging, element in focus
        itemsmap:new CherryMap(),// [item,element] map
        endreached:!props.data?.length,
        firstOffset:null,//for paging lists: firstEl offset
        popuplist:null,
        isolatedcount:0,//elements with removed items count
    },{data}=state;

    flatlist.innateHTML=`
        <div 
            class="${css.container} ${props.containerClassName||""}" 
            style="${styles.container({nodata:state.endreached,pagingEnabled,transition,horizontal})}"
        ></div>
    `;
    let emptyindicator=(!(data&&data.length))&&EmptyIndicator({parent:flatlist,message:emptymessage});

    const container=flatlist.querySelector(`.${css.container}`);
    const observer=new IntersectionObserver(([entry])=>{
        const {isIntersecting}=entry;
        if(isIntersecting){
            state.index++;
            observer.unobserve(state.itemEl);
            const {index}=state;
            if(index<data.length){
                const item=data[index];
                createElement({item,index});
            }
            else{
                state.endreached=true;
                onReachEnd&&onReachEnd({container,data:props.data});
            }
        }
    },{root:flatlist,threshold});
    
    if(data&&data.length&&renderItem){
        state.index=state.focus=0;
        createElement({item:data[0],index:0});
        const {itemEl}=state;
        state.firstOffset=horizontal?itemEl.offsetLeft:itemEl.offsetTop;
        observer.observe(itemEl);
    }

    if(pagingEnabled){
        container.style.overflow="visible";
        flatlist.style.overflow="hidden";
        swipeEnabled&&useSwipeGesture({
            element:flatlist,
            onSwipe:(event)=>{if((horizontal&&(event.axis==="horizontal"))||((!horizontal)&&(event.axis==="vertical"))){
                const {focus}=state;
                let index;
                switch(event.direction){
                    case "top":
                    case "left":
                        const {itemsmap}=state;
                        if(focus<(itemsmap.length-1)){index=focus+1}
                        break;
                    case "bottom":
                    case "right":
                        if(focus){index=focus-1}
                        break;
                    default:break;
                }
                if(index!==undefined){
                    flatlist.scrollToIndex(index);
                    Object.assign(event,{index,container});
                    onSwipe&&onSwipe(event);
                }
            }},
        });
    }

    flatlist.addItems=(items)=>{
        if(Array.isArray(items)&&items.length){
            if(!data.length){
                container.style.display="block";
                emptyindicator.remove();
                emptyindicator=null;
            }
            data.push(...items);
            if(state.endreached){
                createElement({item:items[0],index:state.index});
                state.endreached=false;
            }
            onAddItems&&onAddItems(items);
        }
    }

    flatlist.removeItem=(predicate,withElement=true)=>{
        const {length}=data,item=removeItem(data,predicate),removed={item,element:null}; 
        if(data.length<length){
            const {itemsmap}=state;
            removed.element=itemsmap.get(item);
            if(withElement){
                const {element}=removed;
                (element instanceof Element)&&element.remove();
            }
            else{
                state.isolatedcount++;
            }
            itemsmap.delete(item);
            state.index--;
            if((!data.length)&&(!state.isolatedcount)){
                container.style.display="none";
                emptyindicator=EmptyIndicator({parent:flatlist,message:emptymessage});
            }
            onRemoveItem&&onRemoveItem(removed);
        }
        return removed;
    }

    flatlist.showItems=(predicate,popupProps)=>{
        const {popuplist}=state;
        popuplist&&popuplist.remove();
        flatlist.style.overflow=null;
        const items=(typeof(predicate)==="function")?data.filter(predicate):predicate;
        if(Array.isArray(items)){
            state.popuplist=FlatList({
                ...props,
                onReachEnd:null,
                onRemoveItem:null,
                ...popupProps,
                parent:flatlist,
                className:`${css.popuplist} ${props.popupClassName||""}`,
                data:items,
            });
            flatlist.style.overflow="hidden";
        }
        else{
            state.popuplist=null;
        }
        return state.popuplist;
    }

    flatlist.scrollToIndex=(i,smooth=true)=>{
        const {index}=state,lastIndex=data.length-1;
        if(i>lastIndex){i=lastIndex} else if(i<0){i=0}
        if(state.focus!==i){
            state.focus=i;
            let element;
            if(i>index){
                observer.unobserve(state.itemEl);
                for(let j=index+1;j<=i;j++){
                    state.index=j;
                    createElement({item:data[j],index:j},i===j);
                }
                element=state.itemEl;
            }
            else{
                element=state.itemsmap.at(i,true);
            }
            if(pagingEnabled){
                const offset=element["offset"+(horizontal?"Left":"Top")]-state.firstOffset;
                if(!smooth){
                    container.style.transition="none";
                    setTimeout(()=>{container.style.transition=transition},0);
                }
                container.style.transform=`translate${horizontal?"X":"Y"}(-${offset>0?offset:0}px)`;
            }
            else{
                element.scrollIntoView({
                    behavior:smooth?"smooth":"auto",
                    block:"start",inline:"start",
                });
            }
        }
    };

    flatlist.container=container;

    function createElement(params,observe=true){
        const {item,index}=params;
        let element;
        if(backwards){
            const {scrollTop,scrollHeight,scrollLeft,scrollWidth}=container;
            element=container.insertAdjacentElement("afterbegin",renderItem({
                parent:container,
                item,index,
                data:props.data,
            }));
            Object.assign(container,{
                scrollTop:container.scrollHeight-(scrollHeight-scrollTop),
                scrollLeft:container.scrollWidth-(scrollWidth-scrollLeft),
            });
        }
        else{
            element=renderItem({
                parent:container,
                item,index,
                data:props.data,
            });
        }
        state.itemsmap.set(item,element);
        state.itemEl=element;
        observe&&observer&&observer.observe(element);
    }

    return flatlist;
}

const styles={
    container:({transition,horizontal,pagingEnabled,nodata})=>`
        height:${horizontal?"fit-content":"auto"};
        display:${nodata?"none":"block"};
        white-space:${horizontal?"nowrap":"normal"};
        ${pagingEnabled?`
            overflow:visible;
            transition:${transition};
        `:`
            overflow-x:${horizontal?"auto":"hidden"};
        `}
    `,
}
