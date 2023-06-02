import {ViewProps,ViewInterface as View} from "../../index";


/**
 * Same as View component but with the default global cherry styling
 */
export default function CherryView<Tag extends keyof HTMLElementTagNameMap|undefined=undefined>(props:ViewProps<Tag>):Tag extends undefined?View<"div">:View<Tag>;;

