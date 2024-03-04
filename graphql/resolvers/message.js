const { User, Message } = require('../../models');
const { UserInputError, AuthenticationError } = require('apollo-server');
const { Op } = require('sequelize');

module.exports = {
    Query: {
        getMessage : async(parent,{to}, {username}) => {

            console.log(to, username);

        try{

            if(!username){ throw new AuthenticationError('Please Login')};

            const otherUser =await User.findOne({where: { username:to }});

            const usernames = [otherUser.username, username];

            const messages = await Message.findAll({
                where: {
                    from: { [Op.in]: usernames },
                    to : { [Op.in]: usernames}
                },

                order: [['createdAt', 'DESC']]
            });
            
            return messages;

        }catch(err){
            throw err
        }

        }

    },

    Mutation: {
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