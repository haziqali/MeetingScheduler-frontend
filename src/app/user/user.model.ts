export class User {

    userId: String;    
    firstName: String;   
    lastName: String;
    email: String;   
    mobileNumber: String; 
    friendRequests: [{
        _id: String,
        email: String,
        firstName: String,
        lastName: String
      }];
      friends: [{
        _id: String,
        email: String,
        firstName: String,
        lastName: String
      }];
    }