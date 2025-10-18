import { useEffect, useRef, useState } from "react"
import type { ImgHTMLAttributes, JSX } from "react"

type LazyImageProps = { src: string }
type ImageNative = ImgHTMLAttributes<HTMLImageElement>;
type Props = LazyImageProps & ImageNative;

export const LazyImage = ({src, ...imgProps}: Props): JSX.Element => {
    const node = useRef<HTMLImageElement>(null);
    const [currentSrc, setCurrentSrc] = useState("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=");

    useEffect(()=>{
        //new observer
        const observer = new IntersectionObserver((entries => {
            entries.forEach(entry=> {
                if(entry.isIntersecting){
                    setCurrentSrc(src);
                }
            })
        }))

        //observe node
        if(node.current){
            observer.observe(node.current);
        }

        //disconnect
        return ()=>{
            observer.disconnect();
        }
    }, [src]);


    return <img 
        ref={node} 
        width={320} 
        height="auto" 
        src={currentSrc} 
        className="rounded-md"
        {...imgProps}
         />
}
