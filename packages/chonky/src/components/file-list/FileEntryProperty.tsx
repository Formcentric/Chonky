import React, {ReactElement, useEffect, useRef, useState} from 'react';
import {Tooltip, TooltipProps} from "@material-ui/core";
//
export interface FileEntryPropertyProps extends React.HTMLAttributes<HTMLDivElement>{
    tooltipTitle: TooltipProps['title']
}

const FileEntryProperty = ({children, tooltipTitle, ...propertyProps}: FileEntryPropertyProps) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const propertyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (propertyRef.current && propertyRef.current.offsetWidth < propertyRef.current.scrollWidth && children) {
            setShowTooltip(true)
        } else {
            setShowTooltip(false)
        }
    }, [propertyRef.current, children]);


    return(
        <div {...propertyProps} ref={propertyRef}>
            <Tooltip
                disableHoverListener={!showTooltip}
                disableFocusListener={!showTooltip}
                disableTouchListener={!showTooltip}
                title={tooltipTitle ?? ''}
            >
                {children ? <span>{children as ReactElement<any, any>}</span> : <span>—</span>}
            </Tooltip>
        </div>
    )
}

export default FileEntryProperty;