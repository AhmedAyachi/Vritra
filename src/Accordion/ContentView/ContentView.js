import {View,fadeIn,fadeOut} from "../../index";
import css from "./ContentView.module.css";


export default function ContentView(props){
    const {parent,animated,onShow,onHide}=props;
    const contentview=View({parent,className:[css.contentview,props.className]}),state={
        nextElStyle:null,
        nextEl:getNextElement(parent),
    },{nextEl}=state;

    contentview.innateHTML=`
    `;
    
    new Promise(resolve=>{
        clearTimeout(parent.showTimeout);
        if(nextEl){
            state.nextElStyle=getElementStyle(nextEl);
            if(animated) parent.showTimeout=setTimeout(()=>{
                Object.assign(nextEl.style,{
                    marginTop:getSpacing(),
                    transition:`${statics.transition}ms`,
                });
                delete parent.showTimeout;
            },0);
        }
        if(animated) fadeIn(contentview,statics.transition,resolve);
        else resolve();
    }).then(()=>{
        Object.assign(contentview.style,{
            position:"relative",
            transform:"none",
            transition:"none",
        });
        if(nextEl){
            const {nextElStyle}=state;
            nextEl.style.marginTop=nextElStyle.marginTop;
            nextEl.style.transition="none";//overwrite nextEl already-set transition
            parent.showTimeout=setTimeout(()=>{
                nextEl.style.transition=nextElStyle.transition;
            },40);
        }
        onShow&&onShow();
    });

    contentview.unmount=()=>{
        Object.assign(contentview.style,{position:null,transform:null});
        const nextEl=state.nextEl=getNextElement(parent);
        if(nextEl){
            clearTimeout(parent.showTimeout);
            clearTimeout(parent.hideTimeout);
            state.nextElStyle=getElementStyle(nextEl);
            const {style}=nextEl;
            style.transition="none";
            style.marginTop=getSpacing();
            parent.hideTimeout=setTimeout(()=>{
                const {nextElStyle}=state;
                style.transition=`${statics.transition}ms`;
                style.marginTop=nextElStyle.marginTop;
                parent.hideTimeout=setTimeout(()=>{
                    style.transition=nextElStyle.transition;
                    delete parent.hideTimeout;
                },statics.transition);
            },0);
            delete parent.showTimeout;
        }
        fadeOut(contentview,statics.transition,()=>{
            contentview.remove();
            onHide&&onHide();
        });
    }

    function getSpacing(){
        return `calc(
            ${(100*contentview.clientHeight/window.innerWidth)}vw +
            ${getComputedStyle(parent).getPropertyValue("margin-bottom")||"0px"} +
            ${getComputedStyle(state.nextEl).getPropertyValue("margin-top")||"0px"}
        )`;
    }

    return contentview;
}

const statics={
    transition:250,
};

const getElementStyle=(element)=>{
    if(element){
        const {style}=element;
        return {
            marginTop:style.marginTop,
            transition:style.transition,
        };
    } else return null;
}

const getNextElement=(parent)=>{
    let element=parent;
    while((element!==document.body)&&(!(element.nextSibling instanceof HTMLElement)||areHorizontallyAligned(element,element.nextSibling))){
        element=element.parentNode;
    }
    return element.nextSibling;
}

const areHorizontallyAligned=(elem1,elem2)=>{
    const elem1Rect=elem1.getBoundingClientRect();
    const elem2Rect=elem2.getBoundingClientRect();
    return !(
        elem2Rect.bottom>=elem1Rect.bottom &&
        elem2Rect.left>=elem1Rect.left &&
        elem2Rect.right<=elem1Rect.right
    )
}
