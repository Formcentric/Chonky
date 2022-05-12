import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    ChonkyActions,
    ChonkyActionUnion, ChonkyIconName,
    defineFileAction, FileAction,
    FileArray,
    FullFileBrowser,
    GenericFileActionHandler, setChonkyDefaults
} from '../.';
import {useCallback} from "react";
import {ChonkyTheme} from "../src/util/styles";
import {DeepPartial} from "tsdef";

const App = () => {
    const testFiles: FileArray = [
        {id: 'wedewomdoiedmed', name: 'Folder1', isDir: true, size: 0, descr: 'Hier steht eine Beschreibung', childrenCount: 10},
        {id: 'wedewomdoiedeedeweddmed', name: 'Datei2.jpg', isDir: false, type: 'MEDIA', ext: '.jpg', color: '#473E7D'},
        {id: 'tesxhbcdovjewfefrgewfgfe', name: 'Datei4.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcewfewfewfdovjwfefefe', name: 'Datei5.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjfewfewfefwefefewffew', name: 'Datei6.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjefwefefwefefefefefwfewx', name: 'Datei7.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjiomocmoicmdsiomcidmdismi', name: 'Datei8.to.send.wmv', isDir: false, type: 'MEDIA', ext: '.wmv', hideExt: true},
        {id: 'tesxhbcdovjcdsodsm,ocmdocmdomcodmcoc', name: 'Datei9.jpg.png', isDir: false, type: 'MEDIA'},
        {id: 'tesxhbcdovjdlc,ocd,oc,odc,docodmcodmc', name: 'Datei10.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjdps,odcodmcomddsoosddocmckk', name: 'Datei11.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjdps,odcodmcomddsoosdddwqdocmckk', name: 'Datei12.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjdps,odcodmcomddsoosdwdqdwdocmckk', name: 'Datei13.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjdps,odcodmcomddsoosddddddocmckk', name: 'Datei14dqwiuhdwuhquwdhqwdquwuddwubhwdqbudwqbudqwwd.wdqhwqdi.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
    ]

    const CustomActions = {
        TrashFiles: defineFileAction({
            id: 'trashFiles',
            hotkeys: ['ctrl+d'],
            button: {
                name: 'Delete',
                toolbar: false,
                contextMenu: true,
                icon: ChonkyIconName.trash,
            },
        }),
    }

    const customActionTrash = defineFileAction({
        id: 'trashFiles',
        __payloadType: {} as { three: string },
    })

    // Define custom types
    type CustomActionUnion = typeof customActionTrash
    type CustomHandler = GenericFileActionHandler<ChonkyActionUnion | CustomActionUnion>

    // available context actions in library
    const fileActionsLibrary: FileAction[] = [
        CustomActions.TrashFiles,
    ]

    // handles file browser actions
    const handleAction = useCallback<CustomHandler>(
        data => {
            const { selectedFilesForAction } = data.state

            // handle action type
            switch (data.id) {
                case CustomActions.TrashFiles.id:
                    break
                default:
            }
        },
        [],
    )

    const disableActions = [
        // ChonkyActions.SelectAllFiles.id,
        // ChonkyActions.OpenSelection.id,
    ]

    const theme: DeepPartial<ChonkyTheme> = {
        dnd: {
            canDropColor: '#69CA90',
            cannotDropColor: '#FF7171',
        },
        gridFileEntry: {
            iconColor: '#473F7D',
            iconColorFocused: '#473F7D',
            fileColorFocusedTint: 'inset rgb(71 62 125) 0 0 0 3px',
            fileColorSelectedTint: 'inset rgb(71 62 125) 0 0 0 3px',
            folderFrontColorTint: '#FFBB75',
            folderBackColorTint: '#F4A553',
            folderBackColorFocusedTint: '#F4A553',
            folderBackColorSelectedTint: '#F4A553',
            folderFrontColorFocusedTint: 'inset rgb(71 62 125) 0 0 0 3px',
            folderFrontColorSelectedTint: 'inset rgb(71 62 125) 0 0 0 3px',
            previewFile: {
                backgroundColor: 'none',
            }
        },
        selectionIndicator: {
            background: 'none',
        },
        focusIndicator: {
            boxShadow: 'rgb(71 62 125) 0 0 0 1px inset',
            position: 'absolute',
            height: '100%',
            width: '100%',
            zIndex: 11,
        }
    }

    const config = {
        disableDefaultFileActions: disableActions,
        openFilesOnSingleClick: true,
        listViewProps: {itemSize: 70, space: 12},
        defaultFileViewActionId: ChonkyActions.EnableListView.id,
        displayCustomFileData: ['descr', 'type'],
    }

    setChonkyDefaults(config)

    return (
    <div style={{ height: 400 }}>
      <FullFileBrowser themeOverride={theme} onFileAction={handleAction} fileActions={fileActionsLibrary} files={testFiles} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
