const Post = require('../../models/Post')
const checkAuth = require("../../Utilities/check-auth")

const { UserInputError } = require('apollo-server')

module.exports = {
    Mutation: {
        createComment: async (_, { postId, body }, context) => {
            const { username } = checkAuth(context);
            if (body.trim() === '') {
                throw new UserInputError('Empty Comment', { 
                    errors: {
                        body: 'Comment must not be empty'
                    }
                })
            }
            
            const post = await Post.findById(postId)

            if(post){
                post.comments.unshift({
                    body, 
                    username,
                    createdAt: new Date().toISOString()
                })
                await post.save()
                return post
            } else throw new UserInputError('Post not found')
        }
    }
}