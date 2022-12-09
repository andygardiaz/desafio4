
const fs = require ('fs')


class Contenedor {

  constructor( file ) {
      this.file = file
  }

  
  async getAll() {
    try{
      const objects = await fs.promises.readFile( this.file, 'utf-8')
      return JSON.parse(objects)

    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }
 
  
  async saveFile ( objects ) {
    try {
      await fs.promises.writeFile(
        this.file, JSON.stringify( objects, null, 2 )
        )
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }


  async save( object ) {
    const objects = await this.getAll()
    try{
        let idNew
        objects.length === 0 
          ? idNew = 1
          : idNew = objects[ objects.length - 1 ].id + 1
        
        const objectNew = { id: idNew, ...object }       
        objects.push(objectNew)        
        await this.saveFile( objects )
        return idNew

    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }


  async getById( id ) {
    const objects = await this.getAll()
    try {
      const object = objects.find( ele => ele.id === id)
      return object ? object : null

    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }


  async deleteById( id ) {
    let objects = await this.getAll()
    
    try {
      objects = objects.filter( ele => ele.id != id )
      await this.saveFile( objects )
    
    } catch(err) {
      console.log(`Error: ${err}`)
    }
  }


  async deleteAll() {
    await this.saveFile(this.file, [])
  }

}


module.exports = Contenedor