import React from 'react';
// import { randLine, randNumber, randPastDate } from '@ngneat/falso';
import update from 'immutability-helper';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

// let generatedPosts = [];
// for (let index = 1; index < randNumber({ max: 51 }); index++) {
//     generatedPosts.push({
//         id: index,
//         text: randLine(),
//         likesCount: randNumber(),
//         date: randPastDate().toLocaleString(),
//     });
// }

export default class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            inputValue: '',
        };
    }
    getData = () => {
        axios.get(`${API_URL}/api/posts`).then((response) => {
            this.setState({ data: response.data.data });
        });
    };
    handleChange = (event) => {
        this.setState({ inputValue: event.target.value });
    };
    handleSubmit = () => {
        const text = this.state.inputValue;
        this.setState({ inputValue: '' });
        axios.post(`${API_URL}/api/posts`, { text: text }).then((response) => {
            console.log(response.status);
            this.getData();
        });
    };
    setLike = (post) => {
        const index = this.state.data.indexOf(post);
        // How to use update() feature https://github.com/kolodny/immutability-helper
        const newState = update(this.state, { data: { [index]: { likesCount: { $set: post.likesCount + 1 } } } });
        this.setState(newState);
        axios.get(`${API_URL}/api/like_post/${post.id}`).then((response) => console.log('Лайк удачно сохранен в базу данных. Новое количество лайков:', response.data));
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
