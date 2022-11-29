import {View} from "../View/View";


export default function ColorPicker(props:{
    /**
     * initial icon color
     * @default "#B5B9BD"
     */
    color:string,
    /**
     * colors to pick from
     * @default ["black","red","blue","green"]
     */
    colors:string[],
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
    setColor(color:string):void,
}
