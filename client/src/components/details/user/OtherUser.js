import React, { useState } from 'react';
import { Avatar, Typography, Box, Grid ,styled} from '@mui/material';
import {useContext } from 'react';
import { DataContext } from '../../../context/DataProvider';
import { Edit } from '@mui/icons-material';
import { Link} from 'react-router-dom';
import UserPosts from './Crousels';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { API } from '../../../service/api';


const EditIcon = styled(Edit)`
    margin: 5px;
    padding: 5px;
    border: 1px solid #878787;
    border-radius: 10px;
`; 

const OthersProfile = () => {

    const { account } = useContext(DataContext);
    const { id } = useParams();
  console.log("aja ajaaa",id); 
   
 //i have got user id here in id!!
 //use it to extract user details

 const [user, setData] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/users/${id}`);
        const responseData = await response.json();

        // Process the data if needed

        setData(responseData[0]);
      } catch (error) {
        console.error('An error occurred while fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box p={3}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Avatar  sx={{ width: 154, height: 174 }}  alt={user.name} src={user.picture} />
        </Grid>
        <Grid item>
          <Typography variant="h5" component="h1">
            {user.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            @{user.username}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {user.email}
          </Typography>
        </Grid>
      </Grid>

      <Box mt={2}>
        <Typography variant="body1">{user.bio}</Typography>
      </Box>

      {(account.id===user._id) && 
        <>
          <Link to='/Updateuser'><EditIcon color="primary" /></Link>
        </>
        
      }
      
      <h2>MY BLOGS</h2>
      <Grid container item lg={100} xs={120} sm = {1000} >
              < UserPosts  accountId={id}/>{/*userPosts mei kisi tarah user pass kara do aur crousel ke andar account.id*/}
              
            </Grid>

    </Box>

  )


}

export default OthersProfile;