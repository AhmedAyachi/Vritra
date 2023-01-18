import {ViewProps,View} from "../View/View";


export default function Switch(props:ViewProps&{
    active?:boolean,
    thumbColor?:String|SwitchColor,
    trackColor?:String|SwitchColor,
    onChange(active:Boolean):void,
}):Switch;

interface Switch extends View {
    /**
     * Sets the switch status. Toggling behavior by default
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
