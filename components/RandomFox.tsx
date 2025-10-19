import { useEffect, useRef, useState } from "react"
import type { ImgHTMLAttributes, JSX } from "react"

type LazyImageProps = { 
    src: string;
    onLazyLoad?: (node:HTMLImageElement) => void;
}
type ImageNative = ImgHTMLAttributes<HTMLImageElement>;
type Props = LazyImageProps & ImageNative;

export const LazyImage = ({src, onLazyLoad, ...imgProps}: Props): JSX.Element => {
    const node = useRef<HTMLImageElement>(null);
    const [currentSrc, setCurrentSrc] = useState("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiLz4=");
    const [isLazyLoaded, setIsLazyLoaded] = useState(false);

    useEffect(()=>{
        if(isLazyLoaded) return;

        //new observer
        const observer = new IntersectionObserver((entries => {
            entries.forEach(entry=> {
                if(entry.isIntersecting){
                    setCurrentSrc(src);
                    observer.disconnect();
                    setIsLazyLoaded(true);
                    if(typeof onLazyLoad === "function" && node.current){
                        onLazyLoad(node.current);
                    }
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
    }, [src, onLazyLoad, isLazyLoaded]);


    return <img 
        ref={node} 
        width={320} 
        height="auto" 
        src={currentSrc} 
        className="rounded-md"
        {...imgProps}
         />
}
