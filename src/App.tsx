import { useState } from 'react'
import './App.css'

function App() {
  const [imgurl, setimgurl] = useState('')
  const [dimensions, setDimensions] = useState([0, 0])
  const [avgColor, setAvgColor] = useState('#dddddd')
  const [domColors, setDomColors] = useState(['#dddddd', '#dddddd', '#dddddd'])
  
  const handleFileUpload = (event:any) => {
    event.preventDefault()
    const imageFile = event.target.files[0]
    if (imageFile) {
      // Set preview image to file
      const url = URL.createObjectURL(imageFile)
      setimgurl(url)
      // Read file data
      const reader = new FileReader()
      reader.onload = function() {
        const img = new Image()
        img.src = url 
        img.onload = function () {
          // Set dimensions
          const width = img.width
          const height = img.height
          setDimensions([width, height])
        }
      }
      reader.readAsDataURL(imageFile);
    }
  }

  const rgb_to_hex = (r:number, g:number, b:number) => {
    return '#'
     + (r.toString(16).length == 1 ? '0' + r.toString(16) : r.toString(16))
     + (g.toString(16).length == 1 ? '0' + g.toString(16) : g.toString(16))
     + (b.toString(16).length == 1 ? '0' + b.toString(16) : b.toString(16))
  }
  
  const getColor = (event:any) => {
    event.preventDefault()
    // Create image element
    const imgElement = new Image()
    imgElement.src = imgurl
    // Then convert it into a canvas
    const canvas = document.createElement('canvas')
    canvas.width = dimensions[0]
    canvas.height = dimensions[1]
    const size = canvas.width * canvas.height
    const context = canvas.getContext('2d')
    if (context) {
      context.drawImage(imgElement, 0, 0)
      const rgba_data = context.getImageData(0, 0, canvas.width, canvas.height).data
      console.log(rgba_data)
      let pixel_index = 0
      let totalred = 0
      let totalblue = 0
      let totalgreen = 0
      const colors: {[k: string]: number} = {}
      for (let i = 0; i < rgba_data.length; i++){
        if (pixel_index == 0) {
          // pixel_index 0 == red
          totalred += rgba_data[i]
          pixel_index++
        }
        else if (pixel_index == 1) {
          // pixel_index 2 == green
          totalgreen += rgba_data[i]
          pixel_index++
        }
        else if (pixel_index == 2) {
          // pixel_index 2 == blue
          totalblue += rgba_data[i]
          pixel_index++
        }
        else if (pixel_index == 3) {
          // pixel_index 3 == alpha; reset index for next pixel
          const this_color = rgb_to_hex(rgba_data[i-3], rgba_data[i-2], rgba_data[i-1])
          if (colors[this_color]) {
            colors[this_color] += 1
          } else { colors[this_color] = 1 }
          pixel_index = 0
        }
      }

      const doms = []
      let max = ''
      colors[max] = 0
      for (const key in colors){
        if (colors[key] >= colors[max]) max = key
      }
      doms[0] = max
      delete colors[max]

      max = ''
      colors[max] = 0
      for (const key in colors){
        if (colors[key] >= colors[max]) max = key
      }
      doms[1] = max
      delete colors[max]

      max = ''
      colors[max] = 0
      for (const key in colors){
        if (colors[key] >= colors[max]) max = key
      }
      doms[2] = max

      setAvgColor(rgb_to_hex(Math.floor(totalred / size), Math.floor(totalgreen / size), Math.floor(totalblue / size)))
      setDomColors(doms)
    }
  }

  return (
    <>
      <h1><b>ColorSelect</b></h1>
      <span>Please select an image:</span>
      <form onSubmit={getColor}>
        <input type='file' name='img' required onChange={handleFileUpload}></input>
        <p>Preview:</p>
        <img src={imgurl} width={350} height={350}></img>
        <br></br>
        <button type='submit'>Get Colors</button>
        <p>Average Color: <b>{avgColor}</b></p> 
        <svg>
          <rect height='50' width='300' rx='20' style={{fill: avgColor}}></rect>
        </svg>     
        <p>Top Colors: <b>{domColors[0]}, {domColors[1]}, {domColors[2]}</b></p>
        <svg>
          <rect height='50' width='300' rx='20' style={{fill: domColors[0]}}></rect>
        </svg> <br></br>
        <svg>
          <rect height='50' width='300' rx='20' style={{fill: domColors[1]}}></rect>
        </svg> <br></br>
        <svg>
          <rect height='50' width='300' rx='20' style={{fill: domColors[2]}}></rect>
        </svg>   
      </form>
      
    </>
  )
}

export default App
