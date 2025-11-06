import Recipe from "../models/recipeModel.js";

// @desc    Add a new recipe for the user
// @route   POST /api/recipes
// @access  Private
export const addRecipe = async (req, res) => {
  try {
    const { title, description, ingredients, steps, doshaType, isPublic } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required"
      });
    }

    const recipe = await Recipe.create({
      user: req.user._id,
      title,
      description,
      ingredients: ingredients ? ingredients.split('\n').map(i => i.trim()).filter(i => i) : [],
      steps: steps || "",
      doshaType: doshaType || "Tridoshic",
      isPublic: isPublic || false,
    });

    await recipe.populate('user', 'name email');

    res.status(201).json({
      success: true,
      recipe,
    });
  } catch (error) {
    console.error("addRecipe error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Get all recipes for the authenticated user
// @route   GET /api/recipes
// @access  Private
export const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      recipes,
    });
  } catch (error) {
    console.error("getUserRecipes error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }

    // Check if recipe belongs to user
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    const { title, description, ingredients, steps, doshaType, isPublic } = req.body;

    recipe.title = title || recipe.title;
    recipe.description = description || recipe.description;
    recipe.ingredients = ingredients ? ingredients.split('\n').map(i => i.trim()).filter(i => i) : recipe.ingredients;
    recipe.steps = steps || recipe.steps;
    recipe.doshaType = doshaType || recipe.doshaType;
    recipe.isPublic = isPublic !== undefined ? isPublic : recipe.isPublic;

    const updatedRecipe = await recipe.save();
    await updatedRecipe.populate('user', 'name email');

    res.json({
      success: true,
      recipe: updatedRecipe,
    });
  } catch (error) {
    console.error("updateRecipe error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found"
      });
    }

    // Check if recipe belongs to user
    if (recipe.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    await Recipe.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Recipe deleted successfully"
    });
  } catch (error) {
    console.error("deleteRecipe error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Get public recipes (optional feature)
// @route   GET /api/recipes/public
// @access  Public
export const getPublicRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ isPublic: true })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      recipes,
    });
  } catch (error) {
    console.error("getPublicRecipes error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
