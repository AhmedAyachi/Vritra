import {useId,View,map,fadeOut} from "../../index";
import css from "./BubblesView.module.css";


export default function BubblesView(props){
    const {parent,id=useId("bubblesview"),colors}=props;
    const bubblesview=View({
        parent,id,
        style:styles.bubblesview(colors),
        className:css.bubblesview,
    }),state={
        unitangle:2*Math.PI/colors.length,
    };

    bubblesview.innateHTML=`
        ${map(colors,(color)=>`
            <div class="${css.bubble}" alt="${color}" style="background-color:${color};"></div>
        `)}
    `;

    const bubbles=bubblesview.querySelectorAll(`.${css.bubble}`);
    bubbles.forEach((bubble,i)=>{
        bubble.onclick=()=>{
            parent.setColor(colors[i]);
            bubblesview.unmount();
        }
        setTimeout(()=>{
            const angle=i*state.unitangle;
            bubble.style.transform=`translate(${["cos","sin"].map(key=>`calc(var(--range) * ${Math[key](angle)})`)})`;
        },0);
    });

    bubblesview.unmount=()=>{
        const {resizelistener}=state;
        resizelistener&&window.removeEventListener("resize",resizelistener);
        bubbles.forEach(bubble=>{
            bubble.style.transform=`translate(0,0)`;
        });
        fadeOut(bubblesview,400,()=>{
            bubblesview.remove();
        });
    }

    return bubblesview;
}

const styles={
    bubblesview:(colors)=>`
        --radius:${colors.length*8/11}em;
        --range:calc(6em + ${colors.length*10/11}em);
        --left:calc(var(--radius) / ${-2*colors.length/11});
    `,
}

/* const setPosition=(bubblesview,state)=>{
    const {parentNode}=bubblesview;
    const rect=parentNode.getBoundingClientRect();
    Object.assign(bubblesview.style,{
        position:"fixed",
        left:`${100*(rect.x+rect.width/2)/window.innerWidth}vw`,
        top:`${100*rect.y/window.innerHeight}vh`,
    });
}
 */