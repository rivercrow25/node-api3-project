const express = require('express');

const db = require('./postDb')

const router = express.Router();

router.get('/', (req, res) => {
  db.get()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(() => {
      res.status(500).json({ message: 'server error unable to get posts' })
    })
});

router.get('/:id', validatePostId, (req, res) => {
  db.getById(req.params.id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(() => {
      res.status(500).json({ message: 'Error could not find specified post' })
    })
});

router.delete('/:id', validatePostId, (req, res) => {
  db.remove(req.params.id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(() => {
      res.status(500).json({ message: 'Error could not delete post' })
    })
});

router.put('/:id', validatePostId, (req, res) => {
  db.update(req.params.id, req.body)
    .then(newPost => {
      res.status(200).json(newPost)
    })
    .catch(() => {
      res.status(500).json({ message: 'Error could not update post' })
    })
});

// custom middleware

function validatePostId(req, res, next) {
  db.getById(req.params.id)
    .then(() => {
      next()
    })
    .catch(() => {
      res.status(400).json({ message: 'invalid post id' })
    })
}

module.exports = router;
