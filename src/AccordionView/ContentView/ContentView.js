import {useId,View,fadeIn,fadeOut} from "../../index";
import css from "./ContentView.module.css";


export default function ContentView(props){
    const {parent,id=useId("contentview")}=props;
    const contentview=View({parent,id,className:css.contentview}),state={
        siblingstyle:null,
        nextEl:getNextElement(parent),
    },{nextEl}=state;

    contentview.innateHTML=`
    `;

    nextEl&&setTimeout(()=>{
        state.siblingstyle={};
        const {style}=nextEl;
        ["marginTop","transition"].forEach(key=>{
            state.siblingstyle[key]=style[key];
        });
        Object.assign(style,{
            marginTop:`${3.2+(100*contentview.clientHeight/window.innerWidth)}rem`,
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
            const {siblingstyle}=state;
            nextEl.style.marginTop=siblingstyle.marginTop;
            nextEl.style.transition="none";
        }
    });

    contentview.unmount=()=>{
        //parent.style.backgroundColor=null;
        Object.assign(contentview.style,{position:null,transform:null});
        if(nextEl){
            nextEl.style.marginTop=`${3.2+(100*contentview.clientHeight/window.innerWidth)}rem`;
            setTimeout(()=>{
                const {siblingstyle}=state;
                Object.assign(nextEl.style,{
                    transition:`${statics.transition}ms`,
                    marginTop:siblingstyle.marginTop,
                });
                setTimeout(()=>{
                    nextEl.style.transition=siblingstyle.transition;
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