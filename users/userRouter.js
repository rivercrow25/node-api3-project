const express = require('express');
const userDb = require('./userDb')
const postDb = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  console.log(req.body.name)
  userDb.insert(req.body)
    .then(user => {
      res.status(201).json(user)
    })
    .catch(error => {
      res.status(500).json({ message: 'server error saving the user' })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  req.body.user_id = req.params.id
  postDb.insert(req.body)
    .then(posts => {
      res.status(201).json(posts)
    })
    .catch(() => {
      res.status(500).json({ message: 'server error saving the post' })
    })
});

router.get('/', (req, res) => {
  userDb.get()
    .then(users => {
      res.status(200).json(users)
    })
});

router.get('/:id', validateUserId, (req, res) => {
  userDb.getById(req.params.id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(() => {
      res.status(404).json({ message: 'Error user with specified id doesnt exist' })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  userDb.getUserPosts(req.params.id)
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(() => {
      res.status(404).json({ message: 'Error user with specified id doesnt exist' })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  userDb.remove(req.params.id)
    .then(users => {
      res.status(200).json(users)
    })
    .catch(() => {
      res.status(404).json({ message: 'Error user with specified id doesnt exist' })
    })
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  userDb.update(req.params.user, req.body)
    .then(newUser => {
      res.status(200).json(newUser)
    })
    .catch(() => {
      res.status(404).json({ message: 'Error user with specified id doesnt exist' })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  userDb.getById(req.params.id)
    .then(user => {
      next()
    })
    .catch(() => {
      res.status(400).json({ message: 'invalid user id' })
    })
}

function validateUser(req, res, next) {
  if (req.body) {
    if (req.body.name) {
      next()
    } else {
      res.status(400).json({ message: 'missing required user name' })
    }
  } else {
    res.status(400).json({ message: 'missing user data' })
    console.log(req.body)
  }
}

function validatePost(req, res, next) {
  if (req.body) {
    if (req.body.text) {
      next()
    } else {
      res.status(400).json({ message: 'missing required text field' })
    }
  } else {
    res.status(400).json({ message: 'missing post data' })
  }
}

module.exports = router;
