import express from "express";
// import main from './script.js'
import fs from "fs";
import cors from "cors";
import { config } from "dotenv";
config();

// const express = require('express')
// const path = require('path')
// const fs = require('fs')
// const cors = require('cors')
// const { config } = require( "dotenv")
// config();

const API_KEY = process.env.API_KEY;
//https://api.openai.com/v1/completions

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public")); //not working

app.get("/", (req, res) => {
  res.send("ello from backend ");
});
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

app.get("/api", async (req, res) => {
  // not working
  try {
    const response = await main();
    res.send(response);
    console.log(response);

    // const data = await res.json(response)
    // res.send(data)
  } catch (error) {
    console.log("Error: " + error);
    res.status(500).send("Internal server error");
  }
});

app.get("/quiz", (req, res) => {
  // works but isn't reading quiz.js

  fs.readFile("./src/quiz.html", (error, data) => {
    res.write(data);
    res.end();
  });
});

app.post("/grade", async (req, res) => {
  const question = req.query.question;
  const answer = req.query.answer;

  const prompt = `
        YOU ARE A PROFESSIONAL QUIZ QUESTION EVALUATOR
        You will put your entire being into evaluating quizzes to the best of your ability
        you will follow the following instructions to the letter
        Do not add or remove anything outside of the instructions

        you will compare the question: ${question}
        to the answer: ${answer}

        DO NOT BE EXTREMELY HARSH BE A BIT LENIENT BE FAIR AND BALANCED
        ANSWERS DO NOT HAVE TO BE PERFECT AND DO NOT NEED ADDITIONAL CONTEXT; GUESS THE CONTEXT IF NECESSARY
        DO NOT GIVE EXTREMELY LONG OR EXTREMELY SHORT EVALUATIONS
        KEEP EVALUATIONS TO THE POINT CONTAIN WITHIN 2-3 SENTENCES AND DO NOT ADD ANY EXTRA INFORMATION
        IF THE ANSWER IS WRONG PROVIDE THE CORRECT ANSWER WITHIN THE EXPLANATION

        FORMAT YOUR RESPONSE AS FOLLOWS: "yes/no (percent) because (explanation)" THIS IS EXTREMELY IMPORTANT DO NOT ADD EXTRA INFORMATION
    `;

  // `compare the answer to the question: ${question}
  // and the answer: ${answer}
  // give a percent rating of how accurate the answer was an an explanation of why the answer was rated that way
  // Format your response as follows: "yes/no (percent) because (explanation)"
  // `

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    }),
  };
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    console.log(data);
    console.log(JSON.stringify(data.choices[0].message));
    res.send(data.choices[0].message);
  } catch (error) {
    console.error(error);
  }
});

app.post("/ask", async (req, res) => {
  const length = req.query.length;
  const topic = req.query.topic;
  const expertise = req.query.expertise;
  const style = req.query.style;

  const prompt = `
        YOU ARE A QUIZMASTER YOUR ENTIRE EXISTENCE IS DEDICATED TO CREATING QUIZZES//
        You will put your entire being into creating the best quiz possible//
        you will follow the following instructions to the letter//
        Do not add or remove anything outside of the instructions//

        You will create a quiz about ${topic} assuming that a ${expertise} level of knowledge is required to answer the questions//
        The quiz will be in a ${style} accent and if it does not sound like it is in a ${style} accent you will rewrite it until it does//
        The quiz will be open-ended and will be ${length} questions long no more or no less//
        EACH QUESTION WILL BE SEPERATED BY "~~" THIS IS IMPORTANT DO NOT FORGET THE "~~"//
        
        ** VERY IMPORTANT -- THE LAST QUESTION SHOULD NOT INCLUDE THE "~~" **
        ** VERY IMPORTANT -- IF THERE ARE NO "~~" IN THE RESPONSE REWRITE THE RESPONSE **

        the formatting in which you will write the quiz is as follows DO NOT ADD ANY EXTRA INFORMATION//
        NO EXTRA HEADERS AND NO EXTRA FOOTERS ONLY EXACTLY HOW WRITTEN (the text after the numbers are justs a template):

     
  

        1. write the first question here ~~
        2. write the second question here ~~
        3. write the third question here ~~
        ...
        ${length}. write the last question here
        etc.

      

        The quiz will be in a ${style} accent and if it does not sound like it is in a ${style} accent you will rewrite it until it does
        The quiz will inclide two tildes after EVERY QUESTION EXCEPT THE LAST if it does not include two tilde you will rewrite it until it does

    `;
  // `
  //     Create an open-ended ${length} question quiz no more than ${length} and no less than ${length}
  //     Make it about ${topic}
  //     Make it on a ${expertise} level
  //     Make it in a ${style} accent
  //     Seperate questions by "~~", This is very important do not forget the "~~"
  // `

  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
    }),
  };
  try {
    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      options
    );
    const data = await response.json();
    // console.log(data);
    // console.log(JSON.stringify(data.choices[0].message));
    res.send(data.choices[0].message);
  } catch (error) {
    console.error(error);
  }
});

app.listen(6747, () => {
  console.log("Listen on port 6747");
});


