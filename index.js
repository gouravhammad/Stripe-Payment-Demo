const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
const app = express()

const stripe = require('stripe')('Your_Stripe_Key')

const port = process.env.PORT || 3000

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

// View Engine Setup
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

app.get('/',function(req,res){
    res.render('Home')
})

app.post('/payment',function(req,res){

    // Moreover you can take more details from user
    // like Address, Name, etc from form
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Gourav Hammad',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    })
    .then((customer) => {

        return stripe.charges.create({
            amount: 2500,          // Charing Rs 25
            description: 'Web Development Product',
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge) => {
        res.send("Success")  // If no error occurs
    })
    .catch((err) => {
        res.send(err)       // If some error occurs
    });
})

app.listen(port,function(error){
    if(error) throw error
    console.log("Server created Successfully")
})