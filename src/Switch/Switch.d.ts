import {ViewProps,View} from "../View/View";


export default function Switch(props:ViewProps<"div">&{
    active?:boolean,
    thumbColor?:String|SwitchColor,
    trackColor?:String|SwitchColor,
    /**
     * @default false
     */
    readonly:boolean,
    onChange(active:Boolean):void,
}):Switch;

interface Switch extends View<"div"> {
    /**
     * Sets the switch status. Toggling behavior by default.
     * 
     * If readonly is false, onChange is called
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
