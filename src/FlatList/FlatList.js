import {useId,View,removeItem,HashMap,useSwipeGesture} from "../index";
import css from "./FlatList.module.css";
import EmptyIndicator from "./EmptyIndicator/EmptyIndicator";


export default function FlatList(props){
    const {parent,ref=useId("flatlist"),id=ref,position,style,className,containerClassName,popupClassName,emptymessage,renderItem,onReachEnd,onRemoveItem,onAddItems,horizontal,backwards,pagingEnabled=false,threshold=0.5,transition="250ms",onSwipe}=props;
    const flatlist=View({parent,id,position,style,className:`${css.flatlist} ${className||""}`}),state={
        data:Array.isArray(props.data)&&[...props.data],
        index:null,//last created element index
        itemEl:null,//last cerated element
        focus:null,//for paging, element in focus
        items:new HashMap(),// [item,element] map
        endreached:!props.data?.length,
        firstOffset:null,//for paging lists: firstEl offset
        popuplist:null,
        observer:null,
        isolatedcount:0,//elements with removed items count
    },{data}=state;

    flatlist.innateHTML=`
        <div 
            class="${css.container} ${containerClassName||""}" 
            style="${styles.container({nodata:state.endreached,pagingEnabled,transition,horizontal})}"
        ></div>
    `;
    let emptyindicator=(!(data&&data.length))&&EmptyIndicator({parent:flatlist,message:emptymessage});

    const container=flatlist.querySelector(`.${css.container}`);
    const observer=state.observer=new IntersectionObserver(([entry])=>{
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
                onReachEnd&&onReachEnd({parent:container,data});
            }
        }
    },{root:flatlist,threshold});
    if(pagingEnabled&&horizontal){
        const {items,firstOffset}=state;
        container.style.overflow="visible";
        useSwipeGesture({
            element:flatlist,
            onSwipeLeft:()=>{
                const {focus}=state,lastIndex=items.length-1;
                if(focus<lastIndex){
                    state.focus=focus+1;
                    const {offsetLeft}=items.at(state.focus,true);
                    container.style.transform=`translateX(-${offsetLeft-firstOffset}px)`;
                    onSwipe&&onSwipe({direction:"left",index:state.focus,container});
                }
            },
            onSwipeRight:()=>{
                const {focus}=state;
                if(focus){
                    state.focus=focus-1;
                    const {offsetLeft}=items.at(state.focus,true),offsetX=offsetLeft-firstOffset;
                    container.style.transform=`translateX(-${offsetX>0?offsetX:0}px)`;
                    onSwipe&&onSwipe({direction:"right",index:state.focus,container});
                }
            },
        });
    }
    if(data&&data.length&&renderItem){
        state.index=state.focus=0;
        createElement({item:data[0],index:0});
        state.firstOffset=horizontal?state.itemEl.offsetLeft:state.itemEl.offsetTop;
        observer.observe(state.itemEl);
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
            const {items}=state;
            removed.element=items.get(item);
            if(withElement){
                const {element}=removed;
                (element instanceof Element)&&element.remove();
            }
            else{
                state.isolatedcount++;
            }
            items.delete(item);
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
                className:`${css.popuplist} ${popupClassName||""}`,
                data:items,
            });
            flatlist.style.overflow="hidden";
        }
        else{
            state.popuplist=null;
        }
        return state.popuplist;
    }

    flatlist.container=container;

    function createElement(params){
        const {item,index}=params,{observer}=state;
        let element;
        if(backwards){
            const {scrollTop,scrollHeight,scrollLeft,scrollWidth}=container;
            element=container.insertAdjacentElement("afterbegin",renderItem({parent:container,item,index,data}));
            Object.assign(container,{
                scrollTop:container.scrollHeight-(scrollHeight-scrollTop),
                scrollLeft:container.scrollWidth-(scrollWidth-scrollLeft),
            });
        }
        else{
            element=renderItem({parent:container,item,index,data});
        }
        state.items.set(item,element);
        state.itemEl=element;
        observer&&observer.observe(element);
    }

    return flatlist;
}

const styles={
    container:({transition,horizontal,pagingEnabled,nodata})=>`
        display:${nodata?"none":"block"};
        overflow-x:${horizontal?"auto":"hidden"};
        white-space:${horizontal?"nowrap":"normal"};
        transition:${transition||"250ms"};
        ${pagingEnabled?`
            overflow:visible !important;
        `:""}
    `,
}
