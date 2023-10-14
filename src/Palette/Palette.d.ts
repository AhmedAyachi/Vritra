import {ExtendableViewProps,View} from "../View/View";
import {NativeIcon} from "../ActionSetView/ActionSetView";


export default function Palette(props:ExtendableViewProps<"div">&{
    /**
     * Picker icon
     * @default palette icon
     */
    icon:NativeIcon,
    /**
     * default icon color
     * @default "black"
     */
    color?:String,
    /**
     * colors to pick from
     * @default ["red","purple","blue","cyan","green","yellow","orange","black","white"]
     */
    colors?:String[],
    onShowColors(element:Palette):void,
    onChange(color:String):void,
}):Palette;


interface Palette extends View<"div"> {
    /**
     * 
     * Sets the palette color, closes the picker if already open
     * @param color Color to be set.
     * Value shoud be in colors array otherwise color prop is used
     * @param callOnChange If true onChange is called, default to true
     */
    setColor(color:String,callOnChange?:boolean):void,
}
