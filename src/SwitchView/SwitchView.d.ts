import {ViewProps,View} from "../View/View";


export default function SwitchView(props:ViewProps&{
    active?:boolean,
    thumbColor?:String|SwitchColor,
    trackColor?:String|SwitchColor,
    onChange(active:Boolean):void,
}):SwitchView;

interface SwitchView extends View {
    /**
     * Sets the switchview status. Toggling behavior by default
     * @param active 
     */
    toggle(active:boolean):void,
}

type SwitchColor={
    /**
     * Color when active
     */
    true:string,
    /**
     * Color when not active
     */
    false:string,
};
