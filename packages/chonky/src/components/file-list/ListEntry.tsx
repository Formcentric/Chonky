import React, { useContext, useMemo } from 'react';

import { DndEntryState, FileEntryProps } from '../../types/file-list.types';
import { useLocalizedFileEntryStrings } from '../../util/i18n';
import { ChonkyIconContext } from '../../util/icon-helper';
import { c, makeLocalChonkyStyles } from '../../util/styles';
import { TextPlaceholder } from '../external/TextPlaceholder';
import {
    useContextMenuActionButton,
    useCustomFileDataKeys,
    useDndIcon,
    useFileEntryHtmlProps,
    useFileEntryState,
} from './FileEntry-hooks';
import { FileEntryName } from './FileEntryName';
import { FileEntryState, useCommonEntryStyles } from './GridEntryPreview';

interface StyleState {
    entryState: FileEntryState;
    dndState: DndEntryState;
}

export const ListEntry: React.FC<FileEntryProps> = React.memo(
    ({ file, selected, focused, dndState }) => {
        const entryState: FileEntryState = useFileEntryState(file, selected, focused);
        const dndIconName = useDndIcon(dndState);

        const { fileModDateString, fileSizeString } = useLocalizedFileEntryStrings(
            file
        );
        const styleState = useMemo<StyleState>(
            () => ({
                entryState,
                dndState,
            }),
            [dndState, entryState]
        );
        const classes = useStyles(styleState);
        const commonClasses = useCommonEntryStyles(entryState);
        const ChonkyIcon = useContext(ChonkyIconContext);
        const fileEntryHtmlProps = useFileEntryHtmlProps(file);
        const customFileData = useCustomFileDataKeys(file)
        const contextMenuActionButton = useContextMenuActionButton(c([classes.listFileEntryProperty, 'chonky-listFileEntryProperty']))

        return (
            <div className={c([classes.listFileEntry, 'chonky-listFileEntry'])} {...fileEntryHtmlProps}>
                <div className={c([commonClasses.focusIndicator, 'chonky-listFileEntryFocusIndicator'])}></div>
                <div
                    className={c([
                        commonClasses.selectionIndicator,
                        classes.listFileEntrySelection,
                        'chonky-listFileEntrySelectionIndicator'
                    ])}
                ></div>
                <div className={c([classes.listFileEntryIcon, 'chonky-listFileEntryIcon'])}>
                    <ChonkyIcon
                        icon={dndIconName ?? entryState.icon}
                        spin={dndIconName ? false : entryState.iconSpin}
                        fixedWidth={true}
                    />
                </div>
                <div
                    className={c([classes.listFileEntryName, 'chonky-listFileEntryName'])}
                    title={file ? file.name : undefined}
                >
                    <FileEntryName file={file} />
                </div>
                {customFileData && customFileData.map(data => (
                    <div
                        key={data.key}
                        className={classes.listFileEntryProperty}
                        style={data?.width ? {flex: `0 1 ${data.width}px`} : {}}
                        title={data?.width && data.data ? data.data : undefined}
                    >
                        {data.data ? <span>{data.data}</span> : <span>—</span>}
                    </div>
                ))}
                <div className={c([classes.listFileEntryProperty, 'chonky-listFileEntryProperty'])}>
                    {file ? (
                        fileModDateString ?? <span>—</span>
                    ) : (
                        <TextPlaceholder minLength={5} maxLength={15} />
                    )}
                </div>
                <div className={c([classes.listFileEntryProperty, 'chonky-listFileEntryProperty'])}>
                    {file ? (
                        fileSizeString ?? <span>—</span>
                    ) : (
                        <TextPlaceholder minLength={10} maxLength={20} />
                    )}
                </div>
                    {contextMenuActionButton}
            </div>
        );
    }
);

const useStyles = makeLocalChonkyStyles(theme => ({
    listFileEntry: {
        boxShadow: `inset ${theme.palette.divider} 0 -1px 0`,
        fontSize: theme.listFileEntry.fontSize,
        color: ({ dndState }: StyleState) =>
            dndState.dndIsOver
                ? dndState.dndCanDrop
                    ? theme.dnd.canDropColor
                    : theme.dnd.cannotDropColor
                : 'inherit',
        alignItems: 'center',
        position: 'relative',
        display: 'flex',
        height: '100%',
    },
    listFileEntrySelection: {
        opacity: 0.6,
    },
    listFileEntryIcon: {
        color: ({ entryState, dndState }: StyleState) =>
            dndState.dndIsOver
                ? dndState.dndCanDrop
                    ? theme.dnd.canDropColor
                    : theme.dnd.cannotDropColor
                : entryState.color,
        fontSize: theme.listFileEntry.iconFontSize,
        boxSizing: 'border-box',
        padding: [2, 4],
        zIndex: 20,
    },
    listFileEntryName: {
        textOverflow: 'ellipsis',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        flex: '1 1 300px',
        paddingLeft: 8,
        zIndex: 20,
    },
    listFileEntryProperty: {
        fontSize: theme.listFileEntry.propertyFontSize,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        flex: '0 1 150px',
        padding: [2, 8],
        zIndex: 20,
    },
}));
