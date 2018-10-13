const dataList = document.getElementById('json-datalist');
const input = document.getElementById('school');
const universityList = UNIVERSITIES;

window.onload = event => {
  // fill grad year select
  ['2018', '2019', '2020', '2021', '2022'].forEach(e => {
    $("#event-selector").append(
      $("<option />")
      .val(e)
      .text(e)
    );
  });

  // fill gender select
  ['M', 'F', 'O', 'N'].forEach(e => {
    $("#event-selector").append(
      $("<option />")
      .val(e)
      .text(e)
    );
  });

};

input.onkeyup = function (e) {
  if (e.keycode === 13){
    console.log('Enter pressed.')
    // TODO: 
    // put top result of dropdown as html value
    $('#email').focus();
  }
  // clear
  dataList.innerHTML = '';
  // match input
  const inputText = input.value.trim();
  const criteria = e => e.toLowerCase().includes(inputText.toLowerCase());
  const results = universityList.filter(criteria).slice(0, 5);

  console.log(results)
  // build new list
  results.forEach((item) => {
    const option = document.createElement('option');
    option.value = item;
    option.id = item;
    // check if the item already exists in dataList; remove an item if length > 4
    dataList.appendChild(option);
  });
};