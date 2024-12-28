import {ExtendableViewProps,View} from "../View/View";


export default function Switch(props:ExtendableViewProps<"div">&{
    active?:boolean,
    thumbColor?:string|SwitchColor,
    trackColor?:string|SwitchColor,
    /**
     * @default false
     */
    readonly?:boolean,
    onChange(active:Boolean):void,
}):Switch;

type Switch=View<"div">&{
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
     * Color when not active
     */
    false?:string,
    /**
     * Color when active
     */
    true?:string,
};
