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
//https://api.openai.com/v1/completions


const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static('public')); //not working 





app.get('/', (req, res) => {
    res.send("ello from backend ")
})
// change to app.get for the route to work 
// app.get('/complet', async (req,res) => {
//     req.params.type

    
//     const options = {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${API_KEY}`,
//             'Content-type': 'application/json'
//         },
//         body: JSON.stringify({
//             model: 'gpt-3.5-turbo',
//             messages: [{role: 'user', content: 'test'}],
//             max_tokens: 15,
//         })
//     }
//     try {
//         const response = await fetch('https://api.openai.com/v1/chat/completions', options)
//         const data = await response.json()
//         console.log(data);
//         res.send(data.choices[0].message)
//     } catch (error){
//         console.error(error)
//     }
// })









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

app.post('/grade', async (req, res) => {
    const question = req.query.question;
    const answer = req.query.answer;

    const prompt = `compare the answer to the question: ${question} and the answer: ${answer} give a percent rating of how accurate the answer was an an explanation of why the answer was rated that way`

    const options = {

        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: prompt}],
            max_tokens: 300,
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        console.log(data);
        console.log(JSON.stringify(data.choices[0].message))
        res.send(data.choices[0].message)
    } catch (error){
        console.error(error)
    }

})

app.post('/ask', async (req, res) => {
    const length = req.query.length;
    const topic = req.query.topic;
    const expertise = req.query.expertise;
    const style = req.query.style;

    const prompt = 
    `
        Create an open-ended ${length} question quiz
        Make it about ${topic}
        Make it on a ${expertise} level
        Make it in a ${style} accent
        Seperate questions by "~~", This is very important do not forget the "~~"
    `

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{role: 'user', content: prompt}],
            max_tokens: 300,
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        console.log(data);
        console.log(JSON.stringify(data.choices[0].message))
        res.send(data.choices[0].message)
    } catch (error){
        console.error(error)
    }

})


app.listen(6747, () => {
    console.log('Listen on port 6747');
})