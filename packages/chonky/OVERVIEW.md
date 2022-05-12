# Overview

Chonky uses a smart system to manage redux states and actions as well as types. 
Although this makes managing the code base of such an extensive library easy in the long run, it can be overwhelming for programmers who are not familiar with the repository.
This md file aims at solving this issue by giving its reader a quick overview over the code base. This should make the implementation of new features a more straight-forward process that doesn't come with the prerequisite of hours spent analyzing the code base. 
Information about setting up the development environment, lerna and tsdx can be found in the other md files.

## Folder structure

* **action-definitions**: Contains all action definitions
* **components**: Contains all external, internal and file list components as well as component specific hooks 
* **extensions**: Contains file-specific hooks
* **redux**: Contains redux states, reducers, selectors and thunks
* **types**: Contains all chonky types
* **util**: Contains utilities such as the default-config setter function, functions for dnd, helpers and more

## How does it work?

To understand how chonky works we should first analyze what happens when chonky is initialized in another application.

When the package is being rendered in another app the user usually imports the FullFileBrowser which is exported from components/external.
This is what the return function looks like:

```tsx
<FileBrowser ref={ref} {...props}>
    <FileNavbar />
    <FileToolbar />
    <FileList emptyState={emptyState} onScroll={onScroll}/>
    <FileContextMenu/>
</FileBrowser>
```

### Settings

As we can see, the component exports the FileBrowser along with several children. Its props are the FileBrowserProps which are partly made up of chonky's initial settings and are partly variable props inserted at runtime by the importing application.
This is why the function exported by default-config.ts located in util/ takes an object containing parts of the FileBrowserProps as a parameter. This function enables setting some of chonky's setting states during the initialization process rather than passing them in as props during runtime.

```ts
export const defaultConfig: ChonkyConfig = {
    fileActions: null,
    onFileAction: null,
    thumbnailGenerator: null,
    doubleClickDelay: 300,
    disableSelection: false,
    disableDefaultFileActions: false,
    disableDragAndDrop: false,
    disableDragAndDropProvider: false,
    defaultSortActionId: ChonkyActions.SortFilesByName.id,
    defaultFileViewActionId: ChonkyActions.EnableGridView.id,
    clearSelectionOnOutsideClick: true,
    openFilesOnSingleClick: false,
    iconComponent: ChonkyIconPlaceholder,
    darkMode: false,
    listViewProps: null,
    i18n: {},
    displayCustomFileData: false,
};

export const setChonkyDefaults = (config: Partial<ChonkyConfig>) => {
    for (const key of Object.keys(defaultConfig)) {
        if (key in config) {
            // @ts-ignore
            defaultConfig[key as keyof ChonkyConfig] = config[
                key as keyof ChonkyConfig
            ] as any;
        }
    }
};
```

The FileBrowser Component then uses the passed in props whether they are set during initialization or at runtime to set the theme and pass them on to ChonkyBusinessLogic located in components/internal:

```tsx
const theme = useMemo(() => {
    const muiTheme = createMuiTheme({
        palette: { type: darkMode ? 'dark' : 'light' },
    });
    const lightThemeOverride = merge(
        muiTheme,
        merge(lightTheme, props.themeOverride ? props.themeOverride : {})
    )
    const combinedTheme = merge(
        muiTheme,
        merge(lightThemeOverride, darkMode ? darkThemeOverride : {})
    );
    return isMobileBreakpoint
        ? merge(combinedTheme, mobileThemeOverride)
        : combinedTheme;
}, [darkMode, isMobileBreakpoint]);

const chonkyComps = (
    <>
        <ChonkyBusinessLogic ref={ref} {...props} />
        <ChonkyPresentationLayer>{children}</ChonkyPresentationLayer>
    </>
);
```

ChonkyBusinessLogic then sets the correct settings...

```ts
    React.forwardRef<FileBrowserHandle, FileBrowserProps>((props, ref) => {
        // ==== Update Redux state
        usePropReduxUpdate(reduxActions.setRawFiles, props.files ?? initialRootState.rawFiles);
        usePropReduxUpdate(reduxActions.setRawFolderChain, props.folderChain);
        useDTE(
            thunkUpdateRawFileActions,
            getValueOrFallback(props.fileActions, defaultConfig.fileActions),
            getValueOrFallback(props.disableDefaultFileActions, defaultConfig.disableDefaultFileActions)
        );
        useDTE(
            reduxActions.setExternalFileActionHandler,
            getValueOrFallback(props.onFileAction, defaultConfig.onFileAction) as any
        )
        // ...
    })
```

...and is loaded in the FileBrowser's return function:

```tsx
<IntlProvider locale="en" defaultLocale="en" {...i18n}>
    <ChonkyFormattersContext.Provider value={formatters}>
        <ReduxProvider store={store}>
            <ThemeProvider theme={theme}>
                <MuiThemeProvider theme={theme}>
                    <ChonkyIconContext.Provider
                        value={
                            iconComponent ??
                            defaultConfig.iconComponent ??
                            ChonkyIconPlaceholder
                        }
                    >
                        {disableDragAndDrop || disableDragAndDropProvider ? (
                            chonkyComps
                        ) : (
                            <DndProvider backend={HTML5Backend}>
                                {chonkyComps}
                            </DndProvider>
                        )}
                    </ChonkyIconContext.Provider>
                </MuiThemeProvider>
            </ThemeProvider>
        </ReduxProvider>
    </ChonkyFormattersContext.Provider>
</IntlProvider>
```

### react-window

Depending on what view mode is selected, chonky generates list or grid views handled by react-window:

```tsx
const listRenderer = useCallback(
    ({ width, height }: { width: number; height: number }) => {
        if (displayFileIds.length === 0) {
            return <FileListEmpty width={width} height={!emptyState ? viewConfig.entryHeight : height} emptyState={emptyState} />
        } else if (viewConfig.mode === FileViewMode.List) {
            return <ListContainer width={width} height={height} />;
        } else {
            return <GridContainer width={width} height={height} />;
        }
    },
    [displayFileIds, viewConfig]
);
```

ListContainer:

```tsx
// When entry size is null, we use List view
const rowRenderer = (data: { index: number; style: CSSProperties }) => {
    return (
        <div style={{
            ...data.style,
            ...(fileListProps?.space && { height: data.style.height as number - fileListProps.space} ),
        }}>
            <SmartFileEntry
                fileId={displayFileIds[data.index] ?? null}
                displayIndex={data.index}
                fileViewMode={FileViewMode.List}
            />
        </div>
    );
};

return (
    <FixedSizeList
        ref={listRef as any}
        className={c([classes.listContainer, 'chonky-listContainer'])}
        itemSize={viewConfig.entryHeight}
        height={height}
        itemCount={displayFileIds.length}
        width={width}
        itemKey={getItemKey}
        {...getFileListProps()}
    >
        {rowRenderer}
    </FixedSizeList>
);
```

### Entries

SmartFileEntries will either render a grid item or a list item. Those are handled separately in different components. To handle those components redux selectors and component-specific hooks are being used.
This is a ListEntry:

```tsx
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
        {customFileData && customFileData.map(data => <div key={data.key} className={classes.listFileEntryProperty}>
            {data.data ? <span>{data.data}</span> : <span>—</span>}
        </div>)}
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
```

### Action-Definitions

Chonky uses a smart system to manage actions. This means it's possible to define actions that dispatch certain redux state changes, while their call is being registered by chonky's action handler. Since the action handler can be a callback function passed into the component, the performance of an action can be registered at the top level of the application running chonky.
Called actions can also pass their payload to the action handler. Which means information about the file the action was performed on becomes available at the top level.

```ts
const DefaultActions = {
    /**
     * Action that can be used to open currently selected files.
     */
    OpenSelection: defineFileAction(
        {
            id: 'open_selection',
            hotkeys: ['enter'],
            requiresSelection: true,
            fileFilter: FileHelper.isOpenable,
            button: {
                name: 'Open selection',
                toolbar: true,
                contextMenu: true,
                group: 'Actions',
                icon: ChonkyIconName.openFiles,
            },
        } as const,
        ({ state, reduxDispatch }) => {
            reduxDispatch(
                thunkRequestFileAction(EssentialActions.OpenFiles, {
                    files: state.selectedFilesForAction!,
                })
            );
            return undefined;
        }
    ),
    /**
     * Action that enables List view.
     */
    EnableListView: defineFileAction({
        id: 'enable_list_view',
        fileViewConfig: {
            mode: FileViewMode.List,
            entryHeight: 30,
        },
        button: {
            name: 'Switch to List view',
            toolbar: true,
            icon: ChonkyIconName.list,
            iconOnly: true,
        },
    } as const)
}
```

The entries of an action depend on its use case. For example, the button key defines whether the action should be performed by clicking a button. The button key should then define where the button is located, its name etc.
Chonky will add an action that's being called by a button to the toolbar or context automatically.

#### default.ts

This file contains actions that are enabled by default

#### essentials.ts

This file contains actions that are essential to how chonky functions. Therefore, they can not be disabled. Those actions are usually called by hooks or other actions through the thunkRequestFileAction function located in redux/thunks/dispatchers.thunks.tsx .

```ts
const EssentialActions = {
    /**
     * Action that is dispatched when user opens the context menu, either by right click
     * on something or using the context menu button on their keyboard.
     */
    OpenFileContextMenu: defineFileAction(
        {
            id: 'open_file_context_menu',
            __payloadType: {} as OpenFileContextMenuPayload,
        } as const,
        ({payload, reduxDispatch, getReduxState}) => {
            // TODO: Check if the context menu component is actually enabled. There is a
            //  chance it doesn't matter if it is enabled or not - if it is not mounted,
            //  the action will simply have no effect. It also allows users to provide
            //  their own components - however, users could also flip the "context menu
            //  component mounted" switch...
            const triggerFile = getFileData(getReduxState(), payload.triggerFileId);
            if (triggerFile) {
                const fileSelected = getIsFileSelected(getReduxState(), triggerFile);
                if (!fileSelected) {
                    // If file is selected, we leave the selection as is. If it is not
                    // selected, it means user right clicked the file with no selection.
                    // We simulate the Windows Explorer/Nautilus behaviour of moving
                    // selection to this file.
                    if (FileHelper.isSelectable(triggerFile)) {
                        reduxDispatch(
                            reduxActions.selectFiles({
                                fileIds: [payload.triggerFileId],
                                reset: true,
                            })
                        );
                    } else {
                        reduxDispatch(reduxActions.clearSelection());
                    }
                }
            }

            reduxDispatch(
                reduxActions.showContextMenu({
                    triggerFileId: payload.triggerFileId,
                    mouseX: payload.clientX - 2,
                    mouseY: payload.clientY - 4,
                })
            );
        }
    ),
}
```

In the snippet shown above we can see that redux selectors and dispatchers are being used to change the state of the context menu. As this action is called internally through a hook used in components, there's no button entry for the action.

### Redux

Learn more about redux: https://redux.js.org/











