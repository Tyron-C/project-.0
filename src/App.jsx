import axios from 'axios';
import { useState } from 'react';

import './App.css';

const App = () => {
  // State Management:
  // initialize state variable 'file'
  // declare function 'setFile' to update 'file'
  // 'file' set to (null)
  const [file, setFile] = useState(null);

  // Event Handler:
  // triggered when user selects a file on input element
  // update 'file' state variable with setFile
  // retrieve first file selected
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  // Form Submission:
  // called on submit button
  const handleSubmit = async () => {
    try {
      // create a new 'FormData' object
      const formData = new FormData();
      // append selected file to object
      // assign key-name 'file' 
      // value is the file stored in the state variable obtained from the input element
      formData.append('file', file);

      // Post request:
      // await executing until response has been received from request
      // post data from 'formData' object
      const response = await axios.post('https://api.trace.moe/search', formData, {
        headers: {
          // specify content type of data sent to be an image with any subtype (JPEG, PNG, GIF...)
          'Content-Type': 'image/*'
        }
      });

      console.log(response.data);
    } catch (e) {
      console.e('Error:', e);
    }
  };


  return (
    <>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </>
  )
}

export default App
