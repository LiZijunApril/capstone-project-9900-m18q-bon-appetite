import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, List, Layout, Table, Space,Form, Input, message } from 'antd';
import MenuBar from '../Components/navBar';
import HttpRequest from '../utils/Http'

export default function Search () {
    const navigate = useNavigate();
    const {get} = HttpRequest()
    const [resultList,setResultList] = useState([])
    const { Meta } = Card;;

    const onFinish = (values) => {
        // console.log(values.ingredients.split(" "))
        // values.food_type_id = parseInt(values.food_type_id)
        // values.ingredients = `${values.ingredients.split(" ")}`
        // values.nutrition = `${values.nutrition.split(" ").map(Number)}`
        console.log(values)
        
        get('/recipes',values)
        .then((res) => {
            // if (res) {
                message.success("Search successful")
                setResultList(res)
                // navigate('/studentCoursePages')
            // }
        })
    };

    return (
        <Layout className='layout'>
            <MenuBar />
            <Button onClick={()=>{navigate('/')}} style={{textDecoration:'underline',backgroundColor:'gray',color:'white',fontSize:'20px',margin:' 20px 20px'}}>
            Back Home
            </Button>
            <div style={{margin:'20px 10px',display:'flex',flexDirection:'column',justifyContent: 'center',alignItems: 'center',height:'60vh'}}>
            <p style={{margin:'20px 10px',color:'#FFA500',fontSize:'50px',fontWeight:'bold'}}>Search receipes</p>
                <Form
                    // labelCol={{
                    //     span: 10,
                    // }}
                    // wrapperCol={{
                    //     span: 40,
                    // }}
                    layout="horizontal"
                    onFinish={onFinish}
                    >
                    <Form.Item
                        name="keywords"
                        rules={[{ required: true, message: 'Please input your recipe name!' }]}
                    >
                        <Input placeholder="recipe name"/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{color:'white',backgroundColor:'#2EB394',marginTop:'20px',borderRadius:'10px'}}>
                            Search
                        </Button>
                    </Form.Item>
                </Form>
                <div style={{  margin:'10px 20px'}}>
                        {<List
                        grid={{ gutter: 8, column: 4 }}
                        dataSource={resultList}
                        renderItem={item => (
                            <List.Item>
                            <Card
                                hoverable
                                style={{ width: '70%' }}
                                cover={
                                <img onClick={()=>{ navigate(`/recipeDetails?recipeId=${item.recipe_id}`)}}
                                    src={ item.recipe_img }
                                />
                                }
                            >
                                <Meta
                                title={ <div onClick={()=>{ navigate('/')}}>{item.recipe_name}</div> }
                                // description={item.courseDesc}
                                />
                            </Card>
                            </List.Item>
                        )}
                        />}
                    </div>
            </div>
        </Layout>
    )
}