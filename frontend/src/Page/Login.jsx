import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, message } from 'antd';

import HttpRequest from '../utils/Http'
import { saveToken } from '../utils/TokenUtils';
import User from '../utils/User';


export default function Login () {
    const {post,get} = HttpRequest()
    const { saveUser } = User();
    var a = 0;
    const t = setTimeout(function(){navigate('/')},300000)
    const navigate = useNavigate();
    const onFinish = (values) => {
        console.log(values)
        
        post('/login',values)
        .then((res) => {
            console.log(res)
            if (res) {
                a = 0;
                console.log(res)
                saveToken(res.token)
                clearTimeout(t);
                get('/currentuser')
                .then((res)=>{
                    if(res){
                        console.log(res)
                        saveUser(res.user_id)
                        message.success("login sucessful")
                        setTimeout(function(){navigate('/')},500)
                    }
                })
                
            }
        })
    };
    return (
        <div  className='center' style={{height:'100vh',background:'rgba(192,192,192,0.8)'}}>
            <Button onClick={()=>{navigate('/')}} style={{textDecoration:'underline',backgroundColor:'gray',color:'white',fontSize:'20px',margin:' 20px 20px'}}>
            Back Home
            </Button>
            <div style={{margin:'20px 10px',display:'flex',flexDirection:'column',justifyContent: 'center',alignItems: 'center',height:'60vh'}}>
            <p style={{margin:'20px 10px',color:'#FFA500',fontSize:'50px',fontWeight:'bold'}}>Please log in</p>
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
                        name="email_address"
                        label="email address"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input placeholder="username"/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                        type="password"
                        placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{color:'white',backgroundColor:'#2EB394',marginTop:'20px',borderRadius:'10px'}}>
                            Log in
                        </Button>
                        <a onClick={()=>{navigate('/register')}} style={{textDecoration:'underline',color:'white',fontSize:'20px',marginLeft:'20px',marginTop:'20px'}}>
                            Register
                        </a>
                    </Form.Item>
                </Form>
                
            </div>
        </div>
        
    )
}