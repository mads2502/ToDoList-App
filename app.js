//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");


const app = express();
const port=process.env.PORT||3000
//establishing connection
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true,useUnifiedTopology:true});
//var items=[];
const itemsSchema=new mongoose.Schema({
  name:String
});
const Item=mongoose.model("Item",itemsSchema);
const task1=new Item({
  name:"Read newspaper"
});
const task2=new Item({
  name:"Mend the garden"
});
const task3=new Item({
  name:"Repair the clock"
});
const taskArray=[task1,task2,task3]



app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/", function(req, res){
  var tdy=new Date();
  var options={
    weekday:"long",
    month:"long",
    day:"numeric"
  }
    var d=tdy.toLocaleString("en-US",options);

  Item.find(function(err,tasks){
    if(err){
      console.log(err)
    }
    else if(tasks.length===0){
      Item.insertMany(taskArray,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfully added");
        }
      });
    }
    else{
      if(d){
        res.render("list",{kindofDay:d,listitems:tasks});
      }
  }
  });


  //res.send("Hello");
});
app.post("/",(req,res)=>{
  const task=req.body.task;
  const newtask=new Item({
    name:task
  })
  Item.insertMany([newtask],function(err,mssg){
    if(err){
      console.log(err);
    }
    else{
      console.log("Succesfully added new task");
      res.redirect('/');
    }
  })

});
app.post("/delete",function(req,res){
  console.log(req.body.checkbox);
  Item.findByIdAndRemove(req.body.checkbox,function(err){
    if(err){
      console.log("From delete:",err);
    }
    else{
      console.log("Deleted successfully");
    }
    res.redirect("/");
  })
})
app.listen(port, function(){
  console.log("Server started on port 3000.");
});
