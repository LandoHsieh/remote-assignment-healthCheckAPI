import express from 'express'

const app = express()
const PORT = 3000

app.use(express.json())

app.get('/healthcheck', (req, res) => {
    res.send("OK")
})

app.listen(PORT, (err, res) => {
    console.log(`Server is running on http://localhost:${PORT}`)
})