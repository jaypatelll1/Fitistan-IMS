require('dotenv').config();


class ShelfManager {

    static createShelf =async () => {
         try {
            const shelf = await shelfModel.create(req.body);
            // res.status(201).json(shelf);
        } catch (error) {
          throw new error ("asdjfhkahfkd")
        }

        
    }
  
 
}

module.exports = ShelfManager;
