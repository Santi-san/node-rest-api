const express = require("express");
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');
const Student = require("../models/student");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// const Filefilter = function (req, file, cb) {
//     if (file.mimetype !== 'image/png') {
//         req.fileValidationError = 'goes wrong on the mimetype';
//         return cb(null, false, new Error('goes wrong on the mimetype'));
//     }
//     cb(null, true);
// }

const upload = multer({
    storage: storage,
    dest: 'uploads/',
    // fileFilter: Filefilter
});

//get all students
router.get("/", (req, res, next) => {
    Student.find()

        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        id: doc._id,
                        name: doc.name,
                        age: doc.age,
                        profession: doc.profession,
                        profile_pic: doc.profile_pic

                    };
                })
            };

            res.status(200).json(response);

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//get by id


 router.get('/:studId',(req,res,next)=>{


    const id = req.params.studId;
    Student.findById(id)
 
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
            student: doc
          
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
 })


//add student

router.post("/", upload.single('profile_pic'), (req, res, next) => {
    if (!req.file) return res.status(500).json('error')
    const product = new Student({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        age: req.body.age,
        profile_pic: req.file.path,
        profession: req.body.profession
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Created student successfully",
                createdProduct: {
                    name: result.name,
                    age: result.age,
                    profile_pic: result.profile_pic,
                    profession: result.profession,
                    _id: result._id,

                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//update

router.patch("/:studId", (req, res, next) => {
    const id = req.params.studId;
  
    Student.update({
            _id: id
        }, {
            $set: req.body
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Student updated',
                status: req.body

            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//delete student

router.delete("/:studId", (req, res, next) => {
    const id = req.params.studId;
    Student.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                result: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
module.exports = router;