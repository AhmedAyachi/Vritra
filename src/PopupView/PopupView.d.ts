import {ViewProps,View} from "../View/View";

/**
 * A self-position-adjustment view.
 * @param props 
 */
export default function PopupView<Tag extends "div"|"menu"|"dialog"|undefined=undefined>(props:ViewProps<Tag>&{
    /**
     * The element near which the PopupView is shown.
     */
    target?:HTMLElement,
    /**
     * If target is specified, parent is the element 
     * relative to which the PopupView will adjust its position.
     * @default document.documentElement
     */
    parent?:HTMLElement,
    /**
     * Unmounts the PopupView on outside click.
     * @default true
     */
    avoidable?:boolean,
    /**
     * popup offset.
     */
    offset?:{x?:number,y?:number},
    onRemove?():void;
}):Tag extends undefined?PopupView<"div">:PopupView<Tag>;


type PopupView<Tag>=View<Tag>&{
    /**
     * updates the PopupView position.
     */
    position():void;
    /**
     * removes the PopupView from the DOM with a fade-out animation.
     */
    unmount():void,
}
