import axios from 'axios';
import { useState } from 'react';

import './App.css';

const App = () => {
  // State Management:
  // initialize state variable 'file'
  // declare function 'setFile' to update 'file'
  // 'file' set to (null)
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);

  // Event Handler:
  // triggered when user selects a file on input element
  // update 'file' state variable with setFile
  // retrieve first file selected
  const handleFileSelect = (event) => {
    setFile(event.target.files[0]);
  }
  const handleUrlSearch = (event) => {
    setUrl(event.target.value);
  }

  // Form Submission:
  // called on submit button
  const handleSubmit = async () => {
    try {
      // create a new 'FormData' object that doesn't exist initially
      // only if a file is selected, initialize the FormData object
      let formData = null;
      if (file) {
        formData = new FormData();
        formData.append('file', file);
      }

      // Post request:
      // await executing until response has been received from request
      // post data from 'formData' object or the url variable
      const response = await axios.post('https://api.trace.moe/search?cutBorders', formData || { url }, {
        headers: {
          // if file is selected, content-type =  image/*
          'Content-Type': file ? 'image/*' : 'application/json'
        }
      });

      console.log(response.data);
    } catch (e) {
      console.error('Error: ', e);
    }
  };

  const searchByUrl = async () => {
    try {
      const response = await axios.get(`https://api.trace.moe/search?url=${encodeURIComponent(url)}`);
      console.log(response.data);
    } catch (e) {
      console.error('Error: ', e);
    }
  }


  return (
    <>
      <div>
        <input type="file" onChange={handleFileSelect} value={file || ''}/>
        <button onClick={handleSubmit}>Submit</button>
        <input type="text" placeholder="Enter image URL" value={url || ''} onChange={handleUrlSearch} />
        <button onClick={searchByUrl}>search by URL</button>
      </div>
    </>
  )
}

export default App
