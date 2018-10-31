const dataList = document.getElementById("json-datalist");
const input = document.getElementById("school");
const universityList = UNIVERSITIES;
let token;

const COLORS = {
  GREEN: "rgb(80, 187, 80)",
  RED: "rgb(139, 0, 0)",
  LIGHT: "rgb(230, 230, 230)",
  DARK: "rgb(60, 56, 80)"
};

window.onload = event => {
  // fill grad year select
  ["2018", "2019", "2020", "2021", "2022"].forEach(e => {
    const newoption = dom("<option>");
    newoption.value = e;
    newoption.text = e;
    dom("#year-selector").appendChild(newoption);
  });

  // fill gender select
  ["M", "F", "O", "N"].forEach(e => {
    const newoption = dom("<option>");
    newoption.value = e;
    newoption.text = e;
    dom("#gender-selector").appendChild(newoption);
  });

  // populate schools
  new Awesomplete(input, {
    list: universityList,
    minChars: 1,
    maxItems: 5,
    autoFirst: true
  });

  hideInputs(true);
};

let submitform = () => {
  fetch(transformURL("https://apply.vandyhacks.org/api/walkin/profile"), {
    method: "POST",
    headers: new Headers({
      "x-event-secret": token,
      "Content-Type": "application/json; charset=utf-8"
    }),
    body: JSON.stringify({
      name: $("#name").val(),
      school: $("#school").val(),
      email: $("#email").val(),
      phone: $("#phone").val(),
      year: $("#year").val(),
      gender: $("#gender").val()
    })
  })
    .then(data => {
      if (data.ok) {
        $("#error-msg").css("display", "none");
        $("#success-msg").css("display", "block");
        $("#success-msg").text("Success!");
      } else {
        $("#success-msg").css("display", "none");
        $("#error-msg").css("display", "block");
        $("#error-msg").text("An account for this email already exists.");
      }
      resetInputs();
    })
    .catch(error => {
      $("#sucess-msg").css("display", "none");
      $("#error-msg").css("display", "block");
      $("#error-msg").text(`Error: ${error}`);
      resetInputs();
    });
  return false;
};

/**************************************************************************************************/
/*********************************** Authorization stuff ******************************************/

// set auth JWT token
let setToken = async () => {
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
      alert("Invalid token");
    }
  } catch (err) {
    return console.error(err);
  }
};

// On auth code popup submit, set the token and call setToken()
dom("#authcode").addEventListener("keyup", e => {
  if (e.keyCode === 13) {
    token = dom("#authcode").value;
    setToken();
  }
});

/**************************************************************************************************/
/****************************************** Utils *************************************************/

let transformURL = url => {
  const isDev = !location.hostname.endsWith("vandyhacks.org");
  // bypass CORS issues in client-side API calls during localhost/dev
  return isDev ? "https://cors-anywhere.herokuapp.com/" + url : url;
};

// toggle hiding elems
let hideInputs = hide => {
  const elems = ["#forms"];
  elems.forEach(e => {
    dom(e).style.display = hide ? "none" : "block";
  });
};

let resetInputs = () => {
  $("#myForm :input").val("");
  $("#submitBtn").val("Submit");
};
