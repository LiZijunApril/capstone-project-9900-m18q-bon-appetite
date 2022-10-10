import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select, List, Layout, Table, Upload,Form, Input, message, Modal, Empty } from 'antd';
import { PlusOutlined,UploadOutlined } from '@ant-design/icons';
import MenuBar from '../Components/navBar';
import HttpRequest from '../utils/Http'


export default function CreateNewRecipes () {
    var step = 0;
    const { TextArea } = Input;
    const { Option } = Select;

    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [stepDetails, setStepDetails] = useState([]);
    const [details, setDetails] = useState([]);
    const [fileList, setFileList] = useState([]);
    const [photoList, setPhotoList] = useState([]);
    const [photo, setPhoto] = useState([]);
    const [curStepDetails, setCurStepDetails] = useState({});
    const {post} = HttpRequest()
    const saveDetailsWord = (e) => {
        // setStepDetails(e.target.value)
        setDetails(e.target.value)
        setCurStepDetails({
            ...curStepDetails,
            describe:e.target.value,
        })
    }
    const showModal = () => {
        setIsModalOpen(true);
      };
      const handleOk = () => {
        let newDetials = []
        newDetials = [...stepDetails]
        newDetials.push(curStepDetails)
        setStepDetails(newDetials)

        setFileList([])
        setDetails()
        setCurStepDetails({})

        setIsModalOpen(false);
        
      };
    const handleCancel = () => {
        setFileList([])
        setDetails()
        setCurStepDetails({})
        setIsModalOpen(false);
    };
    const onFinish = (values) => {
        console.log(values.ingredients.split(" "))
        const postValues = {}
        postValues.food_type_id = parseInt(values.food_type_id)
        postValues.ingredients = `${values.ingredients.split(" ")}`
        postValues.nutrition = `${values.nutrition.split(" ").map(Number)}`
        postValues.recipe_img = photo
        postValues.recipe_name = values.recipe_name
        console.log(postValues)
        
        post('/recipe',postValues)
        .then((res) => {
            console.log(res)
            if (res) {
                message.success("Create new recipe successful")
                setTimeout(()=>{navigate(`/recipeDetails?recipeId=${res.recipe_id}`)})
            }
        })
    };
    const handleUpload = ({file}) => {
        console.log(file)
        var image_reader = new FileReader();
        image_reader.readAsDataURL(file)
        // setTimeout(()=>{console.log(image_reader.result)},1000)
        image_reader.onload = function () {
            console.log(image_reader.result)
            setFileList([{ url: image_reader.result, name: file.name, thumbUrl: image_reader.result}])
            setCurStepDetails({
                ...curStepDetails,
                imageFile:image_reader.result,
            })
        }
    };
    const handleUploadPhoto = ({file}) => {
        console.log(file)
        var image_reader = new FileReader();
        image_reader.readAsDataURL(file)
        // setTimeout(()=>{console.log(image_reader.result)},1000)
        image_reader.onload = function () {
            console.log(image_reader.result)
            setPhotoList([{ url: image_reader.result, name: file.name, thumbUrl: image_reader.result}])
            setPhoto(image_reader.result)
        }
    };

    // useEffect(() => {
    //     post('/recipes',{"limit":10})
    //     .then((res)=> {
    //         console.log("recipes list",res)

            // setCourseList(res.courselist)
            // setcourseId(res.courselist[0].courseId)
        // })
        // get('/teacher/queryWillMeetingList')
        // .then((res)=> {
        //     console.log('upcoming is ', res)
        //     setUpcomingList(res.meetingList.slice(0,3))
        // })
    // }, [])
    
    return (
        <Layout className='layout'>
            <MenuBar />
            <Button shape='round' onClick={()=>{navigate('/')}} style={{backgroundColor:'gray',color:'white',fontSize:'20px',width:'10%',margin:' 20px 20px'}}>
                Back
            </Button>
            <div style={{margin:'20px 10px',display:'flex',flexDirection:'column',justifyContent: 'center',alignItems: 'center'}}>
                <Form
                    labelCol={{
                        span: 10,
                    }}
                    wrapperCol={{
                        span: 40,
                    }}
                    layout="horizontal"
                    onFinish={onFinish}
                    >
                    
                    <Form.Item
                        name="recipe_name"
                        label="recipe name"
                        rules={[{ required: true, message: 'Please input your recipe name!' }]}
                    >
                        <Input placeholder="recipe name"/>
                    </Form.Item>
                    <Form.Item
                        name="food_type_id"
                        label="meal type"
                        rules={[{ required: true, message: 'Please input your food type id!' }]}
                    >
                        <Select
                            initialvalues="1"
                            style={{
                                width: 200,
                            }}
                            // onChange={handleChange}
                            >
                            <Option value="1">Healthy</Option>
                            <Option value="2">Veg</Option>
                            <Option value="3">Non-veg</Option>
                            <Option value="4">Veg dessert</Option>
                            <Option value="5">Non-Veg dessert</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="ingredients"
                        label="ingredients"
                        rules={[{ required: true, message: 'Please input your ingredients!' }]}
                    >
                        <Input placeholder="recipe name"/>
                    </Form.Item>
                    <Form.Item
                        name="nutrition"
                        label="nutrition"
                        rules={[{ required: true, message: 'Please input your food type id!' }]}
                    >
                        <Input
                        placeholder="nutrition"
                        />
                    </Form.Item>

                    <Form.Item 
                    name="Upload" 
                        label="Upload" 
                        // valuePropName="fileList" 
                        rules={[{ required: true, message: 'Please upload your photo!' }]}
                    >
                        <Upload
                            customRequest={handleUploadPhoto}
                            fileList={photoList}
                            >
                                <Button icon={<UploadOutlined />}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                    {<List
                        locale={{emptyText:' '}}
                        // grid={{ gutter: 8, column: 4 }}
                        dataSource={stepDetails}
                        renderItem={(item,index) => (
                            <List.Item>
                                <div style={{display:'flex',flexDirection:'column'}}>
                                    <p>step:{index+1}</p>
                                    <p style={{color:'#FFA500',fontSize:'15px',fontWeight:'bold'}}>
                                        {item.describe}
                                    </p>
                                    {
                                        item.hasOwnProperty("imageFile") ? <img src={`${item.imageFile}`}/> : <></>
                                    }
                                </div>
                            </List.Item>
                            
                        )}
                        />}
            <Button type="primary" onClick={showModal}>
                Add Step
            </Button>
            <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{color:'white',backgroundColor:'#2EB394',marginTop:'20px',borderRadius:'10px'}}>
                            Confirm
                        </Button>
                    </Form.Item>
                    
                </Form>
            </div>
            
            <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Add Describe:</p>
                <TextArea value={details} onChange={saveDetailsWord} rows={4} />
                <p>Upload photo:</p>
                <Upload
                customRequest={handleUpload}
                fileList={fileList}
                >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
            </Modal>
        </Layout>
    )
}