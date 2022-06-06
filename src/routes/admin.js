const express = require("express");
const router = express.Router();
const db = require("../db/db");
const multer = require('multer');
const path = require('path');
const config = require("../../config");
var midway = require('./midway');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
const { equal } = require("assert");
const { Console } = require("console");
const { json } = require("body-parser");
const nodemailer = require('nodemailer');
// const today = new Date();
// const utcMonth = today.getUTCMonth();


router.post("/SaveServicesList", (req, res, next) => {
    db.executeSql("INSERT INTO `serviceslist`(`name`, `price`, `time`, `point`, `isactive`, `createdate`)VALUES('" + req.body.name + "'," + req.body.price + "," + req.body.time + "," + req.body.point + ",true,CURRENT_TIMESTAMP);", function(data, err) {
        if (err) {
            res.json("error");
        } else {

            return res.json(data);
        }
    });
});


router.get("/GetAllServices", (req, res, next) => {
    db.executeSql("select * from serviceslist", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/UpdateServicesList", (req, res, next) => {
    db.executeSql("UPDATE  `serviceslist` SET name='" + req.body.name + "',price=" + req.body.price + ",time=" + req.body.time + ",point=" + req.body.point + ",updateddate=CURRENT_TIMESTAMP WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
});



router.post("/SaveEmployeeList", (req, res, next) => {
    console.log(req.body)
    db.executeSql("INSERT INTO `employee`(`fname`,`lname`,`contact`,`whatsapp`,`address`,`city`,`pincode`,`gender`,`isactive`,`createddate`)VALUES('" + req.body.fname + "','" + req.body.lname + "','" + req.body.contact + "','" + req.body.whatsapp + "','" + req.body.address + "','" + req.body.city + "'," + req.body.pincode + ",'" + req.body.gender + "'," + req.body.isactive + ",CURRENT_TIMESTAMP);", function(data, err) {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
            console.log(req.body.service.length)
            for (let i = 0; i < req.body.service.length; i++) {
                console.log(req.body.service[i]);
                db.executeSql("INSERT INTO `empservices`(`servicesid`,`servicesname`,`empid`) VALUES(" + req.body.service[i].servicesId + ",'" + req.body.service[i].servicesName + "'," + data.insertId + ");", function(data1, err) {
                    if (err) {
                        console.log(err);

                    } else {

                    }
                });

            }
            return res.json('success');
        }
    });
});

// router.get("/GetAllEmployee", (req, res, next) => {
//     db.executeSql("select e.id,e.fname,e.lname,e.contact,e.whatsapp,e.address,e.city,e.pincode,e.gender,e.isactive,e.createddate,e.updateddate,s.servicesid,s.servicesname from employee e join empservices s on e.id=s.empid", function (data, err) {
//         if (err) {
//             console.log(err);
//         } else {
//             return res.json(data);
//         }
//     })
// });
router.get("/GetAllEmployee", (req, res, next) => {
    db.executeSql("select * from employee", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.get("/GetEmployeeService", (req, res, next) => {
    db.executeSql("select * from empservices", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/RemoveEmployeeList", (req, res, next) => {

    console.log(req.body);
    db.executeSql("Delete from employee where id=" + req.body.id, function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/UpdateEmployeeList", (req, res, next) => {
    db.executeSql("UPDATE `employee` SET fname='" + req.body.fname + "',lname='" + req.body.lname + "',contact='" + req.body.contact + "',whatsapp='" + req.body.whatsapp + "',address='" + req.body.address + "',city='" + req.body.city + "',gender='" + req.body.gender + "',updateddate=CURRENT_TIMESTAMP WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/SaveCustomerList", (req, res, next) => {
    console.log(req.body)
    db.executeSql("INSERT INTO `customer`(`fname`,`lname`,`email`,`contact`,`whatsapp`,`gender`,`createddate`,`address`)VALUES('" + req.body.fname + "','" + req.body.lname + "','" + req.body.email + "','" + req.body.contact + "','" + req.body.whatsapp + "','" + req.body.gender + "',CURRENT_TIMESTAMP,'" + req.body.address + "');", function(data, err) {
        if (err) {
            console.log(err)
        } else {
            return res.json('success');
        }
    });
});


router.get("/GetAllCustomer", (req, res, next) => {
    db.executeSql("select * from customer", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/SaveAppointmentList", (req, res, next) => {
    console.log(req.body)
    db.executeSql("INSERT INTO `appointment`(`custid`, `empname`, `totalprice`, `totalpoint`, `totaltime`, `isactive`, `createddate`,`ispayment`)VALUES(" + req.body.custid + ",'" + req.body.emp + "','" + req.body.totalprice + "','" + req.body.totalpoint + "','" + req.body.totaltime + "'," + req.body.isactive + ",CURRENT_TIMESTAMP,false);", function(data, err) {
        if (err) {
            console.log(err)
        } else {
            for (let i = 0; i < req.body.selectedService.length; i++) {
                db.executeSql("INSERT INTO `custservices`(`servicesid`,`servicesname`,`custid`,`appointmentid`,`employeename`,`empid`) VALUES(" + req.body.selectedService[i].selectedServid + ",'" + req.body.selectedService[i].selectedServ + "'," + req.body.custid + "," + data.insertId + ",'" + req.body.selectedService[i].selectedEmp + "'," + req.body.selectedService[i].selectedEmpid + ");", function(data1, err) {
                    if (err) {
                        console.log(err);
                    } else {}
                });
            }
            if (req.body.tCustPoint == 0) {
                console.log('undefined');

                db.executeSql("INSERT INTO `point`( `custid`, `totalcustpoint`)VALUES(" + req.body.custid + "," + req.body.lessPoints + ");", function(data, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                    }
                });
            } else {
                console.log('defined')
                console.log(req.body)
                db.executeSql("UPDATE `point` SET totalcustpoint=" + req.body.lessPoints + " WHERE custid=" + req.body.custid + ";", function(data, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(data);
                    }
                });
            }

        }
        return res.json('success');
    });
});


router.get("/GetAllAppointment", (req, res, next) => {
    db.executeSql("select a.id,a.custid,a.empname,a.totalprice,a.totalpoint,a.totaltime,a.isactive,a.createddate,a.updatedate,c.id as cId,c.fname,c.lname,c.email,c.contact,c.whatsapp,c.gender from appointment a join customer c on a.custid=c.id where isactive=true", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});
router.post("/ChackForPassword", (req, res, next) => {
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + req.body.pass;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    db.executeSql("select * from admin where id=" + req.body.id + " and password='" + encPassword + "'", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data)
        }
    })
})

router.post("/updatePasswordAccordingRole", (req, res, next) => {
    console.log(req.body)
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + req.body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    if (req.body.role == 'Admin') {
        db.executeSql("UPDATE  `admin` SET password='" + encPassword + "' WHERE id=" + req.body.id + ";", function(data, err) {
            if (err) {
                console.log("Error in store.js", err);
            } else {
                return res.json(data);
            }
        });
    }
});


router.get("/GetAllEnquiryList", (req, res, next) => {
    db.executeSql("select * from enquiry", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});


var nowDate = new Date();
date = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate();
router.get("/GetDailyTotal", (req, res, next) => {
    db.executeSql("select * from appointment where createddate='" + date + "' and ispayment=true", function(data, err) {
        if (err) {
            console.log(err);
        } else {

            return res.json(data);
        }
    })
});

router.get("/GetMonthlyTotal", (req, res, next) => {
    db.executeSql("select * from appointment where  DATE_FORMAT(createddate, '%m') = DATE_FORMAT(CURRENT_TIMESTAMP, '%m') and ispayment=true", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});


router.post("/UpdateCustomerList", (req, res, next) => {
    db.executeSql("UPDATE  `customer` SET fname='" + req.body.fname + "',lname='" + req.body.lname + "',email='" + req.body.email + "',contact='" + req.body.contact + "',whatsapp='" + req.body.whatsapp + "',gender='" + req.body.gender + "',updateddate=CURRENT_TIMESTAMP,address='" + req.body.address + "' WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})



router.get("/removeCustomerDetails/:id", (req, res, next) => {

    db.executeSql("Delete from customer where id=" + req.params.id, function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.get("/RemoveServicesList/:id", (req, res, next) => {

    db.executeSql("Delete from serviceslist where id=" + req.params.id, function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/ForgotPassword", (req, res, next) => {
    let otp = Math.floor(100000 + Math.random() * 900000);
    console.log(req.body);
    if (req.body.role == 'Admin') {
        db.executeSql("select * from admin where email='" + req.body.email + "';", function(data, err) {
            if (err) {
                console.log("Error in store.js", err);
                return res.json('err');
            } else {

                db.executeSql("INSERT INTO `otp`(`userid`, `otp`, `createddate`, `createdtime`,`role`,`isactive`) VALUES (" + data[0].id + "," + otp + ",CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'" + req.body.role + "',true)", function(data1, err) {
                    if (err) {
                        console.log(err);
                    } else {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            host: "smtp.gmail.com",
                            port: 465,
                            secure: false, // true for 465, false for other ports
                            auth: {
                                user: 'keryaritsolutions@gmail.com', // generated ethereal user
                                pass: 'sHAIL@2210', // generated ethereal password
                            },
                        });
                        const output = `
                        <h3>One Time Password</h3>
                        <p>To authenticate, please use the following One Time Password(OTP):<h3>` + otp + `</h3></p>
                        <p>OTP valid for only 2 Minutes.</P>
                        <p>Don't share this OTP with anyone.</p>
                        <a href="http://localhost:4200/password">Change Password</a>
`;
                        const mailOptions = {
                            from: '"KerYar" <keryaritsolutions@gmail.com>',
                            subject: "Password resetting",
                            to: req.body.email,
                            Name: '',
                            html: output

                        };
                        transporter.sendMail(mailOptions, function(error, info) {
                            console.log('fgfjfj')
                            if (error) {
                                console.log(error);
                                res.json("Errror");
                            } else {
                                console.log('Email sent: ' + info.response);
                                res.json(data);
                            }
                        });
                    }
                })
                console.log(req.body)
            }
        });
    }

});

router.post("/GetOneTimePassword", (req, res, next) => {
    console.log(req.body)
    db.executeSql("select * from otp where userid = " + req.body.id + " and otp = " + req.body.otp + " ", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
});



router.post("/UpdateActiveStatus", (req, res, next) => {
    db.executeSql("UPDATE  `appointment` SET isactive=" + req.body.isactive + ", updatedate=CURRENT_TIMESTAMP,ispayment=true WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/GetViewAppointment", (req, res, next) => {
    db.executeSql("select * from appointment where custid = " + req.body.id + "", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/UpdateEnquiryStatus", (req, res, next) => {
    db.executeSql("UPDATE  `enquiry` SET isactive=" + req.body.isactive + " WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})


router.post("/GetCustomerTotalPoints", (req, res, next) => {
    db.executeSql("select * from point where custid = " + req.body.id + "", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/GetAllCustomerDataList", (req, res, next) => {

    db.executeSql("select * from appointment where custid = " + req.body.id + "", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/GetUsedServicesByCustomer", (req, res, next) => {

    db.executeSql("select s.servicesid,s.servicesname,s.custid,s.appointmentid,s.employeename,s.empid,sl.id as slId,sl.price,sl.time,sl.point from custservices s join serviceslist sl on s.servicesid=sl.id where s.appointmentid = " + req.body.id + "", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = yyyy + '-' + mm + '-' + dd;

router.get("/GetAllCompletedServices", (req, res, next) => {
    db.executeSql("select a.id,a.custid,a.empname,a.totalprice,a.totalpoint,a.totaltime,a.isactive,a.createddate,a.updatedate,c.id as cId,c.fname,c.lname,c.email,c.contact,c.whatsapp,c.gender from appointment a join customer c on a.custid=c.id where a.isactive=false and a.createddate='" + today + "'", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/SaveModeOfPayment", (req, res, next) => {
    db.executeSql("INSERT INTO `payment`(`cid`, `appointmentid`, `cname`, `modeofpayment`, `tprice`, `tpoint`, `pdate`,`createddate`) VALUES (" + req.body.cid + "," + req.body.appointmentid + ",'" + req.body.cname + "','" + req.body.modeofpayment + "'," + req.body.tprice + "," + req.body.tpoint + ",CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);", function(data, err) {
        if (err) {
            res.json("error");
        } else {

            return res.json("success");
        }
    });
});

router.get("/GetAllModeOfPayment", (req, res, next) => {
    db.executeSql("select * from payment where pdate ='" + today + "' ", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.get("/GetMonthlyPayment", (req, res, next) => {
    db.executeSql("select * from payment ", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})


router.post("/SaveExpensesList", (req, res, next) => {
    db.executeSql("INSERT INTO expenses (expensesdate, expensesname, expensesprices, employeename, paymenttype) VALUES ('" + req.body.expensesdate + "','" + req.body.expensesname + "','" + req.body.expensesprices + "','" + req.body.employeename + "','" + req.body.paymenttype + "');", function(data, err) {
        console.log(req.body.expensesdate, " , ", req.body.expensesdate);
        if (err) {
            res.json("error");
        } else {

            return res.json(data);
        }
    });
});

router.get("/GetAllExpenses", (req, res, next) => {
    db.executeSql("select * from expenses", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

router.post("/RemoveExpensesDetails", (req, res, next) => {
    db.executeSql("Delete from expenses where id=" + req.body.id, function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.post("/UpdateExpensesDetails", (req, res, next) => {
    var newdate = new Date(req.body.expensesdate).getDate() + 1;
    var newMonth = new Date(req.body.expensesdate).getMonth();
    var newyear = new Date(req.body.expensesdate).getFullYear();
    var querydate = new Date(newyear, newMonth, newdate)
    db.executeSql("UPDATE expenses SET expensesdate='" + querydate.toISOString() + "',expensesname='" + req.body.expensesname + "',expensesprices='" + req.body.expensesprices + "',employeename='" + req.body.employeename + "',paymenttype='" + req.body.paymenttype + "' WHERE id=" + req.body.id + ";", function(data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
})

router.get("/getMonthlyExpensesList", (req, res, next) => {
    db.executeSql("select * from expenses where  DATE_FORMAT(expensesdate, '%m') = DATE_FORMAT(CURRENT_TIMESTAMP, '%m')", function(data, err) {
        if (err) {
            console.log(err);
        } else {
            return res.json(data);
        }
    })
});

let secret = 'prnv';
router.post('/login', function(req, res, next) {

    const body = req.body;
    console.log(body);
    var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
    var repass = salt + '' + body.password;
    var encPassword = crypto.createHash('sha1').update(repass).digest('hex');
    db.executeSql("select * from admin where email='" + req.body.email + "';", function(data, err) {
        console.log(data);
        if (data.length > 0) {
            db.executeSql("select * from admin where email='" + req.body.email + "' and password='" + encPassword + "';", function(data1, err) {
                console.log(data1);
                if (data1.length > 0) {

                    module.exports.user1 = {
                        username: data1[0].email,
                        password: data1[0].password
                    }
                    let token = jwt.sign({ username: data1[0].email, password: data1[0].password },
                        secret, {
                            expiresIn: '1h' // expires in 24 hours
                        }
                    );
                    console.log("token=", token);
                    data[0].token = token;

                    res.cookie('auth', token);
                    res.json(data);
                } else {
                    return res.json(2);
                }
            });
        } else {
            return res.json(1);
        }
    });

});




function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
}


module.exports = router;