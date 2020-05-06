var encodedMessage, encode_message, decodedMessage;

var navbar = document.querySelector("#navbar");
var codes = document.querySelectorAll(".code");
var links = document.querySelectorAll(".link");
var encode_input = document.querySelector("#encode-input");
var decode_input = document.querySelector("#decode-input");
var btn_encode = document.querySelector("#btn-encode");
var btn_decode = document.querySelector("#btn-decode");
var encode_m = document.querySelector("#encode-m");
var received_m = document.querySelector("#received-m");
var received_m_dec = document.querySelector("#received-m-dec");
var enc_sections = document.querySelectorAll(".section");
var sectionList1 = enc_sections[0].childNodes;
var sectionList2 = enc_sections[1].childNodes;
var sectionList3 = enc_sections[2].childNodes;
var wrapper_decode = document.querySelector("#wrapper-decode");
var dec_sections = document.querySelectorAll("#wrapper-decode .section");
var sectionDecList1 = dec_sections[0].childNodes;
var sectionDecList2 = dec_sections[1].childNodes;
var bugline = document.querySelector("#bug");
var decode_m = document.querySelector("#decode-m");

navbar.addEventListener("click", function(e){
  if(e.target.className = "link"){
    for (var i = 0; i < links.length; i++) {
      links[i].classList.remove("active");
      codes[i].classList.remove("open");
      if(e.target === links[i]){
        links[i].classList.add("active");
        codes[i].classList.add("open");
      }
    }
  }
});
document.querySelector("#active_link").click();

btn_encode.addEventListener("click", function(){
  var r_elems;
  var numOfr_elems, reverseIndex;
  var strList;

  encode_message = encode_input.value;
  received_m.innerHTML = encode_message;
  encodedMessage = encode_message;

  numOfr_elems = 0;
  encode_message = encode_message.split("");
  for (var i = 1; i < encode_message.length+1; i*=2) {
    encode_message.splice(i-1, 0, "-");
    numOfr_elems++;
  }
  encode_message = encode_message.join("");

  for (var i = 0; i < enc_sections.length; i++) {
    enc_sections[i].innerHTML = "";
  }

  for (var i = 0; i < encode_message.length; i++) {
    enc_sections[0].innerHTML += "<p></p>";
    enc_sections[1].innerHTML += "<p></p>";
    enc_sections[2].innerHTML += "<p></p>";
  }

  strList = [];
  r_elems = [];
  reverseIndex = numOfr_elems-1;
  for (var i = 0; i < numOfr_elems; i++) {
    r_elems[i] = "";
    strList[reverseIndex] = "";
    var index = 1;
    for (var j = 0; j < encode_message.length; j++) {
      if(encode_message[j] === "-"){
        continue;
      }else if(fillString((j+1).toString(2))[i] == "1") {
        r_elems[i] ^= encode_message[j];
        strList[reverseIndex] += "^";
        strList[reverseIndex] += "k" + index;
      }
      index++;
    }
    reverseIndex--;
  }
  r_elems = r_elems.reverse();

  function isCorrect(iteration){
    for (var i = 1; i < encode_message.length+1; i*=2) {
      if(iteration === (i-1)){
        return true;
      }
    }
    return false;
  }

  for (var i = 0; i < strList.length; i++) {
    strList[i] = strList[i].replace("^", "r" + (i+1) + "=");
  }

  encodedMessage = encodedMessage.split("");
  var index = 0;
  for (var i = 1; i < encodedMessage.length+1; i*=2) {
    encodedMessage.splice(i-1, 0, r_elems[index]);
    index++;
  }
  encodedMessage = encodedMessage.join("");

  var index = 1;
  var a = 0;
  for (var i = 0; i < encode_message.length; i++) {
    sectionList1[i].innerHTML += fillString((i+1).toString(2)) + "&nbsp;-&nbsp;" + "b" + (i+1);
    sectionList3[i].innerHTML += encodedMessage[i];
    if(isCorrect(i)){
      sectionList2[i].innerHTML += strList[a];
      a++;
    }else{
      sectionList2[i].innerHTML += "k" + index;
      index++;
    }
  }

  encode_m.innerHTML = encodedMessage;
  decode_input.value = encodedMessage;
});

btn_decode.addEventListener("click", function(){
  var decode_message, r_elems, temp_decode_message, bugMessage;
  var numOfr_elems, reverseIndex;
  var strList;

  decode_message = decode_input.value;
  temp_decode_message = decode_message;
  received_m_dec.innerHTML = decode_message;

  r_elems = [];
  numOfr_elems = 0;
  for (var i = 1; i < decode_message.length+1; i*=2) {
    r_elems[numOfr_elems] = "";
    r_elems[numOfr_elems] += decode_message[i-1];
    numOfr_elems++;
  }

  for (var i = 0; i < dec_sections.length; i++) {
    dec_sections[i].innerHTML = "";
  }
  for (var i = 0; i < numOfr_elems; i++) {
    dec_sections[0].innerHTML += "<p></p>";
    dec_sections[1].innerHTML += "<p></p>";
  }

  r_elems = r_elems.reverse();
  reverseIndex = numOfr_elems-1;
  strList = [];
  for (var i = 0; i < numOfr_elems; i++) {
    strList[reverseIndex] = "";
    var index = 1;
    for (var j = 0; j < decode_message.length; j++) {
      if(isCorrect(j)){
        continue;
      }else if(fillString((j+1).toString(2))[i] == "1") {
        r_elems[i] ^= decode_message[j];
        strList[reverseIndex] += "^";
        strList[reverseIndex] += "k" + index;
      }
      index++;
    }
    reverseIndex--;
  }
  r_elems = r_elems.reverse();
  bugMessage = r_elems.join("");

  tempbugMessage = bugMessage.split("").reverse().join("");
  if(isWithoutErrors(bugMessage)){
    bugline.innerHTML = "Bug not found!";
  }else{
    bugline.innerHTML = "Bug in " + parseInt(tempbugMessage, 2) + "Bit!";
  }

  decodedMessage = decode_message;
  decodedMessage = decodedMessage.split("");

  var index = parseInt(tempbugMessage, 2)-1;
  if(decode_message[index] === "1"){
    decodedMessage[index] = "0";
  }else{
    decodedMessage[index] = "1";
  }

  for (var i = 1; i < decodedMessage.length; i*=2) {
    decodedMessage[i-1] = "";
  }

  decode_m.innerHTML = decodedMessage.join("");

  function isWithoutErrors(str){
    for (var i = 0; i < str.length; i++) {
      if(str[i] === "1"){
        return false;
      }
    }
    return true;
  }

  var index = 1;
  for (var i = 0; i < numOfr_elems; i++) {
    strList[i] = strList[i].replace("^", "s" + index + "=r" + index + "^");
    sectionDecList1[i].innerHTML = strList[i];
    sectionDecList2[i].innerHTML = bugMessage[i];
    index++;
  }

  function isCorrect(iteration){
    for (var i = 1; i < temp_decode_message.length+1; i*=2) {
      if(iteration === (i-1)){
        return true;
      }
    }
    return false;
  }
});

function fillString(str){
  str = str.split("");
  while(str.length != encode_message.length.toString(2).length){
    str.unshift("0");
  }
  return str.join("");
}
