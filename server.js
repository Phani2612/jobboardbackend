const Express = require('express')


const App = Express()

const Path = require('path')

const CORS = require('cors')


const bodyParser = require('body-parser');

const dayjs = require('dayjs')

const Mongoose = require('mongoose')

const BCRYPT = require('bcryptjs')

const fs = require('fs');

const XSS = require('xss')


App.use(CORS())

App.use('/Files', Express.static(Path.join(__dirname, 'Files')));


App.use(Express.urlencoded())


App.use(bodyParser.json({ limit: '50mb' }));
App.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


App.use(Express.json())

// Mongoose.connect('mongodb://localhost:27017/Jobboard');

Mongoose.connect('mongodb+srv://Phani2612:2612@cluster0.nxfzz84.mongodb.net/Jobboard?retryWrites=true&w=majority&appName=Cluster0');

const Multer = require('multer')

const Details = Multer.diskStorage({
      destination : function(req,file,info) {


        info(null , 'Files/')

      },

      filename  : function(req,file,info) {

             info(null , file.originalname)
      }
})


let Upload = Multer({storage : Details})


const RegisterSchema = new Mongoose.Schema({

       Name : {

          type : String
       },

       Email : {

           type : String,
           unique : true
       },

       Password : {

           type : String
       },

       Confirm : {

           type : String
       }
})



const RegisterModel = Mongoose.model('Register', RegisterSchema)




const LoginSchema = new Mongoose.Schema({

    UserName: {

         type : String
    },
 
    UserEmail : {

        type : String,
        unique : true
    },

    Description : {

         type : String
    },

    ContactInfo : {

         type : String
    },

    Education : [],

    WorkExperience : [],

    Skills : {

        type : String
    },

    Careerstatus : {

         type : String
    },

    Employementtype : {

         type : String
    },

    posts : [],

    jobposts : []
    
})


const LoginModel = Mongoose.model('Login', LoginSchema)





const PostSchema = new Mongoose.Schema({

    UserName : {

         type : String
    },

    PostDetails : {

         type : String
    },

    Date : {

         type : String
    },

    Time : {

         type : String
    },

    Like : [],

    comments : []

   
})


const Postmodel = Mongoose.model("Posts" , PostSchema)



const JobSchema = new Mongoose.Schema({

    UserName : {

         type : String
    },

    JobTitle : {

          type : String
    },

    Vacancies : {

         type : String
    },

    SkillRequirement : {

         type : String
    },

    Experience : {

         type : String
    },

    CompanyName : {

        type : String

    },


    Applications : [],


    Date : {
        type : String
    },

    Time : {

         type : String
    }
})



const JobModel = Mongoose.model('Jobinfo',JobSchema)




const ApplicationSchema = new Mongoose.Schema({

     

     Skills : {

         type : String
     },

     Email : {

         type : String
     },

     ContactNumber : {

        type : Number
     },

     Education : {

         type : String
     },

     PostOwner : {

         type : String
     },


     Resume : {

         type : String
     }
})


const ApplicationModel = Mongoose.model('Applications', ApplicationSchema)


const WorkSchema = new Mongoose.Schema({
     
    Company : {

         type : String
    },

    Position : {

         type : String
    },

    StartDate : {

         type : String
    },

    EndDate : {


         type : String
    },

    Description : {

         type : String
    }
})


const WorkModel = Mongoose.model('Workexp' , WorkSchema)




const EducationSchema = new Mongoose.Schema({

     Institution : {

          type : String
     },

     Degree : {

         type : String
     },

     FieldOfStudy : {

         type : String
     },

     StartDate : {

         type : String
     },


     EndDate : {

         type : String
     }
})



const EducationModel = Mongoose.model('Education',EducationSchema)



const MessageSchema = new Mongoose.Schema({

    Name : {

         type : String
    },

    Email : {

         type : String
    },

    Message : {

        type : String
    }
})


const MessageModel = Mongoose.model('Message',MessageSchema)





App.post('/register' , async function(req,res)
{
    //    console.log(req.body)

       

       const UserEnteredName = req.body.username 

       const UserEnteredemail = req.body.email 


       const UserEnteredPassword = req.body.password

       const UserConfirmPassword = req.body.confirmPassword

       const IstheuserExist = await RegisterModel.findOne({Email : UserEnteredemail})


       const Hashedpassword = await BCRYPT.hash(UserEnteredPassword , 10)

       
       if(!IstheuserExist)
        {

              if(UserEnteredPassword === UserConfirmPassword)
                {
                     
            new RegisterModel({

                Name : UserEnteredName,
    
                Email : UserEnteredemail,
    
                Password : Hashedpassword,
    
                Confirm : Hashedpassword
           }).save().then(function(output)
        {







             console.log(output)
             res.send('/login')
        }).catch(function(error)
        {
              console.error(error)
        })
                }
        }

        else{

            res.send("User already Exists!!")
        }
})



App.post('/login' , async function(req,res)
{

    // console.log(req.body)


    const Userloggedemail = req.body.email

    const Usernamesimple = req.body.username

    const Result = await RegisterModel.findOne({Email : Userloggedemail})

    const UserExistinloginDB = await LoginModel.findOne({UserEmail : Userloggedemail})

    if(Result != null)
        {
              const Userloggedpassword = req.body.password

              const ActualPassword = Result.Password

              const Confirmation = await BCRYPT.compare(Userloggedpassword , ActualPassword)

              if(Confirmation === true)
                {
                    if(!UserExistinloginDB)
                        {
                            new LoginModel({
                                 UserName : Usernamesimple,
                                 UserEmail : Userloggedemail,

                                 Descripption : '',

                                 ContactInfo : '',

                                 Education : [],

                                 WorkExperience : [],

                                 Skills :'',

                                 Careerstatus : ''
                            }).save().then().catch(function(error)
                        {
                            console.error(error)
                        })
                        }
                    res.send('/home')
                }

            else{

                 res.send('/login')
            }
        }


        else{

            res.send('/register')
        }
  

})


App.get('/loginusers' , async function(req,res)
{
     const Allusers = await LoginModel.find()

     res.send(Allusers)
})








App.post('/posts' , function(req,res)
{
    //  console.log(req.body)

     const PostContent = req.body.CollectPost[`postcontent`]

     const FetchedUser = req.body.Userfetchdata

     const Dateinfo  = new Date().toLocaleDateString()

     const Timeinfo = new Date().toTimeString()



    console.log(Timeinfo)


     new Postmodel({

           UserName : FetchedUser,

           PostDetails : PostContent,

           Date : Dateinfo,

           Time : Timeinfo
     }).save().then(async function(output)
    {
        await LoginModel.findOneAndUpdate({UserEmail : FetchedUser},{$push : {posts : output}} , {new : true})
        //  console.log(output)
    }).catch(function(error)
    {
         console.error(error)
    })


})


App.get('/posts' , async function(req,res)
{
      const AlluserPosts = await Postmodel.find()

      res.send(AlluserPosts)
})



App.post('/jobpost' , function(req,res)
{
    const userJobTitle = req.body.Jobdetails[`jobTitle`]

    const userVacancies = req.body.Jobdetails[`vacancies`]

    const userSkillRequirement = req.body.Jobdetails[`skillRequirement`]

    const userExperience = req.body.Jobdetails[`experience`]

    const UserDetail = req.body.Userfetchdata

    const Companydetail = req.body.Jobdetails[`companyName`]

    const Dateinfo  = new Date().toLocaleDateString()

     const Timeinfo = new Date().toTimeString()

    new JobModel({

          JobTitle : userJobTitle,

          Vacancies : userVacancies,
 
          SkillRequirement : userSkillRequirement,

          Experience : userExperience,

          UserName : UserDetail,

          Time : Timeinfo,

          Date : Dateinfo,

          CompanyName : Companydetail

    }).save().then(async function(output)
{
     console.log("Successfully added")
     await LoginModel.findOneAndUpdate({UserEmail : UserDetail},{$push : {jobposts : output}} , {new : true})
}).catch(function(error)
{
    console.error(error)
})

    


})



App.get('/jobposts' , async function(req,res)
{
       const UserName = req.params.User
       const Jobpostfetcheddata = await JobModel.find()

       res.send(Jobpostfetcheddata)


})


App.post(`/apply` , async function(req,res)
{
     


     const Skillsdetails = req.body.Applicationdata[`skills`]

     const Emaildetails = req.body.Applicationdata[`email`]

     const ResumeInfo = req.body.Applicationdata[`resume`]


     const ContactNumberdetails = req.body.Applicationdata[`contactNumber`]


     const EducationHistorydetails = req.body.Applicationdata[`educationHistory`]


     const Postownerdetails = req.body.PostOwner 


    //  console.log(ResumeInfo)

    
    //  console.log(Postownerdetails)

// console.log(ResumeInfo)    

    const binaryData = Buffer.from(ResumeInfo , 'base64');

    const mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    const fileExtension = mimeType.split('/')[1]; // Extract file extension

    console.log(fileExtension)

    const fileName = `resume.${fileExtension}`;

// Save binary data to file
fs.writeFile(fileName, binaryData, 'binary', (err) => {
  if (err) throw err;
  console.log(`Resume saved as ${fileName}`);
});





     

     const Findthepostowner = await JobModel.findOne({_id : Postownerdetails})


     const Applicationdata = await ApplicationModel.find()

     
    //  console.log(Findthepostowner)

    const OwnerName = await Findthepostowner[`UserName`]


    
               new ApplicationModel({
                   
                      Email : Emaildetails,

                      Skills : Skillsdetails,

                      ContactNumber : ContactNumberdetails,

                      Education : EducationHistorydetails,

                      Resume : fileName,

                      PostOwner : OwnerName
               }).save().then(async function(output)
            {
             
                
                if(output.PostOwner === OwnerName)
                    {
                        await JobModel.findOneAndUpdate(await JobModel.findOneAndUpdate(
                            { _id: Postownerdetails },
                            { $push: { Applications: output } }, // Add 'i' to the Applications array
                            { new: true } // Return the updated document
                        ))

                       
                    }

                
        
                
                console.log("Added details in application documents")
            }).catch(function(error)
            {
                  console.error(error)
            })


    
   
    
   
    
    
    // console.log(Findthepostowner)
        
})


App.get('/applications' , async function(req,res)
{
        const Applications = await ApplicationModel.find()

        res.send(Applications)
})


App.get('/download/:path' , function(req,res)
{
    console.log(req.params.path)
    const filePath = Path.join(__dirname,req.params.path);
    console.log(__dirname)
    res.sendFile(filePath);
})


App.get('/userprofile/:name' , async function(req,res)
{
    //  console.log(req.params.name)

     const UserNamedetail = req.params.name

     const Userfetcheddata = await LoginModel.findOne({UserEmail : UserNamedetail})
    
     console.log(Userfetcheddata)

     res.send([Userfetcheddata])
})


App.patch('/update/:name/Skills', async function(req, res) {
    // console.log(req.body);

    const Username = req.params.name;
    const Entitytype = req.params.type;

    const Skillinfo = req.body.skills

    // const Phoneinfo = req.body.phone

    // console.log(Entitytype);

    await LoginModel.findOneAndUpdate({UserEmail : Username} , {$set : { Skills : Skillinfo }})
});

App.patch('/update/:name/Contact', async function(req, res) {
    console.log(req.body);

    const Username = req.params.name;
    const Entitytype = req.params.type;



    const Phoneinfo = String(req.body.phone)


    await LoginModel.findOneAndUpdate({UserEmail : Username} , {$set : {ContactInfo : Phoneinfo}})
});


App.patch('/update/:name/Work', async function(req, res) {
    

    const Username = req.params.name;

    console.log(req.body)

    const Usercompany = req.body.companyName

    const Userposition = req.body.position

    const Userstartdate = req.body.startDate 

    const Userenddate = req.body.endDate 


    const Userdescription = req.body.description 


    new WorkModel({

         Company : Usercompany,

         Position : Userposition,

         StartDate : Userstartdate,

         EndDate : Userenddate,

         Description : Userdescription
    }).save().then(async function(output)
{
    console.log("Added successfully")
    await LoginModel.findOneAndUpdate({UserEmail : Username},{$push : {WorkExperience : output}} , {new : true})
}).catch(function(error)
{
    console.error(error)
})

    // await LoginModel.findOneAndUpdate({UserEmail : Username} , {$set : {WorkExperience : WorkInfo}})
});


App.patch('/update/:name/Education' , function(req,res)
{
    console.log(req.body)
    const Username = req.params.name;
     
    const UserInstitution = req.body.institution 


    const UserDegree = req.body.degree  

    const Userfieldofstudy = req.body.fieldOfStudy 

    const UserstartDate = req.body.startDate 


    const Userenddate = req.body.endDate 



    new EducationModel({

        Institution : UserInstitution,

        Degree : UserDegree,

        FieldOfStudy : Userfieldofstudy,

        StartDate : UserstartDate,

        EndDate : Userenddate
    }).save().then(async function(output)
{
    console.log("Saved successfully")
    await LoginModel.findOneAndUpdate({UserEmail : Username},{$push : {Education : output}} , {new : true})
}).catch(function(error)
{
    console.error(error)
})
})

// App.post('/uploadImage', function(req, res) {
//     const imageData = req.body.image;
//     const fileName = 'image_' + Date.now() + '.jpg';
//     const imagePath = Path.join(__dirname, 'Files', fileName);
  
//     fs.writeFile(imagePath, imageData, 'base64', function(err) {
//       if (err) {
//         console.error('Error saving image:', err);
//         res.status(500).send('Error saving image');
//       } else {
//         console.log('Image saved successfully');
//         // Read the file from disk and send its contents as response
//         fs.readFile(imagePath, function(err, data) {
//           if (err) {
//             console.error('Error reading image:', err);
//             res.status(500).send('Error reading image');
//           } else {
//             // Set Content-Type header
//             res.set('Content-Type', 'image/jpeg');
//             // Send the file contents as response

//             console.log(data)

//             res.send(data);
//           }
//         });
//       }
//     });
//   });



App.post('/message' ,  async function(req,res)
{
    console.log(req.body)

    new MessageModel({

          Name : req.body.name,

          Email : req.body.email,

          Message : req.body.message
    }).save().then(function(output)
{
    console.log("Message added successfully")
}).catch(function(error)
{
    console.error(error)
})
})


App.post('/likepost/:User' , async function(req,res)
{

      const UserNamed = req.params.User

      const PostOwner = req.body.Ownername


    //   console.log(PostOwner)

      

    //   const Gatheruserdetails = await LoginModel.findOne({UserMail : UserNamed})

      await Postmodel.findOneAndUpdate({_id:PostOwner},{$push : {Like : UserNamed}} ,{new : true} )

      res.send(true)
})



App.listen(5000 , function()
{
      console.log("Port is running at 5000")
})