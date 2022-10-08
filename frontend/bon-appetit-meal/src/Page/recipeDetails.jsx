import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, List, Layout, Table, Space,Form, Input, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import MenuBar from '../Components/navBar';
import HttpRequest from '../utils/Http'


export default function RecipeDetails () {
    const url = window.location.href;
    const urlList = url.split('?')
    const urlListParam = urlList[1].split('=')
    const recipeId = urlListParam[1]
    const [recipeDetails,setRecipeDetails] = useState({"ingredients":"","nutrition":""})

    const navigate = useNavigate();
    const {get,post} = HttpRequest()

    useEffect(() => {
        get(`/recipe/${recipeId}`)
        .then(res => {
            console.log(res)
            setRecipeDetails(res)
            // if (data) {
            //     console.log(data);
            //     setQuestion(data.question)
            // }
        })
    }, [])
    
    
    return (
        <Layout className='layout'>
            <MenuBar />
            {/* ,justifyContent: 'center',alignItems: 'center' */}
            <Button onClick={()=>{navigate('/')}} style={{textDecoration:'underline',backgroundColor:'gray',color:'white',fontSize:'20px',margin:' 20px 20px'}}>
            Back Home
            </Button>
            <div style={{display:'flex'}}>
                <div style={{margin:'20px 10px',display:'flex',flexDirection:'column',width:'60%'}}>
                    <p style={{margin:'20px 10px',color:'#FFA500',fontSize:'50px',fontWeight:'bold'}}>
                        {recipeDetails.recipe_name}
                    </p>
                    <p style={{margin:'20px 10px',color:'#FFA500',fontSize:'10px',fontWeight:'bold'}}>
                        Create At: {recipeDetails.created_at}
                    </p>
                
                
                </div>
                <div style={{margin:'20px 10px',display:'flex',flexDirection:'column',width:'40%'}}>
                    <p style={{margin:'20px 10px',color:'#FFA500',fontSize:'15px',fontWeight:'bold'}}>
                        create user name: {recipeDetails.user_id}
                    </p>
                    <p style={{margin:'20px 10px',color:'#FFA500',fontSize:'15px',fontWeight:'bold'}}>
                        type: {recipeDetails.food_type_name}
                    </p>
                    {/* {recipeDetails.ingredients */}
                    {/* // <p style={{margin:'20px 10px',color:'#FFA500',fontSize:'50px',fontWeight:'bold'}}>
                    // ingredients: {recipeDetails.ingredients}
                    // </p>} */}
                    <p style={{margin:'20px 10px',color:'#FFA500',fontSize:'15px',fontWeight:'bold'}}>
                                ingredients:
                    </p>
                    {<List
                        // grid={{ gutter: 8, column: 4 }}
                        dataSource={recipeDetails.ingredients.split(',')}
                        renderItem={item => (
                            <List.Item>
                            <div style={{color:'#FFA500',fontSize:'15px',fontWeight:'bold'}}>
                                {item}
                            </div>
                            </List.Item>
                        )}
                        />}
                    <p style={{color:'#FFA500',fontSize:'15px',fontWeight:'bold'}}>
                        nutrition:
                    </p>
                    {<List
                        // grid={{ gutter: 8, column: 4 }}
                        dataSource={recipeDetails.nutrition.split(',')}
                        renderItem={item => (
                            <List.Item>
                            <p style={{color:'#FFA500',fontSize:'15px',fontWeight:'bold'}}>
                                {item}
                            </p>
                            </List.Item>
                        )}
                        />}
                
                
                </div>
            </div>
            
        </Layout>
    )
}