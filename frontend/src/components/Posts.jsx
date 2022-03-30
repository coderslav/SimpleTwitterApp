import React from 'react';
import update from 'immutability-helper';
import PostService from '../postService';

// let generatedPosts = [];
// for (let index = 1; index < randNumber({ max: 51 }); index++) {
//     generatedPosts.push({
//         id: index,
//         text: randLine(),
//         likesCount: randNumber(),
//         date: randPastDate().toLocaleString(),
//     });
// }
const postService = new PostService();
export default class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            inputValue: '',
        };
    }
    getData = () => {
        postService.getPosts().then((data) => {
            if (data.length > 0) {
                this.setState({ data });
            } else {
                console.log('ERROR getData!', data);
            }
        });
    };
    handleChange = (event) => {
        this.setState({ inputValue: event.target.value });
    };
    handleSubmit = () => {
        const text = this.state.inputValue;
        this.setState({ inputValue: '' });
        postService.createPost(text).then((status) => {
            if (status === 200) {
                console.log('Post was saved in DB');
                this.getData();
            } else {
                console.log('ERROR handleSubmit!', status);
            }
        });
    };
    setLike = (post) => {
        const index = this.state.data.indexOf(post);
        // How to use update() feature https://github.com/kolodny/immutability-helper
        const newState = update(this.state, { data: { [index]: { likesCount: { $set: post.likesCount + 1 } } } });
        this.setState(newState);
        postService.addLikeToPost(post.id).then((newLikesCount) => {
            if (newLikesCount === this.state.data[index].likesCount) {
                console.log('Лайк удачно сохранен в базу данных. Новое количество лайков: ', newLikesCount);
            } else {
                console.log('ERROR setLike!', newLikesCount);
            }
        });
    };
    deletePost = (post) => {
        postService.deletePost(post.id).then((status) => {
            if (status === 200) {
                const index = this.state.data.indexOf(post);
                const newState = update(this.state, { data: { $splice: [[index, 1]] } });
                this.setState(newState);
                console.log(`Post ${post.text} was successfully deleted`);
            } else {
                console.log('ERROR deletePost!', status);
            }
        });
    };
    componentDidMount() {
        console.log('Did Mount!');
        this.getData();
    }
    render() {
        return (
            <div className='posts'>
                {this.state.data.length > 0
                    ? this.state.data.map((post) => (
                          <div key={post.id} className={`post post-${post.id}`}>
                              <p> {post.text} </p>
                              <button onClick={() => this.setLike(post)}> {post.likesCount}</button>
                              <button onClick={() => this.deletePost(post)}>Delete</button>
                              <p> Date: {post.date}</p>
                              <hr />
                          </div>
                      ))
                    : ''}
                <input type='text' onChange={this.handleChange} value={this.state.inputValue}></input>
                <button onClick={this.handleSubmit}>Send</button>
            </div>
        );
    }
}
