import axios from 'axios';
const API_URL = 'http://127.0.0.1:8000';

export default class PostService {
    async getPosts() {
        return await axios.get(`${API_URL}/api/posts`).then((response) => response.data.data);
    }
    async createPost(text) {
        return await axios.post(`${API_URL}/api/posts`, { text }).then((response) => response.status);
    }
    async deletePost(postId) {
        console.log(postId);
        return await axios.delete(`${API_URL}/api/posts`, { data: { id: postId } }).then((response) => response.status);
    }
    async addLikeToPost(postId) {
        return await axios.get(`${API_URL}/api/like_post/${postId}`).then((response) => response.data);
    }
}
