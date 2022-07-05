import 'react-app-polyfill/ie11';
import * as React from 'react';
import {useCallback, useState} from 'react';
import * as ReactDOM from 'react-dom';
import {
    ChonkyActions,
    ChonkyActionUnion,
    ChonkyIconName,
    ChonkyThemeOverride,
    defineFileAction,
    FileAction,
    FileArray,
    FullFileBrowser,
    GenericFileActionHandler,
    setChonkyDefaults
} from '../.';

const App = () => {
    const testFiles: FileArray = [
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'wedewomdoiedmed', name: 'Folder1efwoijofjofjewojefwojfewojefwojewodeojoejeojewjejojewdej', isDir: true, size: 0, descr: 'Hier steht eine Beschreibungfwekojefwoijfeojefwo', childrenCount: 10},
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'wedewomdoiedeedeweddmed', name: 'Datei2.jpg', isDir: false, type: 'MEDIA', ext: '.jpg', color: '#473E7D'},
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'tesxhbcdovjewfefrgewfgfe', name: 'Datei4.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'tesxhbcewfewfewfdovjwfefefe', name: 'Datei5.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'tesxhbcdovjfewfewfefwefefewffew', name: 'Datei6.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'tesxhbcdovjefwefefwefefefefefwfewx', name: 'Datei7.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'tesxhbcdovjiomocmoicmdsiomcidmdismi', name: 'Datei8.to.send.wmv', isDir: false, type: 'MEDIA', ext: '.wmv', hideExt: true},
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'tesxhbcdovjcdsodsm,ocmdocmdomcodmcoc', name: 'Datei9.jpg.png', isDir: false, type: 'MEDIA'},
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'tesxhbcdovjdlc,ocd,oc,odc,docodmcodmc', name: 'Datei10.jpg', isDir: false, descr: 'Hier steht eine Beschreibungfwekojefwoijfeojefwo', type: 'MEDIA', ext: '.jpg'},
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'tesxhbcdovjdps,odcodmcomddsoosddocmckk', name: 'Datei11.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'tesxhbcdovjdps,odcodmcomddsoosdddwqdocmckk', name: 'Datei12.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'tesxhbcdovjdps,odcodmcomddsoosdwdqdwdocmckk', name: 'Datei13.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {modDate: "2022-07-05T09:34:51.575504Z", id: 'tesxhbcdovjdps,odcodmcomddsoosddddddocmckk', name: 'Datei14dqwiuhdwuhquwdhqwdquwuddwubhwdqbudwqbudqwwd.wdqhwqdi.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
    ]
    const testFiles2: FileArray = [
        {id: 'wedewomdoiedmed', name: 'Folder1', isDir: true, size: 0, descr: 'Hier steht eine Beschreibungfwekojefwoijfeojefwo', childrenCount: 10},
        {id: 'wedewomdoiedeedeweddmed', name: 'Datei2.jpg', isDir: false, type: 'MEDIA', ext: '.jpg', color: '#473E7D'},
        {id: 'tesxhbcdovjewfefrgewfgfe', name: 'Datei4.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcewfewfewfdovjwfefefe', name: 'Datei5.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjfewfewfefwefefewffew', name: 'Datei6.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjefwefefwefefefefefwfewx', name: 'Datei7.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjiomocmoicmdsiomcidmdismi', name: 'Datei8.to.send.wmv', isDir: false, type: 'MEDIA', ext: '.wmv', hideExt: true},
        {id: 'tesxhbcdovjcdsodsm,ocmdocmdomcodmcoc', name: 'Datei9.jpg.png', isDir: false, type: 'MEDIA'},
        {id: 'tesxhbcdovjdlc,ocd,oc,odc,docodmcodmc', name: 'Datei10.jpg', isDir: false, descr: 'Hier steht eine Beschreibungfwekojefwoijfeojefwo', type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjdps,odcodmcomddsoosddocmckk', name: 'Datei11.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjdps,odcodmcomddsoosdddwqdocmckk', name: 'Datei12.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjdps,odcodmcomddsoosdwdqdwdocmckk', name: 'Datei13.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
        {id: 'tesxhbcdovjdps,odcodmcomddsoosddddddocmckk', name: 'Datei14dqwiuhdwuhquwdhqwdquwuddwubhwdqbudwqbudqwwd.wdqhwqdi.jpg', isDir: false, type: 'MEDIA', ext: '.jpg'},
    ]
    const [files, setFiles] = useState(testFiles);

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
        ShowReferences: defineFileAction({
            id: 'showReferences',
            hotkeys: ['ctrl+r'],
            button: {
                name: 'Display uses',
                toolbar: false,
                contextMenu: true,
                icon: 'ChonkyCustomIconReferences',
            },
            customVisibilityContext: (file) => {
                if (file?.isDir === true) return 0
                return 2
            },
        } as const),
    }

    // Define custom types
    type CustomActionUnion = typeof CustomActions.TrashFiles | typeof CustomActions.ShowReferences
    type CustomHandler = GenericFileActionHandler<ChonkyActionUnion | CustomActionUnion>

    // available context actions in library
    const fileActionsLibrary: FileAction[] = [
        CustomActions.TrashFiles,
        CustomActions.ShowReferences
    ]

    // handles file browser actions
    const handleAction = useCallback<CustomHandler>(
        data => {
            const { selectedFilesForAction } = data.state

            // handle action type
            switch (data.id) {
                case CustomActions.TrashFiles.id:
                    console.log(CustomActions.TrashFiles.id)
                    break
                case CustomActions.ShowReferences.id:
                    console.log(CustomActions.ShowReferences.id)
                    break
                default:
            }
        },
        [],
    )

    const disableActions = [
        ChonkyActions.SelectAllFiles.id,
        ChonkyActions.OpenSelection.id,
        ChonkyActions.ClearSelection.id
    ]

    const theme: ChonkyThemeOverride = {
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
        },
        overrides: {
            MuiTooltip: {
                tooltip: {
                    fontSize: 16,
                    fontFamily: 'Helvetica',
                    textAlign: 'left',
                    color: 'black',
                    backgroundColor: 'white',
                    padding: '5px 10px',
                    borderRadius: 5,
                    lineHeight: '1em',
                    boxShadow: "0 4px 20px rgba(10, 0, 82, 0.1)",
                },
                arrow: {
                    left: '10px !important',
                    color: 'white',
                }
            }
        }
    }

    const config = {
        disableDefaultFileActions: disableActions,
        openFilesOnSingleClick: true,
        listViewProps: {itemSize: 70, space: 12},
        defaultFileViewActionId: ChonkyActions.EnableListView.id,
        displayCustomFileData: [{key: 'descr', width: 800}, {key: 'type'}],
    }

    setChonkyDefaults(config)

    return (
    <div style={{ height: 400 }}>
      <FullFileBrowser themeOverride={theme} onFileAction={handleAction} fileActions={fileActionsLibrary} files={files} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
