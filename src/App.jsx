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
  // 
  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('https://api.trace.moe/search', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
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
