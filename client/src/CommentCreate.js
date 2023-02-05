import React, {useState} from 'react';
import axios from 'axios';
const CommentCreate = ({ postId }) => {
    const [content, setContent] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post(`http://localhost:4001/posts/${postId}/comments`, {
            content: content
        });
        setContent('');
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label >New Comment</label>
                    <input value = {content} onChange = {e => setContent(e.target.value)} type="text" className="form-control" />
                </div>
                <button className='btn btn-primary mt-2'>Submit</button>
            </form>
        </div>
    )
}

export default CommentCreate