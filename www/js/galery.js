const BACKEND_URL = "https://ruleappserver-10d4170b9aef.herokuapp.com";

let pageID = 0;
let smallImages = true;

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

function scrollToTop(element) {
	element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function printTagsSelected() {
	let tagsHTML = "";

	tagsSelected.forEach((tag, index) => {
		if (index == 0) {
			tagsHTML += `<li class="py-2 font-sans font-semibold text-white flex items-center mx-1 text-sm list-none bg-black text-white p-1 px-4 rounded-full">${tag}</li>`;
		} else
			tagsHTML += `<li class="py-2 font-sans font-semibold text-stone-400 flex items-center mx-1 text-sm list-none bg-gray-100 text-black p-1 px-4 rounded-full">${tag}</li>`;
	});
	document.getElementById("tagsSelected").innerHTML = tagsHTML;
}
function printimages() {
	document.getElementById("pageNumber").innerHTML = `<span>Page ${
		pageID + 1
	}</span>`;

	if (smallImages) {
		for (let i = 0; i < iamgeGalery.length; i++) {
			if (i % 2 == 0) {
				imageCol1.push(iamgeGalery[i]);
			} else {
				imageCol2.push(iamgeGalery[i]);
			}
		}

		for (let i = 0; i < imageCol1.length; i++) {
			if (i == imageCol1.length - 1) {
				imageCol1HTML += `<img onclick="showImageFullSize('${imageCol1[i].high_res_file.url}')" src="${imageCol1[i].preview_file.url}" class="mb-2 rounded-lg w-full object-cover" style="height: 200px" />`;
			} else
				imageCol1HTML += `<img onclick="showImageFullSize('${imageCol1[i].high_res_file.url}')" src="${imageCol1[i].preview_file.url}" class="mb-2 rounded-lg max-h-100 w-full object-cover" />`;
		}
		for (let i = 0; i < imageCol2.length; i++) {
			if (i == imageCol2.length - 1) {
				imageCol2HTML += `<img onclick="showImageFullSize('${imageCol2[i].high_res_file.url}')" src="${imageCol2[i].preview_file.url}" class="mb-2 rounded-lg w-full object-cover" style="height: 370px" />`;
			} else
				imageCol2HTML += `<img onclick="showImageFullSize('${imageCol2[i].high_res_file.url}')" src="${imageCol2[i].preview_file.url}" class="mb-2 rounded-lg max-h-100 w-full object-cover" />`;
		}

		document.getElementById("galeryCol1").innerHTML = imageCol1HTML;
		document.getElementById("galeryCol2").innerHTML = imageCol2HTML;
		document.getElementById("bigImagesGalery").innerHTML = "";
	} else {
		let bigImagesHTML = "";
		document.getElementById("galeryCol1").innerHTML = "";
		document.getElementById("galeryCol2").innerHTML = "";
		for (let i = 0; i < iamgeGalery.length; i++) {
			bigImagesHTML += `<img onclick="showImageFullSize('${iamgeGalery[i].high_res_file.url}')" src="${iamgeGalery[i].low_res_file.url}" class="mb-2 rounded-lg w-full object-cover" style="max-height: 1000px" />`;
		}
		document.getElementById("bigImagesGalery").innerHTML = bigImagesHTML;
	}
}

async function getGaleyImages() {
	tagsSelected = await JSON.parse(
		await window.localStorage.getItem("tagsSelected")
	);
	printTagsSelected();
	let tagsUser = await JSON.parse(
		await window.localStorage.getItem("tagsSelected")
	).join("%7C");

	let reqOptions = {
		url: `${BACKEND_URL}/rule/galery/${tagsUser}/${pageID}`,
		method: "GET",
	};

	let response = await axios.request(reqOptions);

	if (!response.data.null) {
		iamgeGalery = response.data;
		console.log(response.data);
		printimages();
	} else {
		console.log("no se ha encontrado nada");
	}
}

getGaleyImages();
function nextPage() {
	iamgeGalery = [];
	imageCol1 = [];
	imageCol2 = [];
	imageCol1HTML = "";
	imageCol2HTML = "";
	pageID++;

	getGaleyImages();
	scrollToTop(document.getElementById("galeryContainer"));
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
		scrollToTop(document.getElementById("galeryContainer"));
	}
}

function changeImagesSize() {
	smallImages = !smallImages;
	printimages();
	scrollToTop(document.getElementById("galeryContainer"));
}

async function showImageFullSize(imageLink) {
	console.log(imageLink);
	window.localStorage.setItem("fullImage", imageLink);
	window.location.href = "./showFullImage.html";
}
