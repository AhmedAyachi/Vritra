import {View} from "../../index";
import css from "./TabView.module.css";


export default function TabView(props){
    const {parent,tab,textColor}=props,{icon,label}=tab;
    const tabview=tab.element=View({
        parent,tag:"button",
        style:{color:textColor},
        className:css.tabview,
    });

    tabview.innateHTML=`
        ${icon?`<img ref="iconEl"/>`:""}
        ${label?`<text as="label" ref="labelEl"></text>`:""}
    `;
    
    tabview.onclick=()=>{
        const tabnavigator=parent.parentNode;
        tabnavigator.navigate(tab.id);
    };

    tabview.setColor=(color=textColor)=>{
        const {iconEl}=tabview;
        if(iconEl){
            iconEl.src=typeof(icon)==="function"?icon(color):icon;
        }
        tabview.style.color=color;
    }
    tabview.setIcon=(icon)=>{
        const {iconEl}=tabview;
        if(iconEl){
            if(!icon) icon=tab.icon;
            iconEl.src=typeof(icon)==="function"?icon(color):icon;
        }
    }
    tabview.setLabel=(text)=>{
        const {labelEl}=tabview;
        if(labelEl){
            if(typeof(text)!=="string") text=typeof(label)==="function"?label():label;
            labelEl.innerText=text;
        }
    }

    tabview.setColor();
    tabview.setLabel();
    return tabview;
}
