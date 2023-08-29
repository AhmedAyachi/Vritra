import {ViewProps,View} from "../View/View";


/**
 * Same as View component but with the default global styling
 */
export default function NativeView<Tag extends keyof HTMLElementTagNameMap|undefined=undefined>(props:ViewProps<Tag>):Tag extends undefined?View<"div">:View<Tag>;

