 feather.replace();

    $("#buttomGoToGalery").click(function (event) {
      goToGalery();
    });
    $("#searchTagsInput").on("input", function () {
      searchTags($(this).val());
    });

    const BACKEND_URL = "https://ruleappserver-10d4170b9aef.herokuapp.com";
    const tagsSelected = [];
    const tagsSearched = [];

    //hacer scroll hasta el final de las tags
    function scrollToHorizontalEnd(element) {
      element.scrollLeft = element.scrollWidth - element.clientWidth;
    }
    //==========================================================================

    function deleteTagsSelected(index) {
      tagsSelected.splice(index, 1);
      document.getElementById("tagsSelected").innerHTML = tagsSelected.map(
        (tag, index) => {
          return `<li style="white-space: nowrap"  class="h-9 hover:opacity-40 mx-1 items-center justify-center flex font-bold list-none bg-black text-white p-1 px-4 rounded-full"><span class="ml-2">${tag}</span><img class="w-4 h-4 ml-1" onclick="deleteTagsSelected(${index})" src="./img/close.svg"/></li>`;
        }
      );
    }

    function addTags(tags) {
      $("#tagsSelected").html("");
      tagsSelected.push(tags);

      tagsSelected.forEach((tag, index) => {
        $("#tagsSelected").append(
          `<li onclick="deleteTagsSelected(${index})" style="white-space: nowrap"  class="h-9 hover:opacity-40 mx-1 items-center justify-center flex font-bold list-none bg-cueternary-color text-white p-1 px-4  rounded-xl"><span class="ml-2">${tag}</span><img class="w-4 h-4 ml-1" src="./img/close.svg"/></li>`
        );
      });

      const scrollableElement = document.getElementById("tagsSelected");
      scrollToHorizontalEnd(scrollableElement);
      document.getElementById("searchTagsInput").value = "";
    }

    function showSelectedTags(tags) {
      $("#tagsSearched").html("");
      tags.forEach((tag) => {
        $("#tagsSearched").append(
          `<li onclick="addTags('${tag.name}')" style="white-space: nowrap" class="hover:opacity-40 flex items-center w-auto mx-1 max-h-9 list-none bg-secondary-color text-white p-1 px-2 rounded-xl" > ${tag.name} <i stroke="white" stroke-width="1" data-feather="arrow-right" style="width: 20px; height: 20px" class="ml-1" ></i></li>`
        );
      });
      feather.replace();
    }

    async function searchTags(el) {
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

    function goToGalery() {
      window.localStorage.setItem("tagsSelected", JSON.stringify(tagsSelected));
      window.location.href = "./galery.html";
    }

    function removeCurrentPage() {
      window.localStorage.removeItem("currentPage");
    }
    removeCurrentPage();