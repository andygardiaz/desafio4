
const express = require('express')
const { Router } = express

const app = express()

const apiRouter = Router()

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))


const Contenedor = require('./contenedor.js')
const productos = new Contenedor('productos.txt')


/* ROUTER apiRouter */
app.use('/api', apiRouter)

/*get productos*/
apiRouter.get('/productos', async (req, res) => {
  const allProducts = await productos.getAll()
  res.json( allProducts )
})

/*get producto segun id*/
apiRouter.get('/productos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const producto = await productos.getById( id )
  producto ? res.json( producto )
    : res.status(404).send({ error: 'producto no encontrado'})
})

/*post producto*/
apiRouter.post('/productos', async (req, res) => {
  const productoToAdd = req.body
  const idNew = await productos.save( productoToAdd )
  res.send({ idNew })
})


/*put producto*/
apiRouter.put('/productos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const productoToModify = req.body

  if(await productos.getById( id )){
    let allProducts = await productos.getAll()
    allProducts[ id - 1 ] = {"id": id, ...productoToModify}
    productos.saveFile( allProducts )
    res.send({ productoToModify })
  } else {
    res.status(404).send({ error: 'id no valido'})
  }
})


/*delete producto*/
apiRouter.delete('/productos/:id', async (req, res) => {
  const id = Number(req.params.id)
  const productoToDelete = await productos.getById( id )

  if (productoToDelete) {
    await productos.deleteById( id )
    res.send({ borrado: productoToDelete})
  } else {
    res.status(404).send({ error: 'producto no encontrado'})
  }
})




app.listen(8080, () => console.log('listining on 8080'))

