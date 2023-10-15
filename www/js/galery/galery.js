/* mostrar menu inferior al hacer scroll */
$(window).scroll(function (event) {
  var scroll = $(window).scrollTop();
  if (scroll > 100) {
    $("#appNavigationButtom").css("margin-top", "-60px");
  } else {
    $("#appNavigationButtom").css("margin-top", "20px");
  }
});
/* ======================================= */

const BACKEND_URL = "https://ruleappserver-10d4170b9aef.herokuapp.com";

let pageID = 0;

feather.replace();

let iamgeGalery = [];

let tagsSelected = [
  { id: 1, name: "one_piece" },
  { id: 2, name: "animated" },
  { id: 2, name: "luffy" },
  { id: 2, name: "luffy_nami" },
  { id: 2, name: "animated" },
];

let imageCol1 = [];
let imageCol2 = [];
let imageCol1HTML = "";
let imageCol2HTML = "";

$("#searchTagsInput").on("input", function () {
  searchTagsInput($(this).val());
});

//hacer scroll hasta el final de las tags
function scrollToHorizontalEnd(element) {
  element.scrollLeft = element.scrollWidth - element.clientWidth;
}

function scrollTopWindow(animateValue = 0) {
  $("html, body").animate({ scrollTop: 0 }, animateValue);
}
function scrollBottomWindow() {
  $("html, body").animate({ scrollTop: $(document).height() }, "slow");
}
//==========================================================================
function showLoadingComponent(show) {
  show == true
    ? $("#loadingContainer").removeClass("hidden")
    : $("#loadingContainer").addClass("hidden");
}

async function deleteTagsSelected(index) {
  $("#tagsSelectedSearch").html("");

  tagsSelected.splice(index, 1);

  tagsSelected.map((tag, index) => {
    $("#tagsSelectedSearch").append(
      `<li onclick="deleteTagsSelected(${index})" style="white-space: nowrap"  class="h-9 hover:opacity-40 mr-2 items-center justify-center flex list-none bg-secondary-color text-white p-1 px-3 rounded-xl"><span class="ml-2">${tag}</span><img class="w-4 h-4 ml-1 opacity-60" src="./img/x(1).svg"/></li>`
    );
  });
  await window.localStorage.setItem(
    "tagsSelected",
    JSON.stringify(tagsSelected)
  );
  pageID = 0;
  window.localStorage.setItem("currentPage", "0");
  getGaleyImages();
}
async function showSelectedTagsOnInit() {
  $("#tagsSelectedSearch").html("");
  tagsSelected = [];
  tagsSelected = await JSON.parse(window.localStorage.getItem("tagsSelected"));

  tagsSelected.map((tag, index) => {
    $("#tagsSelectedSearch").append(
      `<li onclick="deleteTagsSelected(${index})" style="white-space: nowrap"  class="h-9 hover:opacity-40 mr-2 items-center justify-center flex list-none bg-secondary-color text-white p-1 px-3 rounded-xl"><span class="ml-2">${tag}</span><img class="w-4 h-4 ml-1 opacity-60" src="./img/x(1).svg"/></li>`
    );
  });

  const scrollableElement = document.getElementById("tagsSelectedSearch");
  document.getElementById("searchTagsInput").value = "";
}
function addTags(tags) {
  $("#tagsSelectedSearch").html("");

  tagsSelected.push(tags);

  tagsSelected.map((tag, index) => {
    $("#tagsSelectedSearch").append(
      `<li onclick="deleteTagsSelected(${index})" style="white-space: nowrap"  class="h-9 hover:opacity-40 mr-2 items-center justify-center flex list-none bg-secondary-color text-white p-1 px-3 rounded-xl"><span class="ml-2">${tag}</span><img class="w-4 h-4 ml-1 opacity-60" src="./img/x(1).svg"/></li>`
    );
  });

  const scrollableElement = document.getElementById("tagsSelectedSearch");
  scrollToHorizontalEnd(scrollableElement);
  document.getElementById("searchTagsInput").value = "";
}

function showSelectedTags(tags) {
  $("#tagsSearched").html("");

  $("#tagsSearched").removeClass("hidden");
  tags.map((tag) => {
    $("#tagsSearched").append(
      `<li onclick="addTags('${tag.name}')" style="white-space: nowrap" class="hover:opacity-40 flex items-center w-auto mx-1 max-h-9 list-none bg-secondary-color text-white p-1 px-3 rounded-xl" > ${tag.name} <i stroke="white" stroke-width="1" data-feather="arrow-right" style="width: 15px; height: 15px" class="ml-1" ></i> </li>`
    );
  });
  feather.replace();
}

async function searchTagsInput(el) {
  const textoConGuiones = el.replaceAll(/ /g, "_");
  $("#searchTagsInput").val(textoConGuiones);

  let reqOptions = {
    url: `${BACKEND_URL}/rule/tags/${el}`,
    method: "GET",
  };

  let response = await axios.request(reqOptions);
  if (!response.data.null) {
    showSelectedTags(response.data);
  } else {
    console.log("no se ha encontrado nada");
  }
}

function scrollToTop(element) {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
  //element.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function printRelatedSelected() {
  /*  $("#tagsSearched").html(""); */

  let reqOptions = {
    url: `${BACKEND_URL}/rule/tags/${tagsSelected[0]}`,
    method: "GET",
  };

  let response = await axios.request(reqOptions);
  if (!response.data.null) {
    /* $("#tagsSearched").removeClass("hidden"); */
    showSelectedTags(response.data);
    /* response.data.forEach((tag, index) => {
              tags.map((tag) => {});
              $("#tagsSearched").append(
                `<li onclick="addTags('${tag.name}')" style="white-space: nowrap" class="hover:opacity-40 flex items-center w-auto mx-1 max-h-9 list-none bg-secondary-color text-white p-1 px-3 rounded-xl" > ${tag.name} <i stroke="white" stroke-width="1" data-feather="arrow-right" style="width: 15px; height: 15px" class="ml-1" ></i> </li>`
              );
            }); */
  } else {
    console.log("no se ha encontrado nada");
  }
}
async function printimages() {
  let smallImagesLocalStorage = await window.localStorage.getItem(
    "smallImages"
  );
  $("#galeryCol1").html("");
  $("#galeryCol2").html("");
  $("#bigImagesGalery").html("");
  imageCol1 = [];
  imageCol2 = [];
  imageCol1HTML = "";
  imageCol2HTML = "";

  document.getElementById("pageNumber").innerHTML = `<span>Page ${
    pageID + 1
  }</span>`;

  if (smallImagesLocalStorage == "true") {
    for (let i = 0; i < iamgeGalery.length; i++) {
      if (i % 2 == 0) {
        imageCol1.push(iamgeGalery[i]);
      } else {
        imageCol2.push(iamgeGalery[i]);
      }
    }

    for (let i = 0; i < imageCol1.length; i++) {
      if (imageCol1[i].media_type == "video") {
        imageCol1HTML += `<div class="relative overflow-hidden">
                  <div style="margin-top: -65px; margin-left: -48px" class="rounded-xl flex bg-secondary-color justify-center items-center absolute top-full left-full w-10 h-10">
                    <i
                      stroke-width="1"
                      data-feather="play"
                      style="width: 20px; height: 20px;"
                    ></i>
                  </div>
                  <img onclick="showImageFullSize('${imageCol1[i].high_res_file.url}')" src="${imageCol1[i].preview_file.url}" class="mb-4 rounded-xl w-full object-cover" style="height: 200px" />
                  </div>`;
      } else
        imageCol1HTML += `<div class="relative overflow-hidden">
                  <img onclick="showImageFullSize('${imageCol1[i].high_res_file.url}')" src="${imageCol1[i].preview_file.url}" class="mb-4 rounded-xl w-full object-cover" style="height: 200px" />
                  </div>`;

      //imageCol1HTML += `<img onclick="showImageFullSize('${imageCol1[i].high_res_file.url}')" src="${imageCol1[i].preview_file.url}" class="mb-4 rounded-xl max-h-100 w-full object-cover" style="min-height:130px" /> `;
    }
    for (let i = 0; i < imageCol2.length; i++) {
      if (imageCol2[i].media_type == "video") {
        imageCol2HTML += `<div class="relative overflow-hidden">
                  <div style="margin-top: -65px; margin-left: -48px" class="rounded-xl flex bg-secondary-color justify-center items-center absolute top-full left-full w-10 h-10">
                    <i
                      stroke-width="1"
                      data-feather="play"
                      style="width: 20px; height: 20px;"
                    ></i>
                  </div>
                  <img onclick="showImageFullSize('${imageCol2[i].high_res_file.url}')" src="${imageCol2[i].preview_file.url}" class="mb-4 rounded-xl w-full object-cover" style="height: 200px" />
                  </div>`;
      } else
        imageCol2HTML += `<div class="relative overflow-hidden">
                  <img onclick="showImageFullSize('${imageCol2[i].high_res_file.url}')" src="${imageCol2[i].preview_file.url}" class="mb-4 rounded-xl w-full object-cover" style="height: 200px" />
                  </div>`;

      /* if (i == imageCol2.length - 1) {
              imageCol2HTML += `<img onclick="showImageFullSize('${imageCol2[i].high_res_file.url}')" src="${imageCol2[i].preview_file.url}" class="mb-4 rounded-xl w-full object-cover" style="height: 370px" />`;
            } else
              imageCol2HTML += `<img onclick="showImageFullSize('${imageCol2[i].high_res_file.url}')" src="${imageCol2[i].preview_file.url}" class="mb-4 rounded-xl max-h-100 w-full object-cover" style="min-height:130px" /> `; */
    }

    document.getElementById("galeryCol1").innerHTML = imageCol1HTML;
    document.getElementById("galeryCol2").innerHTML = imageCol2HTML;
    document.getElementById("bigImagesGalery").innerHTML = "";
    feather.replace();
    showLoadingComponent(false);
  } else {
    let bigImagesHTML = "";
    document.getElementById("galeryCol1").innerHTML = "";
    document.getElementById("galeryCol2").innerHTML = "";
    for (let i = 0; i < iamgeGalery.length; i++) {
      if (iamgeGalery[i].media_type == "video") {
        bigImagesHTML += `<div class="relative overflow-hidden">
                  <div style="margin-top: -70px; margin-left: -58px" class="rounded-xl flex bg-secondary-color justify-center items-center absolute top-full left-full w-10 h-10">
                    <i
                      stroke-width="1"
                      data-feather="play"
                      style="width: 20px; height: 20px;"
                    ></i>
                  </div>
                  <img onclick="showImageFullSize('${iamgeGalery[i].high_res_file.url}')" src="${iamgeGalery[i].low_res_file.url}" class="mb-5 rounded-lg w-[calc(100%-20px)] mx-3 object-cover" style="max-height: 1000px" />                  </div>`;
      } else
        bigImagesHTML += `<img onclick="showImageFullSize('${iamgeGalery[i].high_res_file.url}')" src="${iamgeGalery[i].low_res_file.url}" class="mb-5 rounded-lg w-[calc(100%-20px)] mx-3 object-cover" style="max-height: 1000px" />`;
    }
    document.getElementById("bigImagesGalery").innerHTML = bigImagesHTML;
    feather.replace();
    showLoadingComponent(false);
  }
  //scrollToTop();
}

async function getGaleyImages() {
  showLoadingComponent(true);
  tagsSelected = await JSON.parse(window.localStorage.getItem("tagsSelected"));
  $("#tagsSearched").addClass("hidden");

  printRelatedSelected();
  let tagsUser = await JSON.parse(
    window.localStorage.getItem("tagsSelected")
  ).join("%7C");

  let currentPage = window.localStorage.getItem("currentPage");
  if (currentPage == null) {
    pageID = 0;
  } else {
    pageID = Number(currentPage);
  }

  let reqOptions = {
    url: `${BACKEND_URL}/rule/galery/${tagsUser}/${pageID}`,
    method: "GET",
  };

  let response = await axios.request(reqOptions);

  if (!response.data.null) {
    iamgeGalery = response.data;
    printimages();
    showSelectedTagsOnInit();
    scrollTopWindow();
  } else {
    console.log("no se ha encontrado nada");
  }
}

getGaleyImages();

async function useSearchInWeb() {
  await window.localStorage.setItem(
    "tagsSelected",
    JSON.stringify(tagsSelected)
  );
  iamgeGalery = [];
  pageID = 0;
  window.localStorage.setItem("currentPage", "0");

  /* $("#searchContainer").addClass("hidden"); */

  getGaleyImages();
}

function openSearchInweb() {
  $("#searchContainer").removeClass("hidden");
}

function nextPage() {
  iamgeGalery = [];
  imageCol1 = [];
  imageCol2 = [];
  imageCol1HTML = "";
  imageCol2HTML = "";
  pageID++;

  getGaleyImages();
  window.localStorage.setItem("currentPage", pageID);
}

function previousPage() {
  iamgeGalery = [];
  imageCol1 = [];
  imageCol2 = [];
  imageCol1HTML = "";
  imageCol2HTML = "";

  if (pageID !== 0) {
    pageID--;

    getGaleyImages();
    //scrollToTop(document.getElementById("galeryContainer"));
    window.localStorage.setItem("currentPage", pageID);
  }
}

async function changeImagesSize() {
  let smallImages = await window.localStorage.getItem("smallImages");
  if (smallImages == "true") {
    window.localStorage.setItem("smallImages", "false");
  } else {
    window.localStorage.setItem("smallImages", "true");
  }

  printimages();
  scrollTopWindow();
}

async function showImageFullSize(imageLink) {
  window.localStorage.setItem("fullImage", imageLink);
  $("#appShowImageFull").html(`
      <div
      id="imageContainer"
      class="w-screen h-screen flex justify-center items-center fixed top-0 left-0 z-30 bg-primary-color"
      ></div>
      <div
      	class="fixed bg-secondary-color flex justify-center items-center top-0 left-0 z-40 m-5 w-15 h-15 rounded-xl"
      >
      <i
      	onclick="closeImageFullSize()"
      	stroke-width="1"
      	data-feather="arrow-left"
      	style="width: 35px; height: 35px; opacity: 0.4"
      	class="m-2"
      ></i>
      </div>
      `);
  $("#appShowImageFull").removeClass("hidden");
  getImageLink();
  feather.replace();
}

function closeImageFullSize() {
  $("#appShowImageFull").addClass("hidden");
  $("#appShowImageFull").html("");
}

function getImageLink() {
  let imageLink = window.localStorage.getItem("fullImage");
  let typeFile = imageLink.split(".").pop();
  let HTMLImageLink;
  if (typeFile == "mp4") {
    HTMLImageLink = `<video
      					data-src="${imageLink}"
      					poster="${imageLink}"
      					controls="controls"
      					loop="loop"
      					playsinline=""
      					preload="none"
      					class="h-screen w-screen"
      					autoplay
      					style="aspect-ratio: 1920 / 1080"
      					src="${imageLink}"
      					></video>`;
  } else {
    HTMLImageLink =
      "<img class='w-full h-full object-contain relative z-10' src='" +
      imageLink +
      "' /> <img class='blur absolute w-full h-full object-cover z-0' src='" +
      imageLink +
      "' />";
  }

  document.getElementById("imageContainer").innerHTML = HTMLImageLink;
}

/* function showSearchPageNumber() {
        $("#changePageNumberContainer").removeClass("hidden");
        scrollBottomWindow();
      } */
function searchPageNumberFuntion() {
  let inputValue = parseInt($("#searchPageNumberInput").val());
  if (inputValue && inputValue > 0) {
    pageID = inputValue - 1;
    window.localStorage.setItem("currentPage", inputValue - 1);
    getGaleyImages();
    //$("#changePageNumberContainer").addClass("hidden");
    $("#searchPageNumberInput").val("");
  } else {
    $("#searchPageNumberInput").val("");
  }
}
