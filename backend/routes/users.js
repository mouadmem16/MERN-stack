const axios = require('axios') ;
const router = require('express').Router();
let User = require('../Models/user.model');

router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/generate100').get((req, res) => {
    axios.get('https://randomuser.me/api/?results=100&inc=gender,name,email,login,dob,picture')
    .then(response => {
      console.log(response.data.results.length)
      if (response.data.results.length > 0) {
        response.data.results.forEach(element => {
          const newUser = {
            username:element.login.username, 
            photo: element.picture.medium,
            gender: element.gender,
            email: element.email,
            news: false,
            dob: element.dob.date,
          };
          axios.post('http://localhost:5000/users/', newUser)
          .then(res => console.log(res.data));
        });
      }
    })
    .catch((error) => {
      console.log(error);
    })
});

router.route('/:id').get( async (req, res) => {
    const { id } = req.params
    try{
        const user = await User.findOne({ _id: id })
        if (user) {
            res.json(user)
        }
        else throw {error:"not Found"}
    }catch(err){
        res.status(404).json(err)
    }
    
});

router.route('/').post((req, res) => {
    const userNew = {};
    userNew.username = req.body.username
    userNew.email = req.body.email
    userNew.photo = req.body.photo
    userNew.news = req.body.news
    userNew.gender = req.body.gender
    userNew.dob = Date.parse(req.body.dob);

    const newUser = new User(userNew);

    newUser.save()
        .then(() => res.json('User added!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').put(async (req, res) => {
    console.log(req.body)
    console.log(req.params.id)
    const id = req.params.id
    const userNew = req.body;
    try {
        const newUser = await User.findOne({ _id: id })
        if (newUser) {
            newUser.username = userNew.username
            newUser.email = userNew.email
            newUser.photo = userNew.photo
            newUser.news = userNew.news
            newUser.gender = userNew.gender
            newUser.dob = Date.parse(userNew.dob);
            newUser.save()
            .then(() => {
                res.json(newUser)
            })
            .catch(err =>{
                res.satus(404).json(err)
            })

        }
        else throw { error: "not Found" }
    } catch (err) {
        res.status(404).json(err)
    }
});


router.route('/:id').delete(async (req, res) => {
    const { id } = req.params
    try {
        const example = await User.findOne({ _id: id })
        if (example) {
            //delete
            example.deleteOne()
            .then(()=>{
                res.json(example)
            })
            .catch(err => {
                res.status(400).json(err)
            })
        }
        else throw { error: "not Found" }
    } catch (err) {
        res.status(404).json(err)
    }
});


module.exports = router;
