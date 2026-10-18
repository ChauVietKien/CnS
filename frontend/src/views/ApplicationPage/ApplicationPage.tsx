"use client"

import React, { useEffect } from 'react'
import { Button, Form, Input, InputNumber } from 'antd';
import style from "./ApplicationPage.module.css"
import * as PostService from "@/services/PostService"
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

interface Schedule {
    day: String;
    startTime: String;
    endTime  : String;
}

interface PostItem {
    subject: String;
    Class: String;
    method: String;
    tutorname: String;
    description: String;
    schedules: Schedule[];
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const onFinish = (values: any) => {
  console.log(values);
};

const ApplicationPage = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: tutor, isPending } = useQuery<(PostItem)>({
    queryKey: ["postId", postId],
    queryFn: () => PostService.getPost(postId!).then(res => res.data),
    enabled: !!postId,
  })

  useEffect(() => {
    if (tutor) {
        form.setFieldsValue({
        user: {
            name: tutor.tutorname,
            email: tutor.subject,
            age: tutor.Class,
            website: tutor.method,
            introduction: tutor.description,
        }
        });
    }
    }, [tutor, form]);

  return (
    <div className={style.main}>
        <div className={style.twodiv}>
            <h1 className='flex font-bold text-2xl justify-start mb-5'>Thông tin gia sư + buổi học</h1>
            <Form
                form={form}
                {...layout}
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
                validateMessages={validateMessages}
            >
                <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
                <Input readOnly/>
                </Form.Item>
                <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email' }]}>
                <Input readOnly/>
                </Form.Item>
                <Form.Item name={['user', 'age']} label="Age" rules={[{ type: 'number', min: 0, max: 99 }]}>
                <InputNumber readOnly/>
                </Form.Item>
                <Form.Item name={['user', 'website']} label="Website">
                <Input readOnly/>
                </Form.Item>
                <Form.Item name={['user', 'introduction']} label="Introduction">
                <Input.TextArea readOnly/>
                </Form.Item>
            </Form>
            <h1 className='flex font-bold text-2xl justify-start mb-5'>Thông tin đăng kí</h1>
            <Form
                {...layout}
                onFinish={onFinish}
                style={{ maxWidth: 600 }}
                validateMessages={validateMessages}
            >
                <Form.Item name={['user', 'name']} label="Name" rules={[{ required: true }]}>
                <Input />
                </Form.Item>
                <Form.Item name={['user', 'email']} label="Email" rules={[{ type: 'email' }]}>
                <Input />
                </Form.Item>
                <Form.Item name={['user', 'age']} label="Age" rules={[{ type: 'number', min: 0, max: 99 }]}>
                <InputNumber />
                </Form.Item>
                <Form.Item name={['user', 'website']} label="Website">
                <Input />
                </Form.Item>
                <Form.Item name={['user', 'introduction']} label="Introduction">
                <Input.TextArea />
                </Form.Item>
                <Form.Item label={null}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                </Form.Item>
            </Form>
        </div>
    </div>
  )
}

export default ApplicationPage
