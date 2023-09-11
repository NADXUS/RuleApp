function getImageLink() {
	let imageLink = window.localStorage.getItem("fullImage");
	let typeFile = imageLink.split(".").pop();
	console.log(typeFile);
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
    muted
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
	console.log(imageLink);
}
getImageLink();
