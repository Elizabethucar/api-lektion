const fs = require('fs')
const express = require('express')


const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())

const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`))

app.get('/api/user', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users
    }
  })
})

app.get('/api/user/:id', (req, res) => {
  // console.log(req.params)

  const id = req.params.id * 1
  const user = users.find(u => u.id === id)

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid id'
    })
  }
  res.status(200).json({
    status: 'success',
    data: {
      users: user
    }
  })
})

app.post('/api/user', (req, res) => {

  const newId = users[users.length - 1].id + 1
  const newUser = Object.assign({ id: newId }, req.body)

  users.push(newUser)

  fs.writeFile(`${__dirname}/data/users.json`, JSON.stringify(users), err => {
    res.status(201).json({
      status: 'success',
      data: {
        users: newUser
      }
    })
  })
})

app.put('/api/user/:id', (req, res) => {
  const userId = req.params.id;

  //const id = request.body.id;
  const name = req.body.name;
  const age = req.body.age;
  const email = req.body.email;

  const newUser = {
    id: userId,
    name,
    age,
    email,
  };
  const userIndex = users.findIndex((u) => u.id == userId);
  users[userIndex] = newUser;


  if (req.params.id * 1 > users.length) {
    return res.status(404).json({
      status: 'fail',
      message: ' Invalid user id'
    })
  } fs.writeFile(`${__dirname}/data/users.json`, JSON.stringify(users), err => {
    res.status(200).json({
      status: 'succes',
      data: {
        user: newUser
      }
    })
  })
})
app.delete('/api/user/:id', (req, res) => {
  const userId = req.params.id;

  const userIndex = users.findIndex((u) => u.id == userId);
  users.splice(userIndex, 1);
  fs.writeFile(`${__dirname}/data/users.json`, JSON.stringify(users), err => {
    res.json({
      status: "success",
      data: userId,
    });
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)

})
