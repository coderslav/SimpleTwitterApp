import React from 'react';
import { randLine, randNumber, randPastDate } from '@ngneat/falso';
import update from 'immutability-helper';

// TODO delete after server relation
let generatedPosts = [];
for (let index = 1; index < randNumber({ max: 51 }); index++) {
    generatedPosts.push({
        id: index,
        text: randLine(),
        likesCount: randNumber(),
        date: randPastDate().toLocaleString(),
    });
}

export default class Posts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            inputValue: '',
        };
    }
    getData = () => {
        // TODO server relation
        this.setState({ data: generatedPosts });
    };
    handleChange = (event) => {
        this.setState({ inputValue: event.target.value });
    };
    handleSubmit = (event) => {
        console.log('Send to server new post', { text: this.state.inputValue }); // TODO server relation
        this.getData();
        this.setState({ inputValue: '' });
    };
    setLike = (post) => {
        // TODO server relation
        console.log('Send to server number of likes', post.likesCount);
        const index = this.state.data.indexOf(post);
        // How to use update() feature https://github.com/kolodny/immutability-helper
        const newState = update(this.state, { data: { [index]: { likesCount: { $set: post.likesCount + 1 } } } });
        this.setState(newState);
    };
    componentDidMount() {
        console.log('Did Mount!');
        this.getData();
    }
    render() {
        return (
            <div className='posts'>
                {this.state.data.map((post) => (
                    <div key={post.id} className={`post post-${post.id}`}>
                        <p> {post.text} </p>
                        <button onClick={() => this.setLike(post)}> {post.likesCount}</button>
                        <p> Date: {post.date}</p>
                        <hr />
                    </div>
                ))}
                <input type='text' onChange={this.handleChange} value={this.state.inputValue}></input>
                <button onClick={this.handleSubmit}>Send</button>
            </div>
        );
    }
}
