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
  const [searchResults, setSearchResults] = useState([]);

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

      setSearchResults(response.data.result);
    } catch (e) {
      console.error('Error: ', e);
    }
  };

  const searchByUrl = async () => {
    try {
      const response = await axios.get(`https://api.trace.moe/search?url=${encodeURIComponent(url)}`);
      setSearchResults(response.data.result);
    } catch (e) {
      console.error('Error: ', e);
    }
  }
  
  const uniqueAnilistIds = [...new Set(searchResults.map(result => result.anilist.id))];


  return (
    <>
    <h1 className='text-center my-10 text-2xl font-semibold'>Anime Scene Search</h1>
      <div className='w-full flex items-center justify-center text-center'>
        <div className=''>
        <div className=''>
        <input 
          type="file" 
          onChange={handleFileSelect} 
          className='w-1/2 text-sm text-gray-500
                     file:me-4 file:py-2.5 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-400'
        />


        


        <button 
          onClick={handleSubmit}
          className='py-2 px-4 ml-10 rounded-lg border-0 font-semibold
                     bg-blue-500 text-white hover:bg-blue-400'
          >Search by file
        </button>
        </div>
        <div className='mb-8'>
        <input 
          type="text" 
          placeholder="Enter image URL" 
          value={url || ''} 
          onChange={handleUrlSearch} 
          className='py-2 px-4 w-1/2 border-blue-500 rounded-lg text-sm'
        />

        <button 
          onClick={searchByUrl}
          className='py-2 px-4 ml-10 rounded-lg border-0 font-semibold
                     bg-blue-500 text-white hover:bg-blue-400'
          >Search by URL
        </button>
        </div>
        
      
        {uniqueAnilistIds.map(anilistId => {
          // Find the first result with the current anilistId
          const result = searchResults.find(result => result.anilist.id === anilistId);
          if (result && result.similarity >= 0.9) {
            return (
              <div 
                key={result.anilist.id}
                className='flex flex-col items-center justify-center'
              >
                <p className=''>Similarity: {Math.round(result.similarity * 100)}%</p>
                <video className='' controls>
                  <source src={result.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            );
          } else {
            return null; // Skip rendering if similarity is below 0.9 or result is undefined
          }
        })}
        </div>
      </div>
      
    </>
  )
}

export default App
