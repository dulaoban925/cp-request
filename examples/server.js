const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const atob = require('atob')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const path = require('path')

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
    publicPath: '/__build__/',
    stats: {
        colors: true,
        chunks: false
    }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname, {
    setHeaders(res) {
        res.cookie('XSRF-TOKEN-D', '1234abc')
    }
}))

app.use(bodyParser.json())
// app.use(bodyParser.text())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(cookieParser())

const router = express.Router()

registerSimpleRouter()

registerBaseRouterGet()

registerBaseRouterPost()

registerErrorRouter()

app.use(router)

const port = process.env.PORT || 8181
module.exports = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})

function registerSimpleRouter() {
    router.get('/simple/get', function(req, res) {
        res.json({
            msg: `hello world`
        })
    })
}

function registerBaseRouterGet() {
    router.get('/base/get', function(req, res) {
        res.json({
            msg: 'hello base'
        })
    })
}

function registerBaseRouterPost() {
    router.post('/base/post', function(req, res) {
        res.json(req.body)
    })

    router.post('/base/buffer', function(req, res) {
        let msg = [];
        req.on('data', (chunk) => {
            if (chunk) {
                msg.push(chunk)
            }
        })
        req.on('end', () => {
            let buf = Buffer.concat(msg)
            res.json(buf.toJSON());
        })
    })
}

function registerErrorRouter() {
    router.get('/error/get', function(req, res) {
        if (Math.random() > 0.5) {
            res.json({
                msg: `hello world`
            })
        } else {
            res.status(500)
            res.end()
        }
    })

    router.get('/error/timeout', function(req, res) {
        setTimeout(() => {
            res.json({
                msg: `hello world`
            })
        }, 3000)
    })
}