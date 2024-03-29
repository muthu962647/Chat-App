const { gql } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { JWT_SECRET } = require('../config/env.json');
const { User, Message } = require('../models');
const { UserInputError, AuthenticationError } = require('apollo-server')



module.exports = {

    Query: {
    
        getUsers: async(_,args,context)=> {

            try{

                if(!context.username){ throw new AuthenticationError('Please Login')}

                const users = await User.findAll({
                        where: {username:{[Op.ne]: context.username }}
                    });

                return users;
                
            }catch(err){
                console.log(err);
                throw err;
            }
        },

        login: async (_,args) =>{

            console.log("Inside ra mapla");

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

        },

        check: async(parent,args,context,info) => {
            console.log(args.name);
            return {
                name: args.name
            };
        },

        sendMessage: async (parent,args,{ username },info) => {


            try{
                const { to, content } = args;

                console.log(username, to, content);

                if(!username){ throw new AuthenticationError('Please Login')}

                const recepient = await User.findOne({where: { username:to }})

                if(!recepient){
                    throw new AuthenticationError('Receipent User not Found');
                }else if(username === recepient.username){
                    throw new UserInputError('You cant message to Yourself');
                }

                if(content.trim() == ''){ throw new UserInputError('Message is Empty')};

                const message = await Message.create({
                    from: username,
                    to,
                    content
                });

                return message;

            }catch(err){
                throw err
            }

            
        }

    }

}