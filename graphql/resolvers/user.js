const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { JWT_SECRET } = require('../../config/env.json');
const { User, Message } = require('../../models');
const { UserInputError, AuthenticationError } = require('apollo-server');
const user = require('../../models/user');

module.exports = {
    Query: {

        getUsers: async(_,args,{ username })=> {

            try{

                if(!username){ throw new AuthenticationError('Please Login')}

                let users = await User.findAll({
                        attributes: ['username', 'imageUrl', 'createdAt'],
                        where: {username:{[Op.ne]: username }}
                    });


                    const allUserMessages = await Message.findAll({
                        where: {
                          [Op.or]: [{ from: username }, { to: username }],
                        },
                        order: [['createdAt', 'DESC']],
                      });

                console.log(allUserMessages);


                users = users.map(otherUser => {
                    const latestMessage = allUserMessages.find((m) =>{
                        console.log("indivual value look like", m);
                        return  m.dataValues.from === otherUser.username || m.dataValues.to === otherUser.username
                    })

                    otherUser.latestMessage = latestMessage
                    return otherUser;
                })

               

                return users;
                
            }catch(err){
                console.log(err);
                throw err;
            }
        },

        login: async (_,args) =>{

                const {username, password} = args.input;

                let errors = {};

            try {

                if(username.trim() == '')errors.username = 'Username must not be Empty';
                if(password.trim() == '')errors.password = "Password must not be Empty";

                const user = await User.findOne({ where: { username} });


                if(!user){
                    throw new UserInputError('User not Found', { errors })
                }


                const hashedPassword  = user.dataValues.password;

               
                const samePassword = await bcrypt.compare( password,hashedPassword);

                if(!samePassword){
                    errors.password = "Password is Incorrect"
                    throw new AuthenticationError('Password is Incorrect', {errors})
                }

                const token = jwt.sign({username}, JWT_SECRET, {
                    expiresIn: '10h'
                })

                return {
                    username: user.dataValues.username,
                    email: user.dataValues.email,
                    token,
                    createdAt: user.dataValues.createdAt.toISOString()
                }

            }catch(err){
                throw err
            }
        }
    },

    Mutation: {

        register: async (parent,args,context,info) => {

            const { username, email, password, confirmPassword} = args.input;

            console.log({ username, email, password, confirmPassword});

            const hashedPassword = await bcrypt.hash(password, 6);
            
            let errors = {}

            try{

                if(username.trim() == '')errors.username = 'Username must not be Empty';
                if(email.trim() == '')errors.email = 'Email must not be Empty';
                if(password.trim() == '')errors.password = "Password must not be Empty";
                if(confirmPassword.trim() == '')errors.confirmPassword = "Confirm Password must not be Empty";

                const existingUsername = await User.findOne({ where : { username } })
                const existingEmail = await User.findOne({ where: {email}})

                if(existingUsername) errors.username = 'Username is taken'
                if(existingEmail) errors.email = 'Email is taken'

                if(Object.keys(errors).length > 0) {
                    throw errors   
                }

                const user = await User.create({
                    username,email,password:hashedPassword
                });

                return user

            }catch(err){

                console.log(err);
                throw new UserInputError("Bad Input",err)
            }

        }


    }
}