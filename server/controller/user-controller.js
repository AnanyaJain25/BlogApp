import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from '../model/token.js'
import User from '../model/user.js';
import Post from '../model/post.js';
import e from 'express';


dotenv.config();

export const singupUser = async (request, response) => {
    try {
        // const salt = await bcrypt.genSalt();  
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        const user = { username: request.body.username, name: request.body.name, password: hashedPassword }
        //validated input is stored in newUser
        const newUser = new User(user);
        //save-newUser is saved in database
        await newUser.save();

        return response.status(200).json({ msg: 'Signup successfull' });
    } catch (error) {
        return response.status(500).json({ msg: 'Error while signing up user' });
    }
}



export const loginUser = async (request, response) => {
    let user = await User.findOne({ username: request.body.username });
    if (!user) {
        return response.status(400).json({ msg: 'Username does not match' });
    }

    try {
        let match = await bcrypt.compare(request.body.password, user.password);
        if (match) {
            const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_SECRET_KEY, { expiresIn: '15m'});
            const refreshToken = jwt.sign(user.toJSON(), process.env.REFRESH_SECRET_KEY);
            
            const newToken = new Token({ token: refreshToken });
            await newToken.save();
        
          response.status(200).json({ accessToken: accessToken, refreshToken: refreshToken,name: user.name, username: user.username , id: user._id , email:user.email , picture:user.picture, bio:user.bio} );
        //
        } else {
            response.status(400).json({ msg: 'Password does not match' })
        }
    } catch (error) {
        response.status(500).json({ msg: 'error while login the user' })
    }
}

export const logoutUser = async (request, response) => {
    const token = request.body.token;
    await Token.deleteOne({ token: token });

    response.status(204).json({ msg: 'logout successfull' });
}  



export const getUserById = async (request, response) => {
    try {
        const user = await User.find({_id:request.params.id});
        response.status(200).json(user);
    } catch (error) {
        response.status(500).json(error)
    }
}
export const updateprofile = async (request, response) => {
    try {

        const user = { username: request.body.username, name: request.body.name, email: request.body.email,picture: request.body.picture, bio:request.body.bio}
        //validated input is stored in newUser
        
        const usertoUpdate = await User.findById(request.params.id);
        const filter = { username: usertoUpdate.username  }; 
        const update = { $set: { username:user.username } };
        await Post.updateMany(filter, update);

        usertoUpdate.username = user.username ;
        usertoUpdate.name =user.name;
        usertoUpdate.email = user.email;
        usertoUpdate.picture = user.picture;
        usertoUpdate.bio = user.bio; 
        await usertoUpdate.save();
        console.log(usertoUpdate);

        return response.status(200).json({ msg: 'update successfull' });
    } catch (error) {
        console.log(error);
        return response.status(500).json({ msg: 'Error while updating user' });
    }
}

