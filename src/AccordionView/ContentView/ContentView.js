import {View,fadeIn,fadeOut} from "../../index";
import css from "./ContentView.module.css";


export default function ContentView(props){
    const {parent,onShow}=props;
    const contentview=View({parent,className:`${css.contentview} ${props.className||""}`}),state={
        nextElStyle:null,
        nextEl:getNextElement(parent),
    },{nextEl}=state;

    contentview.innateHTML=`
    `;

    clearTimeout(parent.showTimeout);
    parent.showTimeout=nextEl&&setTimeout(()=>{
        state.nextElStyle={};
        const {style}=nextEl;
        ["marginTop","transition"].forEach(key=>{
            state.nextElStyle[key]=style[key];
        });
        Object.assign(style,{
            marginTop:getSpacing(),
            transition:`${statics.transition}ms`,
        });
        delete parent.showTimeout;
    },0);
    
    fadeIn(contentview,statics.transition,()=>{
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

    contentview.unmount=(callback)=>{
        Object.assign(contentview.style,{position:null,transform:null});
        if(nextEl){
            clearTimeout(parent.showTimeout);
            clearTimeout(parent.hideTimeout);
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
            callback&&callback();
        });
    }

    function getSpacing(){
        return `calc(
            ${(100*contentview.clientHeight/window.innerWidth)}vw +
            ${getComputedStyle(parent).getPropertyValue("margin-bottom")||"0px"} +
            ${getComputedStyle(nextEl).getPropertyValue("margin-top")||"0px"}
        )`;
    }

    return contentview;
}

const statics={
    transition:250,
};

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
    return (elem1Rect.top===elem2Rect.top)&&(elem1Rect.bottom===elem2Rect.bottom);
}
