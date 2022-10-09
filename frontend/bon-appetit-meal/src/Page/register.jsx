import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message,Select, InputNumber } from 'antd';

import HttpRequest from '../utils/Http'


export default function Register () {
    const {post} = HttpRequest()
    const { Option } = Select;
    const navigate = useNavigate();
    const onFinish = (values) => {
        console.log(values)
        post('/register',values)
        .then((res) => {
            console.log(res.msg)
            if (res) {
                console.log(res)
                // saveToken(res.token)
                // saveUser(res.stuent)
                // navigate('/studentCoursePages')
            }
        })
    };
    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select
                style={{
                    width: 70,
                }}
        >
            <Option value="86">+86</Option>
            <Option value="87">+61</Option>
            </Select>
        </Form.Item>
        );
    return (
        <div  className='center' style={{height:'100vh',background:'rgba(192,192,192,0.8)'}}>
            
            <Button onClick={()=>{navigate('/')}} style={{textDecoration:'underline',backgroundColor:'gray',color:'white',fontSize:'20px',margin:'20px'}}>
                    Back Home
            </Button>
            <div style={{margin:'20px 10px',display:'flex',flexDirection:'column',justifyContent: 'center',alignItems: 'center',height:'60vh'}}>
            <p style={{margin:'20px 10px',color:'#FFA500',fontSize:'50px',fontWeight:'bold'}}>Please Register</p>
                <Form
                labelCol={{
                    span: 10,
                }}
                wrapperCol={{
                    span: 40,
                }}
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                    >
                    <Form.Item
                        name="display_name"
                        label="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="user name"/>
                    </Form.Item>
                    <Form.Item
                        name="nick_name"
                        label="nickname"
                        rules={[{ required: true, message: 'Please input your nickname!' }]}
                    >
                        <Input placeholder="nick name" maxLength="25"/>
                    </Form.Item>
                    <Form.Item
                        name="email_address"
                        label="email"
                        rules={[{ required: true, message: 'Please input your email address!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                            var pwdRegex = new RegExp('^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$');
                            console.log(pwdRegex.test(value))
                            if (!value || pwdRegex.test(value)) {
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error("Please Input the correct email address"));
                            },
                            }),]}
                            hasFeedback
                    >
                        <Input placeholder="email address"/>
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="phone number"
                        rules={[{ required: true, message: 'Please input your phone number!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                            var pwdRegex = new RegExp('^[0-9]{9,11}$');
                            console.log(pwdRegex.test(value))
                            if (!value || pwdRegex.test(value)) {
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error("Please Input the correct phone number"));
                            },
                            }),]}
                            hasFeedback
                    >
                        <Input
                            addonBefore={prefixSelector}
                            style={{
                                width: '100%',
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label='password'
                        dependencies={['password']}
                        rules={[{ required: true, message: 'Please input your Password!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                            var pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}');
                            console.log(pwdRegex.test(value))
                            if (!value || pwdRegex.test(value)) {
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error("The password must contain at least one character from each of the following groups: \n 1. lower case alphabet 2 upper case alphabet 3 Numeric 4 special characters (!, @, #, $, %, ^, &, *)"));
                            },
                            }),
                        ]}
                        hasFeedback
                    >
                        {/* <Input
                        type="password"
                        placeholder="Password"
                        /> */}
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }

                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                            },
                        }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{color:'white',backgroundColor:'#2EB394',marginTop:'20px',borderRadius:'10px'}}>
                            Register
                        </Button>
                        <a onClick={()=>{navigate('/login')}} style={{textDecoration:'underline',color:'white',fontSize:'20px',marginLeft:'20px',marginTop:'20px'}}>
                    Login
                </a>
                </Form.Item>
                </Form>
                
            </div>
        </div>
        
    )
}