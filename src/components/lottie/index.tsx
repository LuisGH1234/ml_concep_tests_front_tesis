import React, { FC, useEffect, useRef } from "react";
import lottie from "lottie-web";

interface IProps {
    animationData: any;
    autoplay?: boolean;
    loop?: boolean;
    style?: React.CSSProperties;
}

export const Lottie: FC<IProps> = ({ style, autoplay = true, loop = false, animationData }) => {
    const container = useRef<HTMLDivElement>(null);
    const element = <div style={style} ref={container} />;

    useEffect(() => {
        lottie.loadAnimation({
            container: container.current!,
            renderer: "svg",
            loop,
            autoplay,
            animationData,
            // path: '../../misc/error.json',
        });
    }, []);

    return element;
};
