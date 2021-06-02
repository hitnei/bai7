const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.post('/api/v1/auth', (req, res) => {
    console.log(req.body);
});

const port = 3000
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})