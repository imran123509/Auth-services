const express=require('express');
const bodyParser=require('body-parser');
const {PORT}= require('./config/serverConfig');
const apiRoutes=require('./routes/index');
const bcrypt= require('bcrypt');
const {User}=require('./models/index');
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/api', apiRoutes);

app.listen(PORT, async ()=>{
    console.log(`server started ${PORT}`);
    // const incomingpass='123456';
    // const user=await User.findByPk(3);
    // const response=bcrypt.genSaltSync(incomingpass, user.password);
    // console.log(response)
});