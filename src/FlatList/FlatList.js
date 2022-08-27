import {useId,View,removeItem,HashMap,useSwipeGesture} from "../index";
import css from "./FlatList.module.css";


export default function FlatList(props){
    const {parent,ref=useId("flatlist"),id=ref,position,style,className,containerClassName,popupClassName,renderItem,onReachEnd,onRemoveItem,onAddItems,horizontal,backwards,pagingEnabled=false,threshold=0.5,transition="250ms",onSwipe}=props;
    const flatlist=View({parent,id,position,style,className:`${css.flatlist} ${className||""}`}),state={
        data:Array.isArray(props.data)&&[...props.data],
        index:null,
        itemEl:null,
        focus:null,
        items:new HashMap(),
        endreached:false,
        firstOffset:null,
        popuplist:null,
        observer:null,
    },{data}=state;

    flatlist.innerHTML=`
        ${data&&data.length?`
            <div class="${css.container} ${containerClassName||""}" style="${styles.container({pagingEnabled,transition,horizontal})}"></div>
        `:`
            <p class="${css.emptymsg}">no data</p>
        `}
    `;

    const container=flatlist.querySelector(`.${css.container}`);
    if(container&&renderItem){
        state.index=state.focus=0;
        createElement({item:data[0],index:0});
        state.firstOffset=horizontal?state.itemEl.offsetLeft:state.itemEl.offsetTop;
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
        observer.observe(state.itemEl);

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
    }

    flatlist.addItems=(items)=>{
        if(Array.isArray(items)&&items.length){
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
            items.delete(item);
            state.index--;
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
    container:({transition,horizontal,pagingEnabled})=>`
        overflow-x:${horizontal?"auto":"hidden"};
        white-space:${horizontal?"nowrap":"normal"};
        transition:${transition||"250ms"};
        ${pagingEnabled?`
            overflow:visible !important;
        `:""}
    `,
}
