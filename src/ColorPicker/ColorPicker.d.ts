import {ViewProps,View} from "../View/View";


export default function ColorPicker(props:ViewProps&{
    /**
     * Picker icon
     * @default palette icon
     */
    icon:string|((color="#B5B9BD",weight=2)=>string),
    /**
     * initial icon color
     * @default "#B5B9BD"
     */
    color?:String,
    /**
     * colors to pick from
     * @default ["black","red","blue","green"]
     */
    colors?:String[],
    onShowColors(element:ColorPicker):void,
    onChange(color:String):void,
}):ColorPicker;


interface ColorPicker extends View {
    /**
     * 
     * @param color color to be set.
     * Value shoud be in colors array.
     * Closes the picker if already open.
     */
    setColor(color:String):void,
}
