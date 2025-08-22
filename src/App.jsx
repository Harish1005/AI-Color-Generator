import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


const App = () => {


  const [prompt, setPrompt] = useState("");
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlegenerate = async () => {
    setLoading(true);
    setColors([]);

    if (!prompt.trim()) {
      toast.error("Prompt is Empty");
      setLoading(false);
      return;
    }
    else {
      const toastId = toast.loading("Generating colors..");
      try {
        
        const response = await axios.post(`https://openrouter.ai/api/v1/chat/completions`,
          {
            model: "openai/gpt-3.5-turbo-0613",
            messages: [{
              role: "user",
              content: `Give me 5 hex colors for : ${prompt}`
            }
            ]
          },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
              'Content-Type': "application/json"
            }
          }
        )
        const result = response.data.choices[0].message.content;

        const hexMatch = result.match(/#[A-Fa-f0-9]{6}/g);

        if (hexMatch) setColors(hexMatch);

        toast.success("Colors Generated", {id: toastId});
      }
      catch (error) {
        console.log(error, "Error");
        toast.error("Failed to generate colors", {id: toastId})
      }
      finally {
        setLoading(false);
        setPrompt("");
      }
    }
  }

  const copyColor = (color) => {
    navigator.clipboard.writeText(color);
    toast.success(`${color} Copied`);
  }




  return (
    <div className='bg-[#1e1b4b] text-white min-h-screen flex flex-col items-center justify-center px-4 py-10 font-mono'>
      <h1 className='text-4xl font-bold mb-4 text-center'>AI Color Palette Maker</h1>
      <input type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className='w-full max-w-md border p-3 rounded bg-[#2a265f] text-white mb-4'
        placeholder='Enter your Prompt (e.g: Sun, Moon...)' />

      <button className='bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 hover:cursor-pointer' disabled={loading} onClick={handlegenerate}>
        {loading ? "Generating..." : "Generate Palette"}
      </button>


      {/* Result */}

      {colors.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-10'>
          {colors.map((color, id) => (
            <div key={id} className='flex flex-col items-center'>
              <div className='w-20 h-20 rounded' style={{
                backgroundColor: color
              }}></div>
              <span className='mt-3 cursor-pointer hover:underline'
                onClick={() => copyColor(color)}>{color}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
