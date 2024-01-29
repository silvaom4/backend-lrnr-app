import express from 'express';
// import main from './script.js'
import fs from 'fs'
import cors from 'cors';
import { config } from "dotenv";
config();


// const express = require('express')
// const path = require('path')
// const fs = require('fs')
// const cors = require('cors')
// const { config } = require( "dotenv")
// config();



const API_KEY = process.env.API_KEY
// const API_KEY = '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'
//https://api.openai.com/v1/completions


const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static('public')); //not working 





app.get('/', (req, res) => {
    res.send("ello from backend ")
})
// change to app.get for the route to work 
app.post('/complet', async (req,res) => {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: 'what comes after 5?'}],
            max_tokens: 15,
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        console.log(data);
        res.send(data.choices[0].message)
    } catch (error){
        console.error(error)
    }
})









app.get('/api', async (req,res) => { // not working 
    try {
        const response = await main();
         res.send(response)
         console.log(response);
         

        // const data = await res.json(response)
        // res.send(data)
       
    } catch (error) {
        console.log('Error: ' +  error );
        res.status(500).send('Internal server error')
    }
}) 

app.get('/quiz', (req,res) => { // works but isn't reading quiz.js
   
    fs.readFile('./src/quiz.html', (error, data) => {
        res.write(data)
        res.end()
    })

})

app.listen(6747, () => {
    console.log('Listen on port 6747');
})