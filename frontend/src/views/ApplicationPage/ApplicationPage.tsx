"use client";

import * as ApplicationService from "@/services/ApplicationService";
import * as PostService from "@/services/PostService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, message } from "antd";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import style from "./ApplicationPage.module.css";

interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
}

interface User {
  email: string;
}

interface Tutor {
  name: string;
  phone: string;
  user: User;
}

interface PostItem {
  subject: string;
  Class: string;
  method: string;
  postname: string;
  address: string;
  price: number;
  description: string;
  tutor?: Tutor;
  schedules: Schedule[];
}

interface Application {
  name: string;
  email: string;
  class: string;
  phone: string;
  introduction: string;
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const ApplicationPage = () => {
  const [infoForm] = Form.useForm();
  const [currentForm] = Form.useForm();
  const params = useParams();
  const postId = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: post, isPending } = useQuery<PostItem>({
    queryKey: ["postId", postId],
    queryFn: () => PostService.getPost(postId!).then((res) => res.data),
    enabled: !!postId,
  });

  const uploadApplicationMutation = useMutation({
    mutationFn: (values: Application) => {
      return ApplicationService.createApplication({
        postId: postId!,
        name: values.name,
        email: values.email,
        className: values.class,
        phone: values.phone,
        note: values.introduction,
      });
    },
    onSuccess: () => {
      message.success("Đăng ký thành công!");
      currentForm.resetFields();
    },
  });

  useEffect(() => {
    if (post) {
      infoForm.setFieldsValue({
        user: {
          name: post.postname,
          subject: post.subject,
          class: post.Class,
          format: post.method,
          address: post.address,
          price: post.price,
          introduction: post.description,
        },
      });
    }
  }, [post, infoForm]);

  const tutor: Tutor | undefined = post?.tutor;
  useEffect(() => {
    if (tutor) {
      infoForm.setFieldsValue({ name: tutor.name, email: tutor.user.email });
    }
  }, [tutor, infoForm]);

  const onFinish = (values: Application) => {
    uploadApplicationMutation.mutate(values);
    console.log(values);
  };

  return (
    <div className={style.main}>
      <div className={style.twodiv}>
        <h1 className="flex font-bold text-2xl justify-start mb-5">
          Thông tin gia sư + buổi học
        </h1>
        <Form
          form={infoForm}
          {...layout}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
          className="flex flex-col"
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input readOnly />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
            <Input readOnly />
          </Form.Item>
          <Form.Item name={["user", "subject"]} label="Subject">
            <Input readOnly />
          </Form.Item>
          <Form.Item name={["user", "format"]} label="Format">
            <Input readOnly />
          </Form.Item>
          <Form.Item name={["user", "address"]} label="Address/Details">
            <Input readOnly />
          </Form.Item>
          <Form.Item name={["user", "price"]} label="Price">
            <InputNumber readOnly addonAfter="VND" />
          </Form.Item>
          <Form.Item name={["user", "introduction"]} label="Introduction">
            <Input.TextArea readOnly />
          </Form.Item>
        </Form>
        <h1 className="flex font-bold text-2xl justify-start mb-5">
          Thông tin đăng kí
        </h1>
        <Form
          form={currentForm}
          {...layout}
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ type: "email" }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please input your phone!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="class" label="Class">
            <Input />
          </Form.Item>
          <Form.Item name="introduction" label="Introduction">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label={null}>
            <Button
              htmlType="button"
              onClick={() => currentForm.resetFields()}
              style={{ marginRight: 8 }}
            >
              Reset
            </Button>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ApplicationPage;
