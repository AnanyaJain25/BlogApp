import { useState, useEffect, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import { Box, Button, Typography, styled , Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom'

import { API } from '../../service/api';

import { DataContext } from '../../context/DataProvider';

// components
import Comments from './comments/Comments';

const Keywords = styled(Button)`
margin: 11px ;

`

const Container = styled(Box)(({ theme }) => ({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: 0
    },
}));

const Image = styled('img')({
    width: '100%',
    height: '50vh',
    objectFit: 'cover'
});

const EditIcon = styled(Edit)`
    margin: 5px;
    padding: 5px;
    border: 1px solid #878787;
    border-radius: 10px;
`;

const DeleteIcon = styled(Delete)`
    margin: 5px;
    padding: 5px;
    border: 1px solid #878787;
    border-radius: 10px;
`;

const Heading = styled(Typography)`
    font-size: 38px;
    font-weight: 600;
    text-align: center;
    margin: 50px 0 10px 0;
`;

const Author = styled(Box)(({ theme }) => ({
    color: '#878787',
    display: 'flex',
    margin: '20px 0',
    [theme.breakpoints.down('sm')]: {
        display: 'block'
    },
}));

const Description = styled(Typography)`
word-break : break-word;
`

const DetailView = () => {

    const url = 'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';
    
  
   
    const { account } = useContext(DataContext);

    const navigate = useNavigate();
    

     const [keywordss,setKeywords]=useState('');
     const [isOpen,setIsOpen]=useState(false);
     const [loading,setLoading]=useState(false);

     const { id } = useParams();
     const [post, setPost] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            let response = await API.getPostById(id);
            if (response.isSuccess) {
                setPost(response.data);
            }
        }
        fetchData();
    }, []);

    console.log("look here",post.user_id);

    
    
    const deleteBlog = async () => {  
        let response  = await API.deletePost(post._id);
        if(response.isSuccess){
        navigate('/')}
    
    }
    
    const extractKeywords = async(text) =>{
        setLoading(true);
        setIsOpen(true);

        const options = {
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                Authorization:`Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
            },
            body:JSON.stringify({
                model:'text-davinci-003',
                prompt:'Extract 50 keywords from the text and show them with a space and comma in between\n\n' + text + '',
                temperature: 0.5,
                max_tokens:60,
                frequency_penalty:0.8

            })
        }
        console.log(text);

        fetch(process.env.REACT_APP_OPENAI_API_URL,options).then(async(res) => {
            console.log(res);
            const json = await res.json();
            console.log(json)

            const data = json.choices[0].text.trim();
            console.log(data);
            setKeywords(data);
            setLoading(false);
         }).catch(err => console.log(err))


        
    };

    const url2="";

 
    const submitText =()=>{
        extractKeywords(post.description) ;
    }


    return (
        <Container>
            <Image src={post.picture || url} alt="post" />
            <Box style={{ float: 'right' }}>
                {   
                    account.username === post.username && 
                    <>  
                        <Link to={`/update/${post._id}`}><EditIcon color="primary" /></Link>
                        <DeleteIcon onClick={() =>deleteBlog()} color="error" />
                    </>
                }
            </Box>
            <Heading>{post.title}</Heading>

            {/* here change post.username to creater.username where creater is the user fetched by post.userid */}

            <Author>
                <Link to={`/?username=${post.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography>Author: <span style={{fontWeight: 600}}>{post.username}</span></Typography>
                </Link>

                <Link to = {`/view/${post.user_id}`} ><Avatar alt={post.name} sx={{ width: 24, height: 24 }} src={url2 || "/static/images/avatar/1.jpg"} /></Link>
 
                <Typography style={{marginLeft: 'auto'}}>{new Date(post.createdDate).toDateString()}</Typography>
            </Author>
    
            <Description>{post.description}</Description>

            <Keywords 
            variant="contained"
             color="primary"
            onClick={submitText}>Fetch Keywords</Keywords>
            <Dialog open={isOpen} onClose={()=>setIsOpen(false)} >
                <DialogTitle>Keywords</DialogTitle>
                <DialogContent>
                    {loading ? (
                        <CircularProgress/>
                    ):(
                    <DialogContentText>
                      {keywordss}
                    </DialogContentText>
                    )
                    }
                    
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>setIsOpen(false)}>Okay</Button>
                </DialogActions>

            </Dialog>
            
            <Comments post = {post}/>
           
        </Container >
    )
}

export default DetailView;