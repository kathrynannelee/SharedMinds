const replicateProxy = "https://replicate-api-proxy.glitch.me";

let distances = []
function setup() {
    createCanvas(700, 600);
  const randomPhrases = ["Juggling flaming torches",
  "Surfing in a storm",
  "Balancing on a tightrope",
  "Hula hooping in a hurricane",
  "Bungee jumping into a volcano",
  "Skydiving without a parachute",
  "Climbing a glass mountain",
  "Dancing with fireflies",
  "Riding a unicycle on a tightrope",
  "Taming wild tornadoes",
  "Skipping stones on a lava lake",
  "Swimming with sharks at midnight",
  "Running through a maze blindfolded",
  "Spinning plates on a roller coaster",
  "Balancing over a shark tank",
  "Playing hopscotch on a moving train",
  "Bouncing on a pogo stick on thin ice",
  "Tightrope walking over a bed of nails",
  "Hiking up a waterfall"];
  let input_field = createInput(randomPhrases[Math.floor(Math.random() * randomPhrases.length)] + ", " +  randomPhrases[Math.floor(Math.random() * randomPhrases.length)] + ", " + randomPhrases[Math.floor(Math.random() * randomPhrases.length)] + ", " + randomPhrases[Math.floor(Math.random() * randomPhrases.length)]);
  input_field.size(950);
  //add a button to ask for words
  let button = createButton("Ask");
  button.mousePressed(() => {
    askForEmbeddings(input_field.value());
  });
  textSize(16)
}

function draw() {
  background(255);
  for(let i = 0; i < distances.length; i++){
    let thisComparison = distances[i];
    let pixelDistance = (1-thisComparison.distance)* width*2;
    text(thisComparison.phrase,20+ pixelDistance,20+ pixelDistance)
  }
}

async function askForPicture(p_prompt) {
    const imageDiv = document.getElementById("resulting_image");
    imageDiv.innerHTML = "Waiting for reply from Replicate's Stable Diffusion API...";
    let data = {
        "version": "da77bc59ee60423279fd632efb4795ab731d9e3ca9705ef3341091fb989b7eaf",
        input: {
            "prompt": p_prompt,
            "width": 512,
            "height": 512,
        },
    };
    console.log("Asking for Picture Info From Replicate via Proxy", data);
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };
    const url = replicateProxy + "/create_n_get/"
    console.log("url", url, "options", options);
    const picture_info = await fetch(url, options);
    //console.log("picture_response", picture_info);
    const proxy_said = await picture_info.json();

    if (proxy_said.output.length == 0) {
        imageDiv.innerHTML = "Something went wrong, try it again";
    } else {
        imageDiv.innerHTML = "";
        let img = document.createElement("img");
        img.src = proxy_said.output[0];
        imageDiv.appendChild(img);
    }
}

async function askForEmbeddings(p_prompt) {
  let promptInLines = p_prompt.replace(/,/g, "\n");
  let data = {
    version: "75b33f253f7714a281ad3e9b28f63e3232d583716ef6718f2e46641077ea040a",
    input: {
      inputs: promptInLines,
    },
  };
  console.log("Asking for Picture Info From Replicate via Proxy", data);
  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const url = replicateProxy + "/create_n_get/";
  console.log("url", url, "options", options);
  const raw = await fetch(url, options);
  //console.log("raw", raw);
  const proxy_said = await raw.json();
  let output = proxy_said.output;
  console.log("Proxy Returned", output);
  distances = []
  let firstOne = output[0];
  for (let i = 0; i < output.length; i++) {
    let thisOne = output[i];
    let cdist = cosineSimilarity(firstOne.embedding, thisOne.embedding);
    distances.push({"reference": firstOne.input, "phrase": thisOne.input, "distance": cdist})
    console.log(firstOne.input, thisOne.input, cdist);
    askForPicture(firstOne.value);
  }
}

function cosineSimilarity(vecA,vecB){
    return dotProduct(vecA,vecB)/ (magnitude(vecA) * magnitude(vecB));
}

function dotProduct(vecA, vecB){
    let product = 0;
    for(let i=0;i<vecA.length;i++){
        product += vecA[i] * vecB[i];
    }
    return product;
}

function magnitude(vec){
    let sum = 0;
    for (let i = 0;i<vec.length;i++){
        sum += vec[i] * vec[i];
    }
    return Math.sqrt(sum);
}
