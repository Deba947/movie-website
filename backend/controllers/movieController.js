import movieModel from "../models/movieModel.js";
import queueModel from "../models/queueModel.js";

/* ======================== ADD MOVIE ======================== */
export const addMovie = async (req, res) => {
  try {
    if (!req.files?.image) {
      return res.status(400).json({
        success: false,
        message: "Movie poster is required"
      });
    }

    const sceneImages = req.files.sceneImages || [];

    if (sceneImages.length > 6) {
      return res.status(400).json({
        success: false,
        message: "Maximum 6 scene images allowed"
      });
    }

    const movieData = {
      title: req.body.title,
      description: req.body.description,
      rating: Number(req.body.rating),
      releaseDate: new Date(req.body.releaseDate),
      duration: Number(req.body.duration),
      genre: req.body.genre,
      director: req.body.director,
      cast: req.body.cast ? JSON.parse(req.body.cast) : [],
      image: req.files.image[0].path, // ✅ Cloudinary URL
      sceneImages: sceneImages.map(f => f.path), // ✅ Cloudinary URLs
      createdBy: req.body.userId || null
    };

    const queueItem = new queueModel({
      operation: "insert",
      data: movieData
    });

    await queueItem.save();
    processQueue();

    res.status(201).json({
      success: true,
      message: "Movie added successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while adding movie"
    });
  }
};

/* ======================== LIST MOVIES ======================== */
export const listMovies = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const movies = await movieModel
      .find({})
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await movieModel.countDocuments();

    res.json({
      success: true,
      data: movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching movies" });
  }
};

/* ======================== SORT MOVIES ======================== */
export const getSortedMovies = async (req, res) => {
  try {
    const { sortBy, order } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    let sortOption = { createdAt: -1 };

    if (sortBy === "name") sortOption = { title: order === "desc" ? -1 : 1 };
    if (sortBy === "rating") sortOption = { rating: order === "desc" ? -1 : 1 };
    if (sortBy === "releaseDate") sortOption = { releaseDate: order === "desc" ? -1 : 1 };
    if (sortBy === "duration") sortOption = { duration: order === "desc" ? -1 : 1 };

    const movies = await movieModel
      .find({})
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    const total = await movieModel.countDocuments();

    res.json({
      success: true,
      data: movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error sorting movies" });
  }
};

/* ======================== SEARCH MOVIES ======================== */
export const searchMovies = async (req, res) => {
  try {
    const { query } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required"
      });
    }

    const filter = {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    };

    const movies = await movieModel.find(filter).skip(skip).limit(limit);
    const total = await movieModel.countDocuments(filter);

    res.json({
      success: true,
      data: movies,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error searching movies" });
  }
};

/* ======================== GET SINGLE MOVIE ======================== */
export const getMovie = async (req, res) => {
  try {
    const movie = await movieModel.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    res.json({ success: true, data: movie });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching movie" });
  }
};

/* ======================== UPDATE MOVIE ======================== */
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await movieModel.findById(id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found"
      });
    }

    const updateData = {
      title: req.body.title ?? movie.title,
      description: req.body.description ?? movie.description,
      rating: req.body.rating ? Number(req.body.rating) : movie.rating,
      releaseDate: req.body.releaseDate ? new Date(req.body.releaseDate) : movie.releaseDate,
      duration: req.body.duration ? Number(req.body.duration) : movie.duration,
      genre: req.body.genre ?? movie.genre,
      director: req.body.director ?? movie.director,
      cast: req.body.cast ? JSON.parse(req.body.cast) : movie.cast
    };

    if (req.files?.image) {
      updateData.image = req.files.image[0].path; // Cloudinary URL
    }

    if (req.files?.sceneImages) {
      if (req.files.sceneImages.length > 6) {
        return res.status(400).json({
          success: false,
          message: "Maximum 6 scene images allowed"
        });
      }
      updateData.sceneImages = req.files.sceneImages.map(f => f.path);
    }

    const queueItem = new queueModel({
      operation: "update",
      data: { id, updateData }
    });

    await queueItem.save();
    processQueue();

    res.json({
      success: true,
      message: "Movie updated successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating movie" });
  }
};

/* ======================== DELETE MOVIE ======================== */
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const queueItem = new queueModel({
      operation: "delete",
      data: { id }
    });

    await queueItem.save();
    processQueue();

    res.json({
      success: true,
      message: "Movie deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting movie" });
  }
};

/* ======================== QUEUE PROCESSOR ======================== */
async function processQueue() {
  const items = await queueModel.find({ status: "pending" }).limit(10);

  for (const item of items) {
    try {
      item.status = "processing";
      await item.save();

      if (item.operation === "insert") {
        await new movieModel(item.data).save();
      }

      if (item.operation === "update") {
        await movieModel.findByIdAndUpdate(item.data.id, item.data.updateData);
      }

      if (item.operation === "delete") {
        await movieModel.findByIdAndDelete(item.data.id);
      }

      item.status = "completed";
      await item.save();
    } catch (err) {
      item.retryCount += 1;
      item.status = item.retryCount >= item.maxRetries ? "failed" : "pending";
      item.error = err.message;
      await item.save();
    }
  }
}

setInterval(processQueue, 5000);
