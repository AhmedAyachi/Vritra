import {useId,useSwipeGesture} from "../index";
import css from "./FlatList.module.css";


export default function FlatList(props){
    const {parent,ref=useId("flatlist"),id=ref,className,containerClassName,popupClassName,data,renderItem,onReachEnd,horizontal,backwards,pagingEnabled=false,threshold=0.5,transition="250ms",onSwipe}=props;
    parent.insertAdjacentHTML("beforeend",`<div id="${id}" class="${css.flatlist} ${className||""}"></div>`);
    const flatlist=parent.querySelector(`#${id}`),state={
        index:null,
        itemEl:null,
        focus:null,
        itemEls:[],
        endreached:false,
        firstOffset:null,
        popuplist:null,
        observer:null,
    };

    flatlist.innerHTML=`
        ${Array.isArray(data)&&data.length?`
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
                    onReachEnd&&onReachEnd(container);
                }
            }
        },{root:flatlist,threshold});
        observer.observe(state.itemEl);

        if(pagingEnabled&&horizontal){
            const {itemEls,firstOffset}=state;
            container.style.overflow="visible";
            useSwipeGesture({
                element:flatlist,
                onSwipeLeft:()=>{
                    const {focus}=state,lastIndex=itemEls.length-1;
                    if(focus<lastIndex){
                        state.focus=focus+1;
                        const {offsetLeft}=itemEls[state.focus];
                        container.style.transform=`translateX(-${offsetLeft-firstOffset}px)`;
                        onSwipe&&onSwipe({direction:"left",index:state.focus,container});
                    }
                },
                onSwipeRight:()=>{
                    const {focus}=state;
                    if(focus){
                        state.focus=focus-1;
                        const {offsetLeft}=itemEls[state.focus],offsetX=offsetLeft-firstOffset;
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
        }
    }

    flatlist.showItems=(items,render)=>{
        const {popuplist}=state;
        popuplist&&popuplist.remove();
        flatlist.style.overflow=null;
        if(Array.isArray(items)){
            state.popuplist=FlatList({
                ...props,
                parent:flatlist,
                className:`${css.popuplist} ${popupClassName||""}`,
                data:items,
                renderItem:render||renderItem,
                onReachEnd:null,
            });
            flatlist.style.overflow="hidden";
        }
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
        state.itemEls.push(element);
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
