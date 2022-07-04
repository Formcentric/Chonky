import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {Tooltip, TooltipProps} from "@material-ui/core";

export interface FileEntryTooltipProps extends React.HTMLAttributes<HTMLDivElement>{
    tooltipTitle: TooltipProps['title']
}

const FileEntryTooltip = ({children, tooltipTitle, ...restProps}: FileEntryTooltipProps) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (wrapperRef.current && wrapperRef.current.offsetWidth < wrapperRef.current.scrollWidth) {
            setShowTooltip(true)
        } else {
            setShowTooltip(false)
        }
    }, [wrapperRef.current, children]);


    return(
        <div {...restProps} ref={wrapperRef}>
            <Tooltip
                disableHoverListener={!showTooltip}
                disableFocusListener={!showTooltip}
                disableTouchListener={!showTooltip}
                title={tooltipTitle}
            >
                {children as ReactElement<any, any>}
            </Tooltip>
        </div>
    )
}

export default FileEntryTooltip;