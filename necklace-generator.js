let necklaceNumber = 1;

let necklaceLengthInches = 16;
let beadSizeMillimeters = 4;
const mmPerInch = 25.4;

let claspLengthInches = 1;

let necklaceLengthMillimeters = necklaceLengthInches * mmPerInch;
let numOfBeadsInNecklace = Math.floor(
  necklaceLengthMillimeters / beadSizeMillimeters
);

const beadSizeInPx = 4 * beadSizeMillimeters;

let necklaceHeightInPx = (numOfBeadsInNecklace * beadSizeInPx) / 3;
let beadRotationInDeg = 360 / (numOfBeadsInNecklace + 2);

const necklace = [
  {
    name: "hematite",
    min: 3,
    max: 8,
    color: "#574f50",
    totalNumBeads: 0,
  },
  {
    name: "turqoise",
    min: 1,
    max: 3,
    color: "#9966cc",
    totalNumBeads: 0,
  },
];

let outputHtml = "";

const generateBeadRun = (max, min, color, beadNumber) => {
  const saveBox = document.getElementById("savedNecklaces");
  saveBox.childNodes.forEach((node) => {
    node.style.border = "none";
  });

  const numberOfBeads = Math.floor(Math.random() * (max - min + 1)) + min;

  let output = "";
  for (let i = 0; i < numberOfBeads; i++) {
    output += `<div class="bead" style="width: ${beadSizeInPx}px; height: ${beadSizeInPx}px; background-color:${color}; transform: rotate(${
      beadNumber * beadRotationInDeg - 90
    }deg) translate(${necklaceHeightInPx / 2}px);" ></div>`;
    beadNumber++;
  }
  return { output, numberOfBeads };
};

const generateNecklace = () => {
  necklace.forEach((bead) => {
    bead.totalNumBeads = 0;
  });

  necklaceLengthInches = necklaceLengthInput.value;
  beadSizeMillimeters = beadSizeInput.value;
  claspLengthInches = claspLengthInput.value;

  necklaceLengthMillimeters =
    necklaceLengthInches * mmPerInch - claspLengthInches * mmPerInch;
  numOfBeadsInNecklace = Math.floor(
    necklaceLengthMillimeters / beadSizeMillimeters
  );

  necklaceHeightInPx = (numOfBeadsInNecklace * beadSizeInPx) / 3;
  beadRotationInDeg = 360 / (numOfBeadsInNecklace + 2);

  necklace[0].min = parseInt(minHemInput.value);
  necklace[0].max = parseInt(maxHemInput.value);
  necklace[1].min = parseInt(minTurInput.value);
  necklace[1].max = parseInt(maxTurInput.value);

  let numBeadsRemaining = numOfBeadsInNecklace;

  document.getElementById("necklace").innerHTML = "";
  outputHtml = `<div class="clasp" style="width: ${beadSizeInPx}px; height: ${beadSizeInPx}px; transform: rotate(${
    beadRotationInDeg - 90
  }deg) translate(${necklaceHeightInPx / 2}px);"></div>`;

  while (numBeadsRemaining > 0) {
    necklace.forEach((bead) => {
      let beadNumber = numOfBeadsInNecklace - numBeadsRemaining + 2;
      const { output, numberOfBeads } = generateBeadRun(
        bead.max < numBeadsRemaining ? bead.max : numBeadsRemaining,
        bead.min,
        bead.color,
        beadNumber
      );
      bead.totalNumBeads += numberOfBeads;
      outputHtml += output;
      numBeadsRemaining -= numberOfBeads;
    });
  }
  outputHtml += `<div class="clasp" style="width: ${beadSizeInPx}px; height: ${beadSizeInPx}px; transform: rotate(${
    (numOfBeadsInNecklace + 2) * beadRotationInDeg - 90
  }deg) translate(${necklaceHeightInPx / 2}px);"></div>`;

  document.getElementById("beadCount").innerHTML = "";

  document.getElementById("beadCount").append(`${numOfBeadsInNecklace} beads`);
  necklace.forEach((bead) => {
    document.getElementById(
      "beadCount"
    ).innerHTML += `<br /><div style="width: ${beadSizeInPx}px; height: ${beadSizeInPx}px; border-radius: 100%; background-color: ${bead.color}; display: inline-block;"></div> ${bead.totalNumBeads} ${bead.name} beads`;
  });

  const necklaceDiv = document.getElementById("necklace");
  necklaceDiv.innerHTML = outputHtml;
  necklaceNumber++;
};

const loadNecklaces = () => {
  const saveBox = document.getElementById("savedNecklaces");
  saveBox.innerHTML = "";
  console.log(localStorage);
  if (localStorage.length > 0) {
    Object.keys(localStorage).forEach((item) => {
      if (item.includes("necklace")) {
        const necklaceObject = JSON.parse(localStorage.getItem(item));
        console.log(necklaceObject);

        addSavedNecklace(item, necklaceObject);
      }
    });
  }
};

const addSavedNecklace = (item, necklaceObject) => {
  const necklaceItem = document.createElement("div");
  necklaceItem.style.display = "inline-block";
  necklaceItem.innerHTML = `<p>${item}<p>`;

  const viewButton = document.createElement("button");
  viewButton.innerHTML = "View";
  necklaceItem.append(viewButton);

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = "Delete";
  necklaceItem.append(deleteButton);

  let beadCount = 0;
  necklaceObject.necklace.forEach((bead) => {
    beadCount += bead.totalNumBeads;
  });

  viewButton.addEventListener("click", (e) => {
    const saveBox = document.getElementById("savedNecklaces");
    saveBox.childNodes.forEach((node) => {
      node.style.border = "none";
    });
    viewButton.parentNode.style.border = "1px solid green";
    document.getElementById("beadCount").innerHTML = "";
    document.getElementById("beadCount").append(`${beadCount} beads`);
    necklaceObject.necklace.forEach((bead) => {
      document.getElementById(
        "beadCount"
      ).innerHTML += `<br /><div style="width: ${beadSizeInPx}px; height: ${beadSizeInPx}px; border-radius: 100%; background-color: ${bead.color}; display: inline-block;"></div> ${bead.totalNumBeads} ${bead.name} beads`;
    });
    document.getElementById("necklace").innerHTML = necklaceObject.necklaceHTML;
  });

  deleteButton.addEventListener("click", (e) => {
    localStorage.removeItem(item);
    loadNecklaces();
  });

  const saveBox = document.getElementById("savedNecklaces");
  saveBox.append(necklaceItem);
};

loadNecklaces();

const necklaceLengthInput = document.getElementById("necklaceSizeInches");
necklaceLengthInput.value = necklaceLengthInches;

const beadSizeInput = document.getElementById("beadSizeMillimeters");
beadSizeInput.value = beadSizeMillimeters;

const claspLengthInput = document.getElementById("claspLengthInches");
claspLengthInput.value = claspLengthInches;

const minHemInput = document.getElementById("minNumHem");
minHemInput.value = necklace[0].min;

const maxHemInput = document.getElementById("maxNumHem");
maxHemInput.value = necklace[0].max;

const minTurInput = document.getElementById("minNumTur");
minTurInput.value = necklace[1].min;

const maxTurInput = document.getElementById("maxNumTur");
maxTurInput.value = necklace[1].max;

const generateButton = document.getElementById("generate");
generateButton.addEventListener("click", (e) => {
  e.preventDefault;
  generateNecklace();
  document.getElementById("save").disabled = false;
});

const saveButton = document.getElementById("save");
saveButton.addEventListener("click", (e) => {
  e.preventDefault();
  const necklaceObject = {
    necklace: necklace,
    necklaceHTML: outputHtml,
  };
  localStorage.setItem(
    `necklace-${necklaceNumber}`,
    JSON.stringify(necklaceObject)
  );
  loadNecklaces();
});
