const express = require('express')

const Comments = require('../schemas/comment')
const Posts = require('../schemas/post')

const router = express.Router()

router.get('/comments', async (req, res) => {
    const comments = await Comments.find({}, { postId: 1, user: 1, comment: 1 }).sort({ createdAt: -1 })
    const postId = comments.map(comment => comment.postId)
    const posts = await Posts.find({ postId: postId })
    const result = posts.map(post => {
        return {
            postId: post.postId,
            comments: comments.filter(comment => comment.postId === post.postId)
        }
    })
    res.json({
        data: result
    })
})

router.get('/comments/:postId', async (req, res) => {
    const comments = await Comments.find({}, { postId: 1, user: 1, comment: 1 }).sort({ createdAt: -1 })
    const { postId } = req.params
    const posts = await Posts.find({ postId: postId })
    const result = posts.map(post => {
        return {
            comments: comments.filter(comment => comment.postId === post.postId)
        }
    })
    res.json({
        data: result
    })
})

router.post('/comments/:postId', async (req, res) => {
    const { postId } = req.params
    const { user, password, comment } = req.body

    if (!comment) {
        return res.json({ errorMessage: "Please enter the comment content" })
    }

    const createComment = await Comments.create({
        postId,
        user,
        password,
        comment
    })
    return res.json({
        comment: createComment
    })
})

router.put('/comments/:_id', async (req, res) => {
    const { _id } = req.params
    const { password, comment } = req.body
    const data = await Comments.findOne({ _id: _id })
    const passwordcomment = data.password

    if (!comment) {
        return res.json({ errorMessage: "Please enter the comment content" })
    }

    if (password !== passwordcomment) {
        return res.json({ errorMessage: "Auth failed" })
    }

    if (data) {
        await Comments.updateOne({ _id: _id },
            {
                $set: {
                    comment: comment
                }
            })
    }
    return res.json({
        result: 'success',
        success: true,
    })
})

router.delete('/comments/:_id', async (req, res) => {
    const { _id } = req.params
    const { password } = req.body
    const data = await Comments.findOne({ _id: _id })

    

    if (data) {
        if (password !== data.password) {
            return res.json({ errorMessage: "Auth failed" })
        }
        await Comments.deleteOne({ _id: _id })
    } else {
        return res.status(400).json({
            errorMessage: "Data not found"
        })
    }
    return res.json({
        result: 'success',
        success: true,
    })
})

module.exports = router