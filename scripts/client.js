const createTrie = require('autosuggest-trie');

const dataList = document.getElementById('json-datalist');
const input = document.getElementById('school');
let universityList;

function promise() {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.open('GET', 'universities.json', false);
    request.onload = () => {
      universityList = JSON.parse(request.responseText);
      input.placeholder = 'Your School';
    };
    request.send();
    resolve(universityList);
  });
}

promise()
  .then(() => {
    const universities = universityList.map(uni => ({ name: uni }));
    const splitByHyphen = /\s+|-/;
    const trie = createTrie(universities, 'name', { splitRegex: splitByHyphen });
    let results;
    input.onkeyup = function () {
      // checks if number of colleges shown is > 4 then removes the last item
      if (dataList.options.length > 4) {
        dataList.children[dataList.options.length - 1].remove();
      }
      // clears if the dataList if the input text is there is imbalance alphabetically
      if (dataList.options[0] != null && dataList.options[0].value > input.value) {
        dataList.innerHTML = '';
      }

      const inputText = input.value.trim();
      results = trie.getMatches(inputText, { limit: 4, splitRegex: splitByHyphen });
      results.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.name;
        option.id = item.name;

        // if statement to check if the item already exists in dataList
        if (dataList.options.namedItem(option.id) === null) {
          dataList.appendChild(option);
        }
      });
    };
  });
