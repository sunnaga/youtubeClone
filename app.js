const express = require('express')
const ejs = require('ejs')
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const { error } = require('console');

const app = express()

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sunnaga2020',
    database: 'youtube_clone'
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));


app.get('/', (req, res) => {
    const sql = 'SELECT * from videostorage'

    db.query(sql, (err, result) => {
        if (err) return res.send("Database error")

        res.render('home', { data: result });
    })
});


app.get('/upload', (req, res) => {
    res.render('upload')
})

app.get('/player', (req, res) => {
    const videoURL = req.query.video;
    res.render('player', { videoURL });
})

app.post('/player', (req, res) => {
    const {id} = req.body;

    console.log(id)

    const sql = "select * from videostorage where id = ?"
    const sql2 = "SELECT * FROM videostorage WHERE id != ?"

    db.query(sql,[id],(err,firstresult)=>{
        db.query(sql2,[id],(err,result)=>{
            res.render('player', { video: firstresult[0] ,data: result });  
        })
    })

})

app.post('/upload', (req, res) => {
    const { video_thumbnail, video_url, video_name, description } = req.body

    const sql = 'INSERT INTO videostorage (video_thumbnail,video_URL, video_name, video_description) VALUES (?, ?, ?,?)';
    db.query(sql, [video_thumbnail, video_url, video_name, description], (err, result) => {
        if (err) {
            console.error(err)
        }
        res.redirect('/')
    })
})

app.listen(3000, () => {
    console.log('running...')
})
