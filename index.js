const express = require("express");
const app = express();
const mongoose = require("mongoose");
const  path = require("path");
const chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

app.set("views", path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));


main()
.then(() => {
    console.log('Server is running');
})
.catch((err) => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

//-------------------------ROUTES-------------------------------
app.get("/chats", async (req, res) => {
   let chats = await chat.find();
   console.log(chats);
   res.render("index.ejs",{chats});
});

//new route
app.get("/chats/new", (req, res) => {
    throw new ExpressError(404, "page not found");
    res.render("new.ejs");
});

//create route
app.post("/chats",  (req, res) => {
    let { from, to, msg } = req.body;
    let newChat = new chat({
        from: from,
        to: to,
        msg: msg,
        created_at: new Date(),
});

newChat
.save()
.then((res) => {
    console.log("chat was saved");
})
.catch((err) => {
    console.log(err);
});
res.redirect("/chats");
});

// show route
app.get('/chats/:id', async (req, res)=>{
    let {id} = req.params;
    let chat = await chat.findById(id);
    res.render("edit.ejs", {chat});
    });

//edit route
app.get("/chats/:id/edit", async (req, res) => {
    let {id} = req.params;
    let chat = await chat.findById(id);
    res.render("edit.ejs",{chat});
});


app.get("/", (req, res) => {
    res.send("root is working");
});

//Error Handling middleware
app.use((err, req,  res, next) => {
    let {status = 500, message = "some error Occurred"} = err;
    res.status(status).send(message);
    });

app.listen(8080, () => {
  console.log("Server is running on port 8080");
  });
