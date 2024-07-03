import prisma from "../DB/db.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createComment = async (req, res) => {
  const { post_id, comment } = req.body;
  const user_id = req.user?.id;

  try {
    if (!req.user) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, null, "Unauthorized request"));
    }

    if (!post_id || !comment) {
      return res
        .status(400)
        .json(
          new ApiResponse(false, 400, null, "post_id and comment are required")
        );
    }

    const postExists = await prisma.post.findUnique({
      where: {
        id: Number(post_id),
      },
    });

    if (!postExists) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, null, "Post not found"));
    }

    await prisma.post.update({
      where: {
        id: Number(post_id),
      },
      data: {
        comment_count: {
          increment: 1,
        },
      },
    });

    const newComment = await prisma.comment.create({
      data: {
        user_id: Number(user_id),
        post_id: Number(post_id),
        comment,
      },
    });

    return res
      .status(201)
      .json(
        new ApiResponse(true, 201, newComment, "Comment created successfully.")
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, null, "Internal Server Error"));
  }
};

export const showComment = async (req, res) => {
  const commentId = req.params.id;

  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!comment) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, null, "Comment not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(true, 200, comment, "Comment retrieved successfully")
      );
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, null, "Internal Server Error"));
  }
};

// * Delete user
export const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user?.id;
  const { post_id } = req.body;

  try {
    if (!userId) {
      return res
        .status(401)
        .json(new ApiResponse(false, 401, null, "Unauthorized request"));
    }

    const post = await prisma.post.findUnique({
      where: { id: Number(post_id) },
    });

    if (!post) {
      return res
        .status(404)
        .json(new ApiResponse(false, 404, null, "Post not found"));
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.user_id !== userId) {
      return res
        .status(403)
        .json(
          new ApiResponse(false, 403, null, "Forbidden: Not the comment owner")
        );
    }

    await prisma.post.update({
      where: {
        id: Number(post_id),
      },
      data: {
        comment_count: {
          decrement: 1,
        },
      },
    });

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(true, 200, null, "Comment deleted successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, null, "Internal Server Error"));
  }
};

export const fetchComments = async (req, res) => {
  const postId = req.params.postId;

  try {
    const comments = await prisma.comment.findMany({
      where: {
        post_id: Number(postId),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(true, 200, comments, "Comments fetched successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiResponse(false, 500, null, "Internal Server Error"));
  }
};
