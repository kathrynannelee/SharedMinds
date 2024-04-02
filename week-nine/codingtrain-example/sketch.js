// adapted from Coding Train, Live Stream 12/4/2023
// https://youtu.be/1mwguqeEz8c

// Array to store raw color data
let embeddings = [];
// UMAP instance
let umap;
// Array to store results from UMAP
let umapResults;

function setup() {
  // Set up the canvas
  createCanvas(800, 650);
  // Seed the random function for reproducibility
  //randomSeed(Math.floor(Math.random() * 9));

  // Generate random color data and store it in embeddings array
  for (let i = 0; i < 800; i++) {
    let data = [random(255), random(255), random(255)];
    embeddings.push(data);
  }

  // UMAP configuration options
  const options = {
    nNeighbors: 15,
    minDist: 0.1,
    nComponents: 2,
    random: random, // Use p5.js random function
  };
  // Initialize UMAP with options and data
  umap = new UMAP(options);
  // Fit UMAP model with embeddings
  umapResults = umap.fit(embeddings);
}

function draw() {
  // Set background color
  background(0);

  // Variables to store min and max values for mapping
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  // Determine the bounds for the UMAP results
  for (let i = 0; i < umapResults.length; i++) {
    let dataPoint = umapResults[i];
    minX = min(dataPoint[0], minX);
    minY = min(dataPoint[1], minY);
    maxX = max(dataPoint[0], maxX);
    maxY = max(dataPoint[1], maxY);
  }

  // Draw the UMAP results on the canvas
  for (let i = 0; i < umapResults.length; i++) {
    let dataPoint = umapResults[i];
    // Map the UMAP output to canvas coordinates
    let x = map(dataPoint[0], minX, maxX, 0, width);
    let y = map(dataPoint[1], minY, maxY, 0, height);
    noStroke();
    // Use the original color data for each point
    fill(embeddings[i][0], embeddings[i][1], embeddings[i][2]);
    // Draw a circle for each data point
    circle(x, y, 25);
  }
}
