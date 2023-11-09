import {Button, Col, Divider, Form, Input, Modal, Row} from "antd";
import React from "react";

export default function SaveModal({html, css, js, hasError, open, setOpen}: {
    html: string,
    css: string,
    js: string,
    hasError: boolean,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {

    const onFinish = (value: any) => {
        localStorage.setItem("historySave", JSON.stringify({
            ...JSON.parse(localStorage.getItem("historySave") || "{}"),
            [value.name]: {html, css, js, hasError}
        }));
        setOpen(false);
    }

    const handleCancel = () => {
        setOpen(false)
    }

    return (
        <Modal width={'50%'} open={open}
               footer={null} onCancel={handleCancel}>

            <Row>
                <Col xs={24} sm={24}>
                    <Form onFinish={(value) => onFinish(value)}
                          name="basic"
                          className="gx-signin-form gx-form-row0">
                        <Col xs={24} sm={24}>
                            <Form.Item name={"name"}
                                       rules={[{required: true, message: 'Name field is required.'}]}>
                                <Input placeholder={"Name"}/>
                            </Form.Item>
                            <Divider></Divider>
                            <Form.Item style={{display: 'flex', justifyContent: 'flex-end'}}>
                                <Button type={'primary'} key={'submit'} htmlType={'submit'}>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Col>
                    </Form>
                </Col>
            </Row>
        </Modal>
    )
}