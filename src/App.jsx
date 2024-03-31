import axios from 'axios';
import { useState } from 'react';

import './App.css';

const App = () => {

  // State management:
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Event handling:
  const handleInput = (event) => {

    // Determine type of input used in the event
    const inputType = event.target.type;
  
    if (inputType === 'file') { // If a file is selected...
      setFile(event.target.files[0]); // Set file state to selected file
    } else if (inputType === 'text') { // If there is a URL value...
      setUrl(event.target.value); // Set URL state to search value
    }
  }

  // Find the unique anilist IDs / no duplicate values
  // spread the set object into a new array containing the unique IDs
  const uniqueAnilistIds = [...new Set(searchResults.map(result => result.anilist.id))];


  // File / URL submission:
  const handleSubmit = async () => {
    try {

      // Set loading state to true
      setLoading(true);

      // Initialize empty formData
      let formData = null;

      // If there is a file selected...
      if (file) {
        formData = new FormData(); // Creates new FormData object 
        formData.append('file', file); // Create new key/value pair representing form fields and their values
      }

      // Store data pulled from POST request to API in response variable
      // If a file is selected, make POST request to API
      const response = file ? await axios.post('https://api.trace.moe/search?cutBorders', formData, {
        
        headers: {
          'Content-Type': 'image/*'
        }
      }) :
      // Otherwise,  make GET request with URL
      await axios.get(`https://api.trace.moe/search?url=${encodeURIComponent(url)}`);

      // Update searchResults state with data pulled from API
      setSearchResults(response.data.result);
    } catch (e) {
      console.error('Error: ', e); // If there's an error, log in console
    } finally {
      setLoading(false); // Finally set loading state back to false
    }
  };

  return (
    <>
      <h1 className='text-center my-10 text-2xl font-semibold'>Anime Scene Search</h1>
        <p className='text-center mb-7'
          >Upload a file of an image or a URL of an image hosted somewhere else <br/>
           The search will try to find the scene from the image you uploaded <br/>
           Higher than a 50% similarity.
        </p>
        <div className='w-full flex items-center justify-center text-center'>
          <div className=''>
            <div className=''>
              <input 
                type="file" 
                onChange={handleInput} 
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
                onChange={handleInput} 
                className='py-2 px-4 w-1/2 border-blue-500 rounded-lg text-sm'
              />

              <button 
                onClick={handleSubmit}
                className='py-2 px-4 ml-10 rounded-lg border-0 font-semibold
                           bg-blue-500 text-white hover:bg-blue-400'
                >Search by URL
              </button>
            </div>
        
            {/* If loading state is true, render loading spin */}
            {loading ? (
              <div className="flex items-center justify-center">

                <div className="animate-spin rounded-full h-12 
                                w-12 border-b-2 border-blue-500"
                >
                </div>
              </div>

            ) : (
              // Otherwise, map over the uniqueAnilistIds 
              uniqueAnilistIds.map(anilistId => {

                // Store the result corresponding to the anilist id 
                const result = searchResults.find(result => result.anilist.id === anilistId);

                // Check if there's a valid result >= 0.5
                if (result && result.similarity >= 0.5) {
                  return (
                    // Render video from result in a unique container for each result
                    <div 
                      key={result.anilist.id}
                      className='flex flex-col items-center justify-center'
                    >

                      <video 
                        controls 
                        className=''
                      >
                        <source 
                          src={result.video} 
                          type="video/mp4" 
                          />Your browser d1oes not support the video tag.
                      </video>

                      <p className=''
                        >Similarity: {Math.round(result.similarity * 100)}%
                      </p>
                    </div>
                  );
                } else {
                  return (
                    <>
                      <div>
                        <h2>No Results Found ):</h2> 
                      </div>
                    </>
                  ); 
                }
              })
            )}
          </div>
        </div> 
    </>
  )
}

export default App
