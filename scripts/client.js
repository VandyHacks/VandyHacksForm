let createTrie = require('autosuggest-trie');

const dataList = document.getElementById('json-datalist');
const input = document.getElementById('school');
let universityList;

function promise() {
 return new Promise((resolve, reject) => {
  
    const request = new XMLHttpRequest();
    request.open('GET', 'universities.json', false);
    request.onload = () => {
      universityList = JSON.parse(request.responseText);
      input.placeholder = "Your School";
    };  
    request.send();
    resolve(universityList);
  });
}

promise()
  .then((universityList) => {
    const universities = universityList.map(uni => ({ name: uni }));
    const splitByHyphen = /\s+|-/;
    const trie = createTrie(universities, 'name', { splitRegex: splitByHyphen });
    // input.onkeypress = function() {

    input.onkeyup = function() {
      // clears if the dataList if the input text is there is imbalance alphabetically
      if(dataList.options[0] != null && dataList.options[0].value.substr(0,2) > input.value) {
        dataList.innerHTML = '';
      }

      const inputText = input.value.trim();
      const results = trie.getMatches(inputText, { limit: 4, splitRegex: splitByHyphen });
      results.forEach(function(item) {
        const option = document.createElement('option');
        option.value = item.name;
        option.id = item.name;

        // if statement to check if the item already exists in dataList and will remove an item if length exceeds 4
        if(dataList.options.namedItem(option.id) === null && dataList.options.length >= 4) {
          dataList.children[0].remove();
          dataList.appendChild(option);
        } else if(dataList.options.namedItem(option.id) === null) {
          dataList.appendChild(option);
        }
      });
    };
  });