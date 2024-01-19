//vars
const input = document.querySelector(".inputRep");
const autoComp = document.querySelector(".vipadashkaMama");
const outList = document.querySelector(".outputList");
const itemList = outList.querySelector(".outputItem");
const delBtn = document.getElementById("deleteBtn");
let searchTimeout;

// funcs
const log = (txt) => console.log(txt);
function testInput() {
  if (input.value.length > 0) {
    autoComp.style.display = "block";
  }

  if (input.value.length === 0) {
    autoComp.style.display = "none";
  }
}

function selectedCreate({ name, own, rat }) {
  let item = document.createElement("li");
  let itemInnerLeft = document.createElement("p");
  let btnDel = document.createElement("button");
  itemInnerLeft.className = "leftSide";
  itemInnerLeft.innerHTML = `
  <span class="textInside">Name: ${name}</span>\n
  <span class="textInside">Owner: ${own}</span>\n
  <span class="textInside">Stars: ${rat}</span>\n
  `;
  item.append(itemInnerLeft);
  btnDel.className = "outputDel";
  btnDel.id = "deleteBtn";
  item.append(btnDel);
  item.className = "outputItem";
  outList.appendChild(item);
}

async function searcher(textSearcher) {
  if (!textSearcher.length > 0) {
    throw new Error("Error catched, unexpected value or empty value");
  }
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(async () => {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${textSearcher}`
    );
    const json = await response
      .json()
      .then((response) => {
        return response;
      })
      .catch((e) => {
        throw new Error("unexpected value or empty");
      });
    const jsonSorted = json.items.sort((iA, iB) => iB.forks - iB.forks);
    const jsonOut = jsonSorted.filter((item, i) => i < 5);
    searcherAppend(jsonOut);
  }, 500);
}

function searcherAppend(arrSearched) {
  const ulElement = document.querySelector(".vipadashkaMama");
  if (ulElement && Array.isArray(arrSearched)) {
    ulElement.innerHTML = "";
    arrSearched.forEach((value) => {
      const liElement = document.createElement("li");
      liElement.className = "vipodashka";
      liElement.textContent = `${value.name}`;
      liElement.props = {
        name: value.full_name,
        own: value.owner.login,
        rat: value.forks,
      };

      ulElement.appendChild(liElement);
    });
  }
}

const debounce = (fn, debounceTime) => {
  let timer;
  return function (...ops) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, ops), debounceTime);
  };
};

// events
input.addEventListener("input", function (evt) {
  testInput(this.value);
  debounce(searcher(this.value), 500);
});

autoComp.addEventListener("click", (e) => {
  selectedCreate(e.target.props);
  input.value = "";
  testInput();
});

outList.addEventListener("click", function (e) {
  if (e.target && e.target.id == "deleteBtn") {
    let listItem = e.target.closest("li");
    outList.removeChild(listItem);
  }
});
