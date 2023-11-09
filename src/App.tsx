import React, {useEffect, useState} from 'react';
import './App.css';
import ReactAceEditor from "./ReactAceEditor";
import {Button, Col, Layout, message, Row, Select, Space, Tag} from "antd";
import {ContentPage} from "./ContentPage";
import {Content, Header} from "antd/lib/layout/layout";
import {
    CaretDownOutlined,
    CaretRightOutlined,
    CaretUpOutlined,
    SaveOutlined,
} from '@ant-design/icons';
import SaveModal from './SaveModal';

function App() {

    const [htmlValue, updateHtmlValue] = useState(JSON.parse(localStorage.getItem("code") || "{}")?.html || "");
    const [jsValue, updateJsValue] = useState(JSON.parse(localStorage.getItem("code") || "{}")?.js || "");
    const [cssValue, updateCssValue] = useState(JSON.parse(localStorage.getItem("code") || "{}")?.css || "");
    const [hasError, setHasError] = useState(JSON.parse(localStorage.getItem("code") || "{}")?.hasError || false);
    const [htmlAnnotations, setHtmlAnnotations] = useState([]);
    const [cssAnnotations, setCssAnnotations] = useState([]);
    const [jsAnnotations, setJsAnnotations] = useState([]);
    const [codeBlockMinify, setCodeBlockMinify] = useState(false);
    const contentId = "Id" + Math.random();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("code", JSON.stringify({html: htmlValue, css: cssValue, js: jsValue, hasError}));
    }, [htmlValue, cssValue, jsValue, hasError]);

    useEffect(() => {
        const container = document.getElementById(contentId);
        const jQuery = document.createElement('script');
        // @ts-ignore
        jQuery.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        // @ts-ignore
        container.contentWindow.document.getElementsByTagName('body')[0].appendChild(jQuery);
    }, []);

    useEffect(() => {
        var hasError = false;
        htmlAnnotations.forEach((annotation: any) => {
            if (annotation.type === "error") {
                hasError = true;
                return;
            }
        });

        cssAnnotations.forEach((annotation: any) => {
            if (annotation.type === "error") {
                hasError = true;
                return;
            }
        });

        jsAnnotations.forEach((annotation: any) => {
            if (annotation.type === "error") {
                hasError = true;
                return;
            }
        });

        setHasError(hasError);
    }, [htmlAnnotations, cssAnnotations, jsAnnotations]);

    const run = (html: string, css: string, js: string, hasError: boolean) => {

        const container = document.getElementById(contentId);
        // @ts-ignore
        container.contentWindow.document.getElementsByTagName('body')[0]?.querySelectorAll('*').forEach((n, i) => {
            if (n.getAttribute('src') === null || n.getAttribute('src') !== "https://code.jquery.com/jquery-3.6.0.min.js") {
                n.remove()
            }
        });
        // @ts-ignore
        container.contentWindow.document.getElementsByTagName('head')[0]?.firstElementChild?.remove();

        if (hasError) {
            message.error('Please fix the errors before running the code');
            return;

        }
        try {
            eval(js)
        } catch (e) {
            message.error('Please fix the javascript code before running the code');
            return;
        }

        const htmlDiv = document.createElement('div');
        htmlDiv.innerHTML = html;
        const style = document.createElement('style');
        style.innerHTML = css;
        // @ts-ignore
        const script = document.createElement('script');
        // @ts-ignore
        script.lang = "javascript";
        script.type = "text/javascript";
        script.innerText = js;
        // @ts-ignore
        container.contentWindow.document.getElementsByTagName('head')[0].appendChild(style);
        // @ts-ignore
        container.contentWindow.document.getElementsByTagName('body')[0].appendChild(htmlDiv);
        // @ts-ignore
        container.contentWindow.document.getElementsByTagName('body')[0].appendChild(script);
    }

    const onChangeFromHistory = (value: any) => {
        var htmlString = "";
        var cssString = "";
        var jsString = "";
        var error = false;
        Object.keys(JSON.parse(localStorage.getItem("historySave") || "{}")).map((key) => {
                if (key === value) {
                    const {html, css, js, hasError} = JSON.parse(localStorage.getItem("historySave") || "{}")[key];
                    htmlString = html;
                    cssString = css;
                    jsString = js;
                    error = hasError;
                    updateHtmlValue(html);
                    updateCssValue(css);
                    updateJsValue(js);
                    setHasError(hasError);
                }
            }
        )

        run(htmlString, cssString, jsString, error)
    }


    return (

        <Space direction="vertical" style={{width: '100%', maxHeight: '100vh', minHeight: '100vh'}}>
            <Layout>
                <Header className={'header'}>
                    <div style={{height: '100%', display: 'flex', justifyContent: "flex-end", alignItems: "center"}}>
                        <Select onChange={onChangeFromHistory} style={{width: '150px', marginRight: '15px'}}>
                            {localStorage.getItem("historySave") && Object.keys(JSON.parse(localStorage.getItem("historySave") || "{}")).map((key) => {
                                    return <Select.Option key={key} value={key}>{key}</Select.Option>
                                }
                            )}
                        </Select>
                        <Button type={"text"} icon={<SaveOutlined style={{fontSize: 24, color: '#e7e7e7'}}
                                                                  onClick={() => setOpen(true)}/>}></Button>
                    </div>
                </Header>
                <Content style={{maxHeight: '90vh'}}>
                    <Col className={`content-minify transition ${codeBlockMinify ? 'content-maximize' : ''}`} span={24}
                         style={{width: '100%'}}>
                        <ContentPage contentId={contentId}/>
                    </Col>
                    <Col span={24}
                         style={{display: "flex", justifyContent: "flex-end"}}>
                        <Button onClick={() => setCodeBlockMinify((prevState) => !prevState)}
                                icon={codeBlockMinify ? <CaretUpOutlined style={{color: "#008CBA", fontSize: 24}}/> :
                                    <CaretDownOutlined style={{color: "#008CBA", fontSize: 24}}/>}
                        />

                        <Button icon={<CaretRightOutlined style={{color: "#04AA6D", fontSize: 24}}/>}
                                onClick={() => run(htmlValue, cssValue, jsValue, hasError)}/>
                    </Col>
                    <Col span={24}
                         className={`code-block-maximize transition ${codeBlockMinify ? 'code-block-minify' : ''}`}>
                        <Row style={{width: '100%', height: '100%'}}>

                            <Col span={8} style={{height: '100%'}}>
                                <ReactAceEditor
                                    name={"html"}
                                    mode={"html"}
                                    theme={"monokai"}
                                    onChange={updateHtmlValue}
                                    onValidate={(e: any) => {
                                        setHtmlAnnotations(e);
                                        console.log(e)
                                    }}
                                    value={htmlValue}/>
                                <Tag className={'tag'} color="orange">HTML</Tag>
                                {/*<div id={'html'} style={{height: '100%'}}></div>*/}
                            </Col>
                            <Col span={8} style={{height: '100%'}}>
                                <ReactAceEditor
                                    name={"css"}
                                    mode={"css"}
                                    theme={"monokai"}
                                    onChange={updateCssValue}
                                    onValidate={(e: any) => {
                                        setCssAnnotations(e);
                                        console.log(e)
                                    }}
                                    value={cssValue}/>
                                <Tag className={'tag'} color="blue">CSS</Tag>
                                {/*<div id={'css'} style={{height: '100%'}}></div>*/}
                            </Col>
                            <Col span={8} style={{height: '100%'}}>
                                <ReactAceEditor
                                    name={"js"}
                                    mode={"javascript"}
                                    theme={"monokai"}
                                    onChange={updateJsValue}
                                    onValidate={(e: any) => {
                                        setJsAnnotations(e);
                                        console.log(e)
                                    }}
                                    value={jsValue}/>
                                <Tag className={'tag'} color="yellow">JS</Tag>
                                {/*<div id={'javascript'} style={{height: '100%'}}></div>*/}
                            </Col>
                        </Row>
                    </Col>
                </Content>
            </Layout>
            <SaveModal html={htmlValue} css={cssValue} js={jsValue} hasError={hasError} open={open} setOpen={setOpen}/>

        </Space>

    );
}

export default App;
