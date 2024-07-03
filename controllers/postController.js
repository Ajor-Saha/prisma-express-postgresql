import prisma from "../DB/db.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createPost = async (req, res) => {
  const { title, description } = req.body;
  const user_id = req.user?.id;

  // Check if user is authenticated
  if (!req.user) {
    return res
      .status(401)
      .json(new ApiResponse(false, 401, null, "Unauthorized request"));
  }

  // Validate input fields
  if (!title || !description) {
    return res
      .status(400)
      .json(
        new ApiResponse(false, 400, null, "Title and Description are required")
      );
  }

  try {
    // Create the new post
    const newPost = await prisma.post.create({
      data: {
        user_id: Number(user_id),
        title,
        description,
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(true, 201, newPost, "Post created successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, null, "Internal Server Error"));
  }
};

export const showPost = async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
      include: {
        user: { // Include the user who created the post
          select: {
            name: true, // Only select the user's name
          },
        },
        
      },
    });

    if (!post) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, null, 'No post found'));
    }

    return res
      .status(200)
      .json(new ApiResponse(true, 200, post, 'Post retrieved successfully'));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, null, 'Internal Server Error'));
  }
};



export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user?.id; // Get the authenticated user's ID

  try {
    // Check if the user is authenticated
    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, null, 'Unauthorized request'));
    }

    // Find the post to check ownership
    const post = await prisma.post.findUnique({
      where: {
        id: Number(postId),
      },
    });

    // Check if the post exists
    if (!post) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, null, 'Post not found'));
    }

    // Check if the user is the owner of the post
    if (post.user_id !== userId) {
      return res
        .status(403)
        .json(new ApiResponse(false, 403, null, 'Forbidden: You are not the owner of this post'));
    }

    // Delete the post
    await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(true, 200, {}, 'Post deleted successfully'));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, null, 'Internal Server Error'));
  }
};

export const searchPost = async (req, res) => {
  try {
    const query = req.query.q;
    const posts = await prisma.post.findMany({
      where: {
        description: {
          contains: query,
          mode: "insensitive", // Optional: to make the search case-insensitive
        },
      },
    });

    return res.json({ status: 200, data: posts });
  } catch (error) {
    return res.status(500).json({ status: 500, message: error.message });
  }
};



export const fetchPosts = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;

  // Validate pagination parameters
  if (page <= 0) {
    page = 1;
  }

  if (limit <= 0 || limit > 100) {
    limit = 10;
  }

  const skip = (page - 1) * limit;

  try {
    // Fetch posts with pagination and include comments and comment's user name
    const posts = await prisma.post.findMany({
      skip: skip,
      take: limit,
      include: {
        comment: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
      where: {
        NOT: {
          title: {
            endsWith: '4',
          },
        },
      },
    });

    // Fetch total posts count
    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / limit);

    // Return the response
    return res.status(200).json(
      new ApiResponse(true, 200, {
        posts,
        meta: {
          totalPages,
          currentPage: page,
          limit: limit,
        },
      }, 'Posts fetched successfully')
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json(
      new ApiResponse(false, 500, null, 'Internal Server Error')
    );
  }
};