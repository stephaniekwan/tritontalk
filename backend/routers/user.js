const express = require('express');

const User = require('../models/User')

const router = new express.Router();

// CREATE / READ
router.post('/login', async (req, res) => {
  console.log('request arrived to /login')

  const query = {email: req.identity.email}

  let user = await User.findOne(query)

  if(!user){
    user = new User({
      name: req.identity.name,
      email: req.identity.email,
      picture: req.identity.picture
    })

    await user.save()
    console.log('New user created')

    res.setHeader('user_found', 0)
    res.status(200).send(JSON.stringify(user));
  }

  else{
    console.log('User successfully found')
    console.log(user)
    res.setHeader('user_found', 1)
    res.status(200).send(JSON.stringify(user));
  }
});

// READ
router.get('/me', async (req, res) => {
  const query = {email: req.identity.email}

  const user = await User.findOne(query).populate([{path: 'clubs', populate: {path: 'room', select: 'name'}}, {path: 'hosted_rooms'}])

  console.log(user)

  if(!user)
    return res.status(404).send('Cannot get a nonexistent user')

  res.status(200).send(user)
})

// READ
router.get('/get', async (req, res) => {
  const query = {email: req.body.email}

  const user = await User.findOne(query) 

  if(!user)
    return res.status(404).send('Cannot get a nonexistent user')

  res.status(200).send(user)
})

// READ
router.get('/getAll', async (req, res) => {
  const users = await User.find({})

  if(!users)
    return res.status(404).send('There are no users!')

  res.status(200).send(users)
})

// UPDATE
router.put('/addFriend', async (req, res) => {
  const query = {email: req.identity.email}

  const user = await User.findOne(query)

  console.log(user)

  if(!user)
    return res.status(404).send('Cannot get a nonexistent user')

  res.status(200).send(user)
})

// UPDATE
router.put('/update', async (req, res) => {
  const query = {email: req.identity.email}

  const updateObj = {
    $set: {
      sprite: req.body.user.sprite, 
      major: req.body.user.major,
      year: req.body.user.year, 
      bio: req.body.user.bio,
      college: req.body.user.college
    }
  }


  const user = await User.findOneAndUpdate(query, updateObj, { new: true })

  if(!user)
    return res.status(404).send('Cannot modify a nonexistent user')

  res.status(200).send(user)
})

// DELETE
router.delete('/delete', async (req, res) => {
  const query = {email: req.identity.email}

  const user = await User.findOne(query)

  if(!user)
    return res.status(404).send('Failed to delete user')

  await user.remove()
  return res.status(200).send({summary: 'User deleted'})
})

module.exports = router
