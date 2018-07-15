(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var unique = function unique(arr) {
  var seen = {};
  var result = [];
  var len = arr.length;

  for (var i = 0; i < len; i++) {
    var item = arr[i];

    if (!seen[item]) {
      seen[item] = true;
      result[result.length] = item;
    }
  }

  return result;
};

exports.default = function (arr1, arr2) {
  return unique(arr1.concat(arr2));
};
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _intersectionWithLimit = require('../intersection-with-limit/intersection-with-limit');

var _intersectionWithLimit2 = _interopRequireDefault(_intersectionWithLimit);

var _concatAndRemoveDups = require('../concat-and-remove-dups/concat-and-remove-dups');

var _concatAndRemoveDups2 = _interopRequireDefault(_concatAndRemoveDups);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (items, textKey) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      comparator = _ref.comparator,
      _ref$splitRegex = _ref.splitRegex,
      splitRegex = _ref$splitRegex === undefined ? /\s+/ : _ref$splitRegex;

  var data = items;
  var trie = {};

  var compareFunction = comparator ? function (id1, id2) {
    return comparator(items[id1], items[id2]);
  } : null;

  var addWord = function addWord(word, id, wordIndex) {
    var wordLength = word.length;
    var node = trie;

    for (var i = 0; i < wordLength; i++) {
      var letter = word[i];

      if (!node[letter]) {
        node[letter] = {
          ids: []
        };
      }

      if (!node[letter].ids[wordIndex]) {
        node[letter].ids[wordIndex] = [];
      }

      node[letter].ids[wordIndex].push(id);

      if (compareFunction) {
        node[letter].ids[wordIndex].sort(compareFunction);
      }

      node = node[letter];
    }
  };

  var addPhrase = function addPhrase(phrase, id) {
    var words = phrase.trim().toLowerCase().split(splitRegex);
    var wordsCount = words.length;

    for (var i = 0; i < wordsCount; i++) {
      addWord(words[i], id, i);
    }
  };

  var getWordIndices = function getWordIndices(word) {
    var wordLength = word.length;
    var node = trie;

    for (var i = 0; i < wordLength; i++) {
      if (node[word[i]]) {
        node = node[word[i]];
      } else {
        return [];
      }
    }

    var ids = node.ids;
    var length = ids.length;
    var result = [];

    for (var _i = 0; _i < length; _i++) {
      if (ids[_i]) {
        result = (0, _concatAndRemoveDups2.default)(result, ids[_i]);
      }
    }

    return result;
  };

  var getPhraseIndices = function getPhraseIndices(phrase, _ref2) {
    var limit = _ref2.limit,
        _ref2$splitRegex = _ref2.splitRegex,
        splitRegex = _ref2$splitRegex === undefined ? /\s+/ : _ref2$splitRegex;

    var words = phrase.toLowerCase().split(splitRegex).filter(Boolean);

    if (words.length === 0) {
      return [];
    }

    var wordsCount = words.length;
    var indicesArray = [];

    for (var i = 0; i < wordsCount; i++) {
      indicesArray[indicesArray.length] = getWordIndices(words[i]);
    }

    return (0, _intersectionWithLimit2.default)(indicesArray, limit);
  };

  var getMatches = function getMatches(query) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var indices = getPhraseIndices(query, options);
    var indicesCount = indices.length;
    var result = [];

    for (var i = 0; i < indicesCount; i++) {
      result[result.length] = data[indices[i]];
    }

    return result;
  };

  var itemsCount = items.length;

  for (var i = 0; i < itemsCount; i++) {
    addPhrase(items[i][textKey], i);
  }

  return {
    getMatches: getMatches
  };
};
},{"../concat-and-remove-dups/concat-and-remove-dups":1,"../intersection-with-limit/intersection-with-limit":4}],3:[function(require,module,exports){
'use strict';

var _createTrie = require('./create-trie/create-trie');

var _createTrie2 = _interopRequireDefault(_createTrie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _createTrie2.default;
},{"./create-trie/create-trie":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (arrays, limit) {
  var arraysCount = arrays.length;
  var firstArray = arrays[0];
  var firstArrayCount = firstArray.length;

  limit = limit || firstArrayCount;

  var result = [],
      candidate = void 0,
      found = void 0;

  for (var i = 0; i < firstArrayCount && result.length < limit; i++) {
    candidate = firstArray[i];
    found = true;

    for (var k = 1; k < arraysCount; k++) {
      if (arrays[k].indexOf(candidate) === -1) {
        found = false;
        break;
      }
    }

    if (found) {
      result[result.length] = candidate;
    }
  }

  return result;
};
},{}],5:[function(require,module,exports){
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
    let results;
    input.onkeyup = function() {
      // checks if amount of colleges shown is > 4 then removes the last item
      if(dataList.options.length > 4) {
        dataList.children[0].remove();
      }
      // clears if the dataList if the input text is there is imbalance alphabetically
      if(dataList.options[0] != null && dataList.options[0].value > input.value) {
        dataList.innerHTML = '';
      }

      const inputText = input.value.trim();
      results = trie.getMatches(inputText, { limit: 4, splitRegex: splitByHyphen });
      results.forEach(function(item) {
        const option = document.createElement('option');
        option.value = item.name;
        option.id = item.name;

        // if statement to check if the item already exists in dataList
        if(dataList.options.namedItem(option.id) === null) {
          dataList.appendChild(option);
        }
      });
    };
  });
},{"autosuggest-trie":3}]},{},[5]);
