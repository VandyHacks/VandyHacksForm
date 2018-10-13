const dataList = document.getElementById('json-datalist');
const input = document.getElementById('school');
const universityList = UNIVERSITIES;

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

};

function updateUnivList() {
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