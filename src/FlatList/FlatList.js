import {useId,View,removeItem,HashMap,useSwipeGesture} from "../index";
import css from "./FlatList.module.css";
import EmptyIndicator from "./EmptyIndicator/EmptyIndicator";


export default function FlatList(props){
    const {parent,ref=useId("flatlist"),id=ref,position,style,className,containerClassName,popupClassName,emptymessage,renderItem,onReachEnd,onRemoveItem,onAddItems,horizontal,backwards,pagingEnabled=false,threshold=0.5,transition="250ms",onSwipe}=props;
    const flatlist=View({parent,id,position,style,className:`${css.flatlist} ${className||""}`}),state={
        data:Array.isArray(props.data)&&[...props.data],
        index:null,//last created element index
        itemEl:null,//last created element (observed)
        focus:null,//for paging, element in focus
        itemsmap:new HashMap(),// [item,element] map
        endreached:!props.data?.length,
        firstOffset:null,//for paging lists: firstEl offset
        popuplist:null,
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
                onReachEnd&&onReachEnd({parent:container,data});
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

    if(pagingEnabled&&horizontal){
        container.style.overflow="visible";
        useSwipeGesture({
            element:flatlist,
            onSwipeLeft:()=>{
                const {focus,itemsmap}=state;
                if(focus<(itemsmap.length-1)){
                    const index=focus+1;
                    flatlist.scrollToIndex(index);
                    onSwipe&&onSwipe({direction:"left",index,container});
                }
            },
            onSwipeRight:()=>{
                const {focus}=state;
                if(focus){
                    const index=focus-1;
                    flatlist.scrollToIndex(index);
                    onSwipe&&onSwipe({direction:"left",index,container});
                }
            },
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

    flatlist.scrollToIndex=horizontal&&((i,smooth=true)=>{
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
                const {offsetLeft}=element,offsetX=offsetLeft-state.firstOffset;
                if(!smooth){
                    container.style.transition="none";
                    setTimeout(()=>{container.style.transition=transition},0);
                }
                container.style.transform=`translateX(-${offsetX>0?offsetX:0}px)`;
            }
            else{
                element.scrollIntoView({behavior:smooth?"smooth":"auto",inline:"start"});
            }
        }
    });

    flatlist.container=container;

    function createElement(params,observe=true){
        const {item,index}=params;
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
        state.itemsmap.set(item,element);
        state.itemEl=element;
        observe&&observer&&observer.observe(element);
    }

    return flatlist;
}

const styles={
    container:({transition,horizontal,pagingEnabled,nodata})=>`
        display:${nodata?"none":"block"};
        overflow-x:${horizontal?"auto":"hidden"};
        white-space:${horizontal?"nowrap":"normal"};
        ${pagingEnabled?`
            overflow:visible !important;
            ${horizontal?`
                transition:${transition};
            `:""}
        `:""}
    `,
}
