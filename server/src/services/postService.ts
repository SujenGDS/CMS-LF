import { PostModel, Post } from "../models/postModel";
import cloudinary from "../config/cloudinary";

export class PostService {
  private postModel: PostModel;

  constructor() {
    this.postModel = new PostModel();
  }

  async createPost(postData: Post): Promise<number> {
    if (!postData.title || !postData.body) {
      throw new Error("Title and body are required");
    }
    return await this.postModel.createPost(postData);
  }

  async getAllPosts() {
    return await this.postModel.getAllWithAuthors();
  }

  async getPostById(id: number) {
    const post = await this.postModel.getByIdWithAuthor(id);
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  }

  async updatePost(
    id: number,
    authorId: number,
    postData: Partial<Post>
  ): Promise<void> {
    const affectedRows = await this.postModel.updatePost(
      id,
      authorId,
      postData
    );
    if (affectedRows === 0) {
      throw new Error("Not allowed or post not found");
    }
  }

  async deletePost(id: number, authorId: number): Promise<void> {
    const affectedRows = await this.postModel.deletePost(id, authorId);
    if (affectedRows === 0) {
      throw new Error("Not allowed or post not found");
    }
  }

  async getMyPosts(authorId: number) {
    return await this.postModel.getPostsByAuthor(authorId);
  }

  async uploadImage(filePath: string): Promise<string> {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "posts",
    });
    return result.secure_url;
  }
}
