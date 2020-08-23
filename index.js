const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const session = require('express-session')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const homeRoutes = require('./routes/home')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const cardRoutes = require('./routes/card')
const authRoutes = require('./routes/auth')
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')

const app = express()

app.engine('handlebars', expressHandlebars({
	handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', 'handlebars')
app.set('views', 'views')

app.use(async (req, res, next) => {
	try {
		const user = await User.findById('5f37f94df58d9a034341a197')
		req.user = user
		next()
	} catch (e) {
		console.log(e)
	}
})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
	secret: 'some secret value',
	resave: false,
	saveUninitialized: false
}))
app.use(varMiddleware)

app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start() {
	try {
		const url = `mongodb+srv://pch2103:YXpHETPK8JJ2dlqZ@cluster0.w8wgc.mongodb.net/shop`
		await mongoose.connect(url, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		})

		const candidate = await User.findOne()
		if (!candidate) {
			const user = new User({
				email: 'pch2103@gmail.com',
				name: 'pch2103',
				cart: {items: []}
			})
			await user.save()
		}

		app.listen(PORT, () => {
			console.log(`Server is running on ${PORT}`)
		})
	} catch (e) {
		console.log('ERROR', e)
	}
}

start()


// const user = 'pch2103'
// const password = 'YXpHETPK8JJ2dlqZ'
// const url = `mongodb+srv://pch2103:YXpHETPK8JJ2dlqZ@cluster0.w8wgc.mongodb.net/<dbname>?retryWrites=true&w=majority`

