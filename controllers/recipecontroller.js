
const router = require("express").Router(); // way to merge lines 1 and 2! 
let validateJWT = require("../middleware/validate-session")
const { RecipeModel } = require("../model")



// CREATE RECIPE 

router.post("/", validateJWT, async (req, res) =>{
    const { id } = req.user;

    try {
        const createRecipe = await RecipeModel.create({
            nameOfRecipe: req.body.nameOfRecipe,
            directions: req.body.directions,
            timeToCook: req.body.timeToCook,
            servings: req.body.servings,
            category: req.body.category,
            image: req.body.image,
            owner_id: id 
        })

        console.log(createRecipe)

        res.status(201).json({
            message: "Recipe successfully created :)",
            createRecipe
        })

    } catch(err) {
        res.status(500).json({
            message: `Failed to create recipe ${err}`
        })
    }
})


// UPDATE RECIPE: 

router.put("/:id", validateJWT, async (req, res) => {
  const ownerid = req.user.id
    const {
        nameOfRecipe,
        directions,
        timeToCook,
        servings,
        category,
        image,
        
    } = req.body //faster way one lines 27-33. destructuring object. 

    try {
        await RecipeModel.update(
            { nameOfRecipe, directions, timeToCook, servings, category, image},
            { where: { id: req.params.id, owner_id: ownerid}, returning: true } //looking to update where the id in our database matches the id in our endpoint // return the effect that rose
        )
        .then((result) => {
            res.status(200).json({
                message: "Recipe successfully updated.",
                updatedRecipe: result 
            })
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to update recipe ${err}`
        })
    }
})


// Get ALL recipes 

router.get("/", async (req, res) => { // one / = just one route
    try {
     const allRecipes = await RecipeModel.findAll()  //searches for multiple instances of Pies..asynchronous method, so use await. 
     console.log(allRecipes)
 
     res.status(200).json(allRecipes)
 
    } catch(err) {
 
        res.status(500).json({
            error: err
        })
 
    }
 }) 


 // get recipes by user

 router.get("/:owner_id", validateJWT, async (req, res) => {
    let {owner_id} = req.params;
    try {
        const userRecipes = await RecipeModel.findAll({
            where: {
                owner_id: owner_id == 0 ? req.user.id : owner_id
                
            }
        });
        res.status(200).json(userRecipes);
    } catch (err) {
        res.status(500).json({ error: err});
    }
});   

// get recipes by category 

router.get("/category/:category", async (req, res) => {
    const {category} = req.params;
    try {
        const results = await RecipeModel.findAll({
            where: { category: category }
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err});
    }
});




// DELETE RECIPE

router.delete("/:id", validateJWT, async (req, res) =>{
    const ownerid = req.user.id; 
    
    try { 
      

      await RecipeModel.destroy({
          where: {id: req.params.id, owner_id: ownerid}
      })

      res.status(200).json({
          message: "Recipe successfully deleted"

      })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete recipe ${err}`
        })
    }

})



module.exports = router; 
