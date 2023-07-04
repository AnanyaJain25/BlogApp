import { AppBar, Box, Toolbar,styled} from "@mui/material";
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import { Link} from 'react-router-dom'
import { useContext } from 'react';
import { DataContext } from '../../context/DataProvider';


const Component = styled(AppBar)`
   background : #ffffff;
   color:#000
`
const Container = styled(Toolbar)`
justify-content:center;
&>a{
    padding:20px;
    text-decoration : none;
    color : #000;
}
`
 


const Header = () =>{
    
   
    const { account } = useContext(DataContext);
    const url = account.picture;

    


    return(
        <Component>
            <Container>
               <Link to = '/'>HOME</Link>
               <Link to = '/about'>ABOUT</Link>
               <Link to = '/contact'>CONTACT</Link>
               <Link to = '/login'>LOGOUT</Link>
              <Link to = {`/view/${account.id}`} ><Avatar alt={account.name} src={url||"/static/images/avatar/1.jpg"} /></Link>

            </Container>
        </Component>
    )
}

export default Header;