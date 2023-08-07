import {useId,View,fadeIn,fadeOut} from "../../index";
import css from "./ContentView.module.css";


export default function ContentView(props){
    const {parent,id=useId("contentview")}=props;
    const contentview=View({parent,id,className:`${css.contentview} ${props.className||""}`}),state={
        siblingStyle:null,
        marginTop:null,
        nextEl:getNextElement(parent),
    },{nextEl}=state;

    contentview.innateHTML=`
    `;

    nextEl&&setTimeout(()=>{
        state.siblingStyle={};
        const {style}=nextEl;
        ["marginTop","transition"].forEach(key=>{
            state.siblingStyle[key]=style[key];
        });
        state.marginTop=`calc(
            ${(100*contentview.clientHeight/window.innerWidth)}vw +
            ${getComputedStyle(parent).getPropertyValue("margin-bottom")||"0px"} +
            ${getComputedStyle(nextEl).getPropertyValue("margin-top")||"0px"}
        )`;
        Object.assign(style,{
            marginTop:state.marginTop,
            transition:`${statics.transition}ms`,
        });
    },0);
    
    fadeIn(contentview,statics.transition,()=>{
        Object.assign(contentview.style,{
            position:"relative",
            transform:"none",
            transition:"none",
        });
        if(nextEl){
            const {siblingStyle}=state;
            nextEl.style.marginTop=siblingStyle.marginTop;
            nextEl.style.transition="none";//overwrite nextEl already-set transition
            setTimeout(()=>{
                nextEl.style.transition=siblingStyle.transition;
            },40);
        }
    });

    contentview.unmount=()=>{
        Object.assign(contentview.style,{position:null,transform:null});
        if(nextEl){
            const {style}=nextEl;
            style.transition="none";
            style.marginTop=state.marginTop;
            state.marginTop=null;
            setTimeout(()=>{
                const {siblingStyle}=state;
                style.transition=`${statics.transition}ms`;
                style.marginTop=siblingStyle.marginTop;
                setTimeout(()=>{
                    style.transition=siblingStyle.transition;
                },statics.transition);
            },0);
        }
        fadeOut(contentview,statics.transition,()=>{
            contentview.remove();
        });
    }

    return contentview;
}

const statics={
    transition:250,
};

const getNextElement=(parent)=>{
    let element=parent;
    while((element!==document.body)&&(!(element.nextSibling instanceof HTMLElement))){
        element=element.parentNode;
    }
    return element.nextSibling;
}
