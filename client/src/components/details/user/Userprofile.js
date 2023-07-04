import React, { useState, useEffect, useContext } from 'react';

import { styled, Box, TextareaAutosize, Button, InputBase, FormControl  } from '@mui/material';
import { AddCircle as Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { API } from '../../../service/api';

import { DataContext } from '../../../context/DataProvider';

const Container = styled(Box)(({ theme }) => ({
    margin: '50px 100px',
    [theme.breakpoints.down('md')]: {
        margin: 0
    }
}));

const Image = styled('img')({
    width: '40%',
    height: '40vh',
    objectFit: 'cover',
});

const StyledFormControl = styled(FormControl)`
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content:center;
`;


const InputTextField = styled(InputBase)`
    flex: 1;
    margin: 0 30px;
    font-size: 25px;
`;

const Textarea = styled(TextareaAutosize)`
    width: 100%;
    border: none;
    
    font-size: 18px;
    &:focus-visible {
        outline: none;
    }
`;





const Userprofile = () =>{
    const navigate = useNavigate();
    
    const { account, setAccount } = useContext(DataContext);


    const initialProfile = {
        _id:account.id,
        name: account.name,
        username:account.username,
        email:account.email,
        picture:account.picture,
        bio:account.bio
    
    }


    

    const[profile,setProfile]=useState(initialProfile);
    const[file,setFile]=useState('');
    useEffect(() => {
        const getImage = async () => { 
            if(file) {
                const data = new FormData();
                data.append("name", file.name);
                data.append("file", file);
                //API CALL
                const response = await API.uploadFile(data);
                profile.picture = response.data; //pic stored

                
            }
        }
        getImage();
    }, [file])

    

    const handleChange = (e) => {
        console.log({[e.target.name]: e.target.value});
        setProfile({ ...profile, [e.target.name]: e.target.value });
        console.log(profile);

    }

    const saveProfile = async () => {
        console.log(account);

        console.log("profile just before api call",profile);
        await API.updateProfile(profile).then((res) => {
            if(res.isSuccess){
                setAccount({...profile, accessToken: account.accessToken, refreshToken: account.refreshToken, id: account.id});
                console.log(account);
                console.log(profile);
                navigate( `/view/${account.id}`)
            }

        }).catch(e => console.log(e)); 
    }
    const url = profile.picture ? profile.picture :'https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80';
    return (
        <Container>
           <Box  sx={{ display: 'flex', justifyContent: 'center'}}><Image src={url} alt="profile" /></Box> 

            <StyledFormControl>
                <label htmlFor="fileInput">
                    <Add fontSize="large" color="action" />
                </label>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: "none" }}
                    onChange={(e) => setFile(e.target.files[0])}
                />
           
            </StyledFormControl>
             NAME:
            <Textarea
                rowsMin={5}
                placeholder="Tell your story..."
                name='name'
                value={profile.name}
                onChange={(e) => handleChange(e)} 
            />
             USERNAME:
             <Textarea
                rowsMin={5}
                placeholder="Tell your story..."
                name='username'
                value= {profile.username}
                onChange={(e) => handleChange(e)} 
            />
             EMAIL:
             <Textarea
                rowsMin={5}
                placeholder="Enter email"
                name='email'
                value={profile.email}
                onChange={(e) => handleChange(e)} 
            />
            Bio:
             <Textarea
                rowsMin={5}
                placeholder="Enter bio"
                name='bio'
                value={profile.bio}
                onChange={(e) => handleChange(e)} 
            />
             <Button onClick={() => saveProfile(account.username)} variant="contained" color="primary">Save</Button>
        </Container>
    )
}
export default Userprofile;