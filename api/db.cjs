const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
 
const app = express();
 
app.use(express.json());
app.use(cors());
 
const port = 3336;

const db = mysql.createConnection({
    host: "localhost",
    port: 3336,
    user: "root",
    password:"password",
    database: "mydatabase"
})

app.get('/', (req,res) => {
    res.send('Привет API');
})


app.post('/register', (req, res) => {
    const email = req.body.email;
    const last_name = req.body.last_name;
    const first_name = req.body.first_name;
    const middle_name = req.body.middle_name;
    const password = req.body.password;
    const role = req.body.role;

    db.query("SELECT * FROM users WHERE email = ?", email, (err, result) => {
        if (err) {
            res.send({message: `${err}`});
        } else {
            if (result.length > 0){
                res.send({message: "Данный email уже был использован при регистрации"})
            } else{
                db.query("INSERT INTO users (email, last_name, first_name, middle_name, password, role) VALUES (?, ?, ?, ?, ?, 'user')", [email, last_name, first_name, middle_name, password, role],
                (err, result) => {
                    if(result){
                        res.send(result);
                    }else{
                        res.send({message: `${err}`})
                    }
                }
                )          
            }
        }
    })
})

app.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    
    db.query('SELECT * FROM users WHERE email = ? && password = ?', [email, password],
    (err, result) => {
        if(err){
            req.setEncoding({err: err});
        }
        else{
            if(result.length > 0){
                res.send({ message: "Успешный вход", user: result[0] });
            }else{
                res.send({message: "Неверная почта или пароль"})
            }
        }
    }
    )
})


app.post('/task/newtask', (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const userId = req.body.userId;

            db.query("INSERT INTO tasks (title, description, startTime, endTime, userId) VALUES (?, ?, ?, ?, ?)", [title, description, startTime, endTime, userId],
            (err, result) => {
                if(result){
                    res.send(result);
                }else{
                    res.send({message: `${err}`})
                }
            }
            )          
    });

    app.get('/task', (req, res) => {
        const userId = req.query.userId; // Здесь мы используем req.query для доступа к параметру запроса
      
        db.query('SELECT * FROM tasks WHERE userID = ?', [userId], (err, result) => {
          if (err) {
            res.send({ message: "Произошла ошибка при получении задач", error: err });
          }
          else {
            if (result.length > 0) {
              res.send({ message: "Задачи выведены", tasks: result });
            } else {
              res.send({ message: "Задачи отсутствуют" });
            }
          }
        });
      });


app.listen(port, () => {
    console.log(`Тестовое приложение рабоатет на порту ${port}`)
})