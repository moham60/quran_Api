const apiUrl = "https://mp3quran.net/api/v3/";
const lang = "ar";
async function getReciters() {
  const response = await fetch(`${apiUrl}reciters`);
  const data = await response.json();
  const chooseReciters = document.querySelector("#chooseReciters");
  chooseReciters.innerHTML = `<option>أختر قارئ</option>`;
  data.reciters.forEach((reciters) => {
    chooseReciters.innerHTML += `<option value="${reciters.id}">${reciters.name}</option>`;
  });
  chooseReciters.addEventListener("change", (e) => getMoshef(e.target.value));
}
getReciters();
async function getMoshef(reciter) {
  const response = await fetch(
    ` ${apiUrl}reciters?language=${lang}&reciter=${reciter}`
  );
  const data = await response.json();
  const chooseMoshef = document.querySelector("#chooseMoshef");

  chooseMoshef.innerHTML = `<option disabled selected>أختر مصحف</option>`;
  const moshefs = data.reciters[0].moshaf;

  moshefs.forEach((moshef) => {
    chooseMoshef.innerHTML += `<option value="${moshef.id}" data-server=${moshef.server} sura-list=${moshef.surah_list}>${moshef.name}</option>`;
  });

  chooseMoshef.addEventListener("change", (e) => {
    var selectedOption = chooseMoshef.options[chooseMoshef.selectedIndex];
    const attr = "data-server";
    const suralistattr = "sura-list";

    getSura(
      selectedOption.getAttribute(attr),
      selectedOption.getAttribute(suralistattr)
    );
  });
}
//////////////////////////////
async function getSura(suraserver, suraList) {
  const response = await fetch(` ${apiUrl}suwar?language=${lang}`);
  const data = await response.json();
  const chooseSura = document.querySelector("#chooseSura");
  chooseSura.innerHTML = `<option>أختر سورة</option>`;
  const soraNames = data.suwar;
  suraList = suraList.split(",");
  suraList.forEach((surah) => {
    const pad = surah.padStart(3, "0");
    soraNames.forEach((surahNames) => {
      if (surahNames.id == surah) {
        chooseSura.innerHTML += `<option value="${suraserver}${pad}.mp3">${surahNames.name}</option>`;
      }
    });
  });

  chooseSura.addEventListener("change", getSelectedSura);
}
///////////////////////////////////////
function getSelectedSura() {
  const chooseSura = document.querySelector("#chooseSura");
  const selectedSura = chooseSura.options[chooseSura.selectedIndex];
  const audio = document.querySelector(".audio audio");
  audio.src = selectedSura.value;
}
//////////////////////////////////////////////
async function playLive(channel) {
  if (Hls.isSupported()) {
    var video = document.getElementById("video");
    var hls = new Hls();
    hls.loadSource(channel);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  }
}
///////////////////////////////////////////////

async function getKindZekr() {
  const chooseKindZekr = document.getElementById("chooseKindZekr");
  chooseKindZekr.addEventListener("change", function () {
    const selectedKindZekr =
      chooseKindZekr.options[chooseKindZekr.selectedIndex];
    const value = selectedKindZekr.value;
    if (value === "أذكار الصباح") {
      getNumofZekrSubah();
    } else getNumofZekrMasa();
  });
}
/////////////////////////////////////////
async function getNumofZekrSubah() {
  const response = await fetch(
    "https://ahegazy.github.io/muslimKit/json/azkar_sabah.json"
  );
  const data = await response.json();
  const chooseNumZekr = document.querySelector("#chooseNumZekr");
  chooseNumZekr.innerHTML = `<option disabled selected> أختر رقم الذكر </option>`;
  data.content.forEach((element, index) => {
    chooseNumZekr.innerHTML += `<option id=${index}>ذكر رقم ${
      index + 1
    }</option>`;
  });
}
///////////////////////////////////////////////////////
async function getNumofZekrMasa() {
  const response = await fetch(
    "https://ahegazy.github.io/muslimKit/json/azkar_massa.json"
  );
  const data = await response.json();
  const chooseNumZekr = document.querySelector("#chooseNumZekr");
  chooseNumZekr.innerHTML = `<option disabled selected> أختر رقم الذكر </option>`;
  data.content.forEach((element, index) => {
    chooseNumZekr.innerHTML += `<option id=${index}>ذكر رقم ${
      index + 1
    }</option>`;
  });
}
////////////////////////////////////////////////

async function printzkrSubah(value) {
  const response = await fetch(
    "https://ahegazy.github.io/muslimKit/json/azkar_sabah.json"
  );
  const data = await response.json();
  const p1 = document.querySelector(".container2 p");
  const p2 = document.querySelector(".container2 .p2");
  const container = document.querySelector("#Azkar .container2");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  p1.innerHTML = data.content[value].zekr;
  p2.innerHTML = data.content[value].bless;
  const counter = document.querySelector(".counter");
  counter.innerHTML = ` العدد المطلوب ${data.content[value].repeat}`;
  const counter2 = document.querySelector(".counter2");
  const plus = document.querySelector("#plus");
  plus.style.display = "block";
  counter2.style.display = "block";
  counter.style.display = "block";
}
//////////////////////////////////////
async function printzkrmassa(value) {
  const response = await fetch(
    "https://ahegazy.github.io/muslimKit/json/azkar_massa.json"
  );
  const data = await response.json();
  console.log(data);
  const p1 = document.querySelector(".container2 p");
  const p2 = document.querySelector(".container2 .p2");
  const container = document.querySelector("#Azkar .container2");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  p1.innerHTML = data.content[value].zekr;
  p2.innerHTML = data.content[value].bless;
  const counter = document.querySelector(".counter");
  counter.innerHTML = ` العدد المطلوب ${data.content[value].repeat}`;
  const counter2 = document.querySelector(".counter2");
  const plus = document.querySelector("#plus");
  plus.style.display = "block";
  counter2.style.display = "block";
  counter.style.display = "block";
}
/////////////////////////////////////////////////
chooseNumZekr.addEventListener("change", function () {
  const chooseNumZekr = document.querySelector("#chooseNumZekr");
  const selectedNum = chooseNumZekr.options[chooseNumZekr.selectedIndex];
  const index = selectedNum.getAttribute("id");
  const chooseKindZekr = document.getElementById("chooseKindZekr");
  const selectedKindZekr = chooseKindZekr.options[chooseKindZekr.selectedIndex];

  const value = selectedKindZekr.value;
  if (value === "أذكار الصباح") {
    printzkrSubah(index);
    const counter2 = document.querySelector(".counter2");
    counter2.firstChild.textContent = "";
  } else {
    printzkrmassa(index);
    const counter2 = document.querySelector(".counter2");
    counter2.firstChild.textContent = "";
  }
});
getKindZekr();
///////////////////////////////////////////////////
let moonIcon = document.querySelectorAll(".fa-moon");
moonIcon.forEach((e, index) => {
  e.addEventListener("click", function () {
    if (index == 0) {
      const container = document.querySelector(".container2");

      container.classList.toggle("dark");
      container.classList.toggle("white");
      e.classList.toggle("fa-solid");
    } else {
      const container4 = document.querySelector(".container4");

      container4.classList.toggle("dark");
      container4.classList.toggle("white");
      e.classList.toggle("fa-solid");
    }
  });
});
const plus = document.querySelector("#plus");
plus.addEventListener("click", function () {
  const counter2 = document.querySelector(".counter2");

  counter2.firstChild.textContent++;
});

///////////////////////////////////////

const cities = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Shubra El Kheima",
  "Port Said",
  "Suez",
  "Luxor",
  "Asyut",
  "Mansoura",
  "Tanta",
  "Ismailia",
  "Faiyum",
  "Zagazig",
  "Damietta",
  "Aswan",
  "Minya",
  "Beni Suef",
  "Hurghada",
  "Sohag",
  "Qena",
];
const citiesArabic = [
  "القاهرة",
  "الإسكندرية",
  "الجيزة",
  "شبرا الخيمة",
  "بورسعيد",
  "السويس",
  "الأقصر",
  "أسيوط",
  "المنصورة",
  "طنطا",
  "الإسماعيلية",
  "الفيوم",
  "الزقازيق",
  "دمياط",
  "أسوان",
  "المنيا",
  "بني سويف",
  "الغردقة",
  "سوهاج",
  "قنا",
];

cities.forEach((e, index) => {
  citiesArabic.forEach((e2, index2) => {
    if (index === index2) {
      chooseCity.innerHTML += `<option value=${e}>${e2}</option>`;
    }
  });
});
let titletext;
chooseCity.addEventListener("change", async function () {
  var chooseCity = document.querySelector("#chooseCity");
  var selectedCity = chooseCity.options[chooseCity.selectedIndex];
  var selectedCityValue = selectedCity.value;
  const api = await fetch(
    `https://api.aladhan.com/v1/timingsByCity/09-09-2024?city=${selectedCityValue}&country=egypt&method=8`
  );
  const data = await api.json();

  const container3 = document.querySelector(".container3");
  container3.style.display = "block";
  const tittext = data.data.date.readable;
  titletext = tittext;

  const arr = Object.values(data.data.timings);
  if (container3.innerHTML !== "") {
    container3.innerHTML = "";
  }
  arr.forEach((e, indx1) => {
    prayers.forEach((e2, indx2) => {
      if (indx1 === indx2) {
        createSpans(e, e2);
      }
    });
  });
});

function createSpans(value, keys) {
  const container3 = document.querySelector(".container3");
  let span = document.createElement("span");
  span.innerHTML = `${keys} : ${value}`;
  span.style.cssText = "display:block;margin-left:25px";
  container3.appendChild(span);
}

const prayers = [
  "الفجر",
  "شروق الشمس",
  "الظهر",
  "العصر",
  "غروب الشمس",

  "المغرب",
  "العشاء",
];

const apiSuraText = `https://api.alquran.cloud/v1/surah/`;

nameSura.addEventListener("change", async function () {
  const nameSura = document.querySelector("#nameSura");
  const selectedSura = nameSura.options[nameSura.selectedIndex];
  const selectedSuraValue = selectedSura.value;
  const response = await fetch(`${apiSuraText}${selectedSuraValue}`);
  const data = await response.json();
  const container4 = document.querySelector(".container4");
  if (container4.innerHTML !== "") {
    container4.innerHTML = "";
  }
  const moonIcon2 = document.querySelector("#SuraText .fa-moon");
  moonIcon2.style.display = "block";
  let count = 1;
  container4.style.display = "block";
  

  data.data.ayahs.forEach((e, index) => {
   
      container4.innerHTML += `${e.text}(${count})`;
      count++;
    
  });
});

async function getSuraName() {
  const response = await fetch(` ${apiUrl}suwar?language=${lang}`);
  const data = await response.json();
  const nameSura = document.querySelector("#nameSura");
  nameSura.innerHTML = ` <option value="" disabled selected>  أختر </option>`;
  data.suwar.forEach((e, index) => {
    nameSura.innerHTML += `<option value=${index + 1}>${e.name}</option>`;
  });
}
getSuraName();

////////////////////////////////////////////////

let iconToogle = document.getElementById("toggole");
const ul = document.querySelector("ul");
iconToogle.addEventListener("click", function () {
  ul.classList.toggle("ul");
});
//////////////////////////////////////////////

async function AsmaaAllah() {
  let index;
  const container = document.querySelector("#AsmaaGod .container");
  container.style.width = "90%";
  container.style.fontSize = "30px";
  for (index = 1; index <= 77; index++) {
    const response = await fetch(
      `https://api.aladhan.com/v1/asmaAlHusna/${index}`
    );
    const data = await response.json();

    const span = document.createElement("span");
    span.style.cssText = "color:white;margin:5px";
    let faslaa = ",";
    if (index === 77) {
      faslaa = ".";
    }
    const textNode = document.createTextNode(`${data.data[0].name} ${faslaa}`);
    span.appendChild(textNode);
    container.appendChild(span);
  }
}
AsmaaAllah();

////////////////////////////
