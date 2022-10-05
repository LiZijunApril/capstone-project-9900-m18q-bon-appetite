import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';

import HttpRequest from '../utils/Http'


export default function Register () {
    const {post} = HttpRequest()

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
    return (
        <div  className='center' style={{height:'100vh'}}>
            
            <p style={{margin:'20px 10px',color:'#FFA500',fontSize:'50px',fontWeight:'bold'}}>Please Register</p>
            <div style={{margin:'20px 10px',display:'flex',flexDirection:'column',justifyContent: 'center',alignItems: 'center',width:'50%',height:'60vh',background:'rgba(192,192,192,0.8)'}}>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                    >
                    <Form.Item
                        name="display_name"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="zId"/>
                    </Form.Item>
                    <Form.Item
                        name="email_address"
                        rules={[{ required: true, message: 'Please input your email_address!' }]}
                    >
                        <Input placeholder="zId"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                        type="password"
                        placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{color:'white',backgroundColor:'#2EB394',marginTop:'20px',borderRadius:'10px'}}>
                            Register
                        </Button>
                    </Form.Item>
                </Form>
                <a onClick={()=>{navigate('/')}} style={{textDecoration:'underline',color:'white',fontSize:'20px',marginLeft:'140px',marginTop:'20px'}}>
                    Go Back
                </a>
            </div>
        </div>
        
    )
}