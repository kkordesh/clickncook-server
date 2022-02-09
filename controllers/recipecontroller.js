const router = require



router.post("/", async (req, res) =>{

    try {
        const createRecipe = await RecipeModel.create({
            nameOfRecipe: req.body.nameOfRecipe,
            directions: req.body.directions,
            timeToCook: req.body.timeToCook,
            servings: req.body.servings,
            category: req.body.category,
            image: req.body.image,
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