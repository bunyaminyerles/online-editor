import React from "react";
import {render} from "react-dom";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/worker-html";
import "ace-builds/src-noconflict/worker-css";
import "ace-builds/src-noconflict/worker-javascript";
import "ace-builds/src-noconflict/ext-language_tools";
import 'ace-builds/webpack-resolver';
import 'ace-builds/esm-resolver';
import "ace-builds/src-noconflict/ext-emmet";
import {createRoot} from "react-dom/client";

export default function ReactAceEditor(data: any) {
    return <AceEditor
        mode={data.mode}
        width="100%"
        height="100%"
        name={data.name}
        theme={data.theme}
        onChange={data.onChange}
        onValidate={data.onValidate}
        fontSize={14}
        showPrintMargin={true}
        showGutter={true}
        highlightActiveLine={true}
        value={data.value}
        wrapEnabled={true}
        setOptions={{
            useWorker: true,
            enableEmmet: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2
        }}
    />;
    /*
        const ace =<AceEditor
            mode={data.mode}
            width="100%"
            height="100%"
            name="blah2"
            theme={data.theme}
            onChange={data.onChange}
            onValidate={data.onValidate}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            value={data.value}
            wrapEnabled={true}
            setOptions={{
                useWorker: true,
                enableEmmet: true,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 2
            }}
        />;

        const container = document.getElementById(id) as HTMLElement;
        const root = createRoot(container);
        root.render(ace);*/
}
