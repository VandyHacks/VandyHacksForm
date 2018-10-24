const dataList = document.getElementById('json-datalist');
const input = document.getElementById('school');
const universityList = UNIVERSITIES;
$ = document.getElementById;

window.onload = event => {
  // fill grad year select
  ['2018', '2019', '2020', '2021', '2022'].forEach(e => {
    $("#year-selector").append(
      $("<option />")
      .val(e)
      .text(e)
    );
  });

  // fill gender select
  ['M', 'F', 'O', 'N'].forEach(e => {
    $("#gender-selector").append(
      $("<option />")
      .val(e)
      .text(e)
    );
  });
  hideInputs(true);
};

function updateUnivList() {
  // TODO: fix dropdown is only shown properly when pressing backspace, doesn't show when typing
  // clear
  dataList.innerHTML = '';
  // match input
  const inputText = input.value.trim();
  const criteria = e => e.toLowerCase().includes(inputText.toLowerCase());
  const results = universityList.filter(criteria).slice(0, 5);

  // build new list
  results.forEach((item) => {
    const option = document.createElement('option');
    option.value = item;
    // check if the item already exists in dataList; remove an item if length > 4
    dataList.appendChild(option);
  });
  console.log(dataList.options)
}

$("#school").on('keypress', e => {
  console.log(e.keyCode)
  if (e.keyCode === 13) {
    console.log('Enter pressed.')
    // put top result of dropdown as html value
    input.value = dataList.options[0].value; 
    // focus on next elem
    $('#email').focus();
  }
  updateUnivList();
});


function submitform() {
  fetch('api/walkin/profile', {  
    method: 'POST',  
    headers: {
      "x-event-secret": token,
    },
    body: JSON.stringify({
      name: $('name').value,
      school: $('school').value,
      email: $('email').value,
      phone: $('phone').value,
      year: $('year').value,
      gender: $('gender').value,
    })
  })
  .then(function (data) {  
    console.log('Request success: ', data);  
  })  
  .catch(function (error) {  
    console.log('Request failure: ', error);  
  });
  return false;
};

/**************************************************************************************************/
/*********************************** Authorization stuff ******************************************/

async function authorizedJSONFetch(url) {
  const res = await fetch(transformURL(url), {
    headers:new Headers({ "x-event-secret": token })
  });
  return await res.json();
}

// set auth JWT token
async function setToken() {
  console.log(token);
  try {
    const res = await fetch(
      transformURL("https://apply.vandyhacks.org/auth/eventcode/"),
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({
          token: token
        })
      }
    );
    if (res.ok) {
      const authElem = dom("#auth");
      authElem.parentNode.removeChild(authElem);
      dom("#maindiv").style.display = "block";
      hideInputs(false);
    } else {
      console.log("invalid token");
      alert("Invalid token");
    }
  } catch (err) {
    return console.error(err);
  }
}

// On auth code popup submit, set the token and call setToken()
dom("#authcode").addEventListener("keyup", e => {
  if (e.keyCode === 13) {
    token = dom("#authcode").value;
    setToken();
  }
});


/**************************************************************************************************/
/****************************************** Utils *************************************************/

function transformURL(url) {
  const isDev = !location.hostname.endsWith("vandyhacks.org");
  // bypass CORS issues in client-side API calls during localhost/dev, see https://github.com/Freeboard/thingproxy
  return isDev ? "https://thingproxy.freeboard.io/fetch/" + url : url;
}

// toggle hiding elems
function hideInputs(hide) {
  const elems = ["#forms"];
  elems.forEach(e => {
    dom(e).style.display = hide ? 'none' : 'block';
  });
}