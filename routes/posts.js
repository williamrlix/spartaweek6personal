const express = require('express');

const Comments = require('../schemas/comment');
const Posts = require('../schemas/post')

const router = express.Router();

router.get('/posts', async (req, res) => {
    const posts = await Posts.find({}, { postId: 1, title: 1, user: 1, createdAt: 1 }).sort({ createdAt: -1 })
    const result = posts.map(post => {
        return post
    })

    res.json({ data: result })
})

router.post('/posts', async (req, res) => {
    const { postId, user, title, password, content } = req.body
    const posts = await Posts.find({ postId })
    if (posts.length > 0) {
        return res.status(400).json({
            success: false,
            errorMessage: 'The post already exists'
        })
    }
    const createPost = await Posts.create({
        postId,
        user,
        title,
        password,
        content
    })
    return res.json({
        post: createPost
    })
})

router.get('/posts/:postId', async (req, res) => {
    const { postId } = req.params
    const post = await Posts.find({ postId: +postId }, { postId: 1, title: 1, content:1, user: 1, createdAt: 1 }).sort({ createdAt: -1 })

    if (post.length === 0) {
        return res.json({
            success: true,
            errorMessage: 'Data is empty'
        })
    }

    res.json({ data: post })
})

router.put('/posts/:postId', async(req, res) => {
    const { postId } = req.params
    const { title, password, content } = req.body
    const post = await Posts.findOne({ postId: +postId }, { postId: 1, title: 1, content:1, user: 1, createdAt: 1, password:1 })
    const passwordpost = post.password

    if (password !== passwordpost) {
        return res.json({
            errorMessage: "Auth failed"
        })
    }

    if (post) {
        await Posts.updateOne(
            {postId: +postId}, 
            {$set: {
                title: title, content:content
            }})
    }
    res.json({
        result: 'success',
        success: true,
    })
})

router.delete('/posts/:postId', async(req, res) => {
    const {postId} = req.params
    const {password} = req.body
    const post = await Posts.findOne({ postId: +postId }, { postId: 1, title: 1, content:1, user: 1, createdAt: 1, password:1 })
    
    if (!post) {
        return res.status(400).json({
            errorMessage: "Data not found"
        })
    } 

    if (password !== post.password) {
        return res.json({
            errorMessage: "Auth failed"
        })
    }

    if (post) {
        await Posts.deleteOne({postId: +postId})
        await Comments.deleteMany({postId: +postId})
    }
    res.json({
        result: 'success',
        success: true,
    })
})



module.exports = router