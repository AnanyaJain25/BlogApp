import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../../../context/DataProvider';
import { Grid, Box } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';

//import { getAllPosts } from '../../../service/api';
import { API } from '../../../service/api';

//components
import Post from '../../home/post/post';


const UserPosts = ({ accountId }) => {

    console.log(accountId);
    const [posts, getPosts] = useState([]);
    const [searchParams] = useSearchParams();
   
    const category = searchParams.get('category');


    useEffect(() => {
        const fetchData = async () => { 
            let response = await API.getAllPosts({ category : category || '' });
            if (response.isSuccess) {
                var sample = [];
                console.log("here",response.data[0].user_id);
                console.log("here here",response.data[0].user_id===accountId);
                 for(var i = 0 ; i<response.data.length ;i++){
                    if(response.data[i].user_id===accountId){
                        sample.push(response.data[i]);
                    }

                 }
                getPosts(sample);
            }
        }
        fetchData();
    }, [category,accountId]);
// passing as props which means it can be use like a function in different function i.e- <Post post={post} />
    return (
        <>
            
            {
                posts?.length ? posts.map(post => (
                    <Grid item lg={3} sm={4} xs={12}>
                        <Link style={{textDecoration: 'none', color: 'inherit'}} to={`http://localhost:3000/details/${post._id}`}>
                       
                            <Post post={post} />
                        </Link>
                    </Grid>
                )) : <Box style={{color: '878787', margin: '30px 80px', fontSize: 18}}>
                        No data is available for selected category
                    </Box>
            }
        </>
    )
}

export default UserPosts;