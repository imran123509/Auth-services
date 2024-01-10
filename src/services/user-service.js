const UserRepository = require('../repository/user-repository');
const jwt=require('jsonwebtoken');
const bcrypt= require('bcrypt');
const {JWT_KEY}=require('../config/serverConfig');
class UserService {
    constructor(){
        this.userRepository=new UserRepository();
    }

    async create(data){
       try {
           const user=await this.userRepository.create(data);
           return user;
       } catch (error) {
        console.log('something went wrong on service layer');
        throw error
       }
    }

    async signIn(email, palinPassword){
          try {
            // step 1 -> fetch the user using the email
            const user=await this.userRepository.getByEmail(email);
            // step 2 compare incoming plain password with stores encrepted password 
            const passwordMatch=this.checkPassword(palinPassword, user.password);
            if(!passwordMatch){
                console.log("password doesn't match");
                throw {error: 'Incorrect password'};
            }

             // step 3 if password is match create a token and send it to the user
            const newJwt=this.createToken({ email: user.email, id:user.id});
             return newJwt;
          } catch (error) {
            console.log('something went wrong on sign process');
              throw error
          }
    }

      async isAuthenticated(token){
           try {
              const isTokenVarified=this.verifyToken(token);
              if(!isTokenVarified){
                throw {error: 'invalid token'}
              }

              const user=this.userRepository.grtById(isTokenVarified.id);
              if(!user){
                throw {error: "No user with the corresponding token exists"};
              }
              return user.id;
           } catch (error) {
            console.log('something went wrong on auth process');
              throw error
           }
      }

    createToken(user){
        try {
        const result=jwt.sign(user, JWT_KEY, {expiresIn: '1h'});
            return result;
        } catch (error) {
            console.log('something went wrong on token creation');
            throw error
        }
    }

    verifyToken(token){
        try {
            const response=jwt.verify(token, JWT_KEY);
            return response;
        } catch (error) {
            console.log('something went wrong on token creation');
            throw error
        }
    }

    checkPassword(userInputPlainPassword, encryptedPassword){
        try {
            return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
        } catch (error) {
            console.log('something went wrong on password comparison');
            throw error
        }
    }

   


}

module.exports=UserService;