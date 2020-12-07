const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
const studentArray = require("./InitialData");
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here
let counter = studentArray.length + 1;

app.get("/api/student", (req, res) => {
    res.send(studentArray);
})

app.get("/api/student/:id", (req, res) => {
    const obj = studentArray.find(student => student.id == req.params.id);
    if(obj == undefined)
        res.sendStatus(404);

    res.send(obj);
})

app.post("/api/student", (req, res) => {
    const obj = req.body;
    
    if(obj.hasOwnProperty('name') && obj.hasOwnProperty('currentClass') && obj.hasOwnProperty('division')) {
        obj.id = counter;
        counter++;
        studentArray.push(obj);
        res.send({"id": obj.id});
    } else { res.sendStatus(400); }
})

app.put("/api/student/:id", (req, res) => {
    const objInd = studentArray.findIndex(student => student.id == req.params.id);
    if(objInd === -1)
        res.sendStatus(400);
    else {    
        let flag = false;
        for(let i=0; i<Object.keys(req.body).length; i++) {
            if(["name", "currentClass", "division"].indexOf(Object.keys(req.body)[i]) !== -1) {}
            else {
                flag = true;
                break;
            }
        }
        if(flag)
            res.sendStatus(400);
        else {
            studentArray[objInd].name = req.body.name !== undefined? req.body.name : studentArray[objInd].name;
            studentArray[objInd].currentClass = req.body.currentClass !== undefined? req.body.currentClass : studentArray[objInd].currentClass;
            studentArray[objInd].division = req.body.division !== undefined? req.body.division : studentArray[objInd].division;
            res.send(studentArray[objInd]);
        }   
    }  
})

app.delete("/api/student/:id", (req, res) => {
    const ind = studentArray.findIndex(student => student.id == req.params.id);
    
    if(ind === -1)
        res.sendStatus(404);
    else  {
        const obj = studentArray[ind];
        studentArray.splice(ind, 1);
        res.send(obj);  
    }  
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   