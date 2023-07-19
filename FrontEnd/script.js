//Code js de la page index.html

//Fonction fetch qui envoie un requête pour récupèrer les données du backend via l'API
let photoFiltre = [];
async function fetchCard() {
  const response = await fetch("http://localhost:5678/api/works");
  photoFiltre = await response.json();
  for (article of photoFiltre) {
    createCard(article);
  }
  createModaleCard(photoFiltre);
}
fetchCard();

const galleryElt = document.querySelector(".gallery");

//suppression des éléments de la galerie
const cleanGallery = () => {
  while (galleryElt.firstChild) {
    galleryElt.removeChild(galleryElt.firstChild);
  }
};

cleanGallery();
//Fonction pour créer les cartes de la galerie et leur différentes caractéristiques
function createCard(liste) {
  
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    imageElement.setAttribute("crossorigin", "anonymous"); //pour le bug
    imageElement.setAttribute("alt", article.title);
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = article.title;
    figureElement.setAttribute("data-id", article.categoryId);

    //DOM pour rattacher les éléments au html
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);
    galleryElt.appendChild(figureElement);
  
}

/*récuperer données catégories*/
const responseCategory = fetch("http://localhost:5678/api/categories")
  .then((res) => res.json())
  .then((data) => {
    return data;
  });

const getCategory = async () => {
  const data = await responseCategory;
  const createButton = (id, category) => {
    const btnElt = document.createElement("button");
    btnElt.classList.add("filtre");
    btnElt.textContent = category;
    btnElt.value = id;

    btnElt.addEventListener("click", (e) => {
      const btnList = document.querySelectorAll(".filtre-selected");

      //si btn du filtre cliqué est différent du filtre actuel
      if (btnList[0] !== btnElt) {
        btnList[0].classList.remove("filtre-selected");

        if (galleryElt.hasChildNodes()) {
          const btnAll = 0;

          if (
            (id === btnAll &&
              photoFiltre.length !== galleryElt.childElementCount) ||
            photoFiltre.length !== galleryElt.childElementCount
          ) {
            cleanGallery();
            createCard(photoFiltre);
          }

          if (id !== btnAll) {
            [...galleryElt.children].forEach((item) => {
              if (item.dataset.id !== id.toString()) {
                item.remove();
              }
            });
          }
        }
      }

      btnElt.classList.add("filtre-selected");
    });

    return btnElt;
  };

  const divElt = document.createElement("div");
  divElt.id = "filtre-liste";

  const btnAll = createButton(0, "Tous");
  btnAll.classList.add("filtre-selected");

  divElt.appendChild(btnAll);

  for (category of data) {
    const btn = createButton(category.id, category.name);
    divElt.appendChild(btn);
  }

  galleryElt.before(divElt);
};


const token = localStorage.getItem("token");
//Création évènement "click" sur loginLink ("login")
const loginLink = document.getElementById("log");
loginLink.addEventListener("click", () => {
    //Si le token est stocké, l'utilisateur est connecté (affiche "logout" sur la page d'accueil)
    if (token !== undefined) {
        localStorage.removeItem("token");
        
        //window.location.href = "index.html";
        
        //sinon le token n'est pas stocké, l'utilisateur n'est pas connecté (affiche "login" sur la page d'accueil)
    } else {
        window.location.href = "login.html";
        loginLink.innerText = "login";
    }
});

const modeEditionHeader = document.getElementById("mode-edition");
modeEditionHeader.style.display = "none";



if (token) {
    modeEditionHeader.style.display = "block";
    loginLink.innerText = "logout";
    loginLink.setAttribute("href", "index.html");
} else{
    getCategory();
    const modifyTable = document.querySelectorAll('.modifier');
    modifyTable.forEach(elt=>elt.style.display='none');
}

//Partie fenêtre modale
//Fonction pour ouvrir la modale
const openModale = function (e) {
  e.preventDefault();
  modale = document.getElementById("window-modale");
  modale.style.display = "flex";
  modale.addEventListener("click", closeModale);
  modale.querySelector("#cross").addEventListener("click", closeModale);
  modale.querySelector(".modale").addEventListener("click", stopPropagation);
};
//Fonction pour fermer la modale
const closeModale = function (e) {
  e.preventDefault();
  modale.style.display = "none";
  modale.removeEventListener("click", closeModale);
  modale.querySelector("#cross").removeEventListener("click", closeModale);
  modale.querySelector(".modale").removeEventListener("click", stopPropagation);
  removeImg();
};
//pour stopper la propagation de l'événement vers les éléments parents
const stopPropagation = function (e) {
  e.stopPropagation();
};

document.querySelectorAll(".modifier").forEach((a) => {
  a.addEventListener("click", openModale);
});

//Fonction pour créer les cartes de la galerie dans la modale
function createModaleCard(article) {
  for (let i = 0; i < article.length; i++) {
    const figureElement = document.createElement("figure");
    const imageElement = document.createElement("img");
    imageElement.src = article[i].imageUrl;
    imageElement.setAttribute("alt", article[i].title);
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash", "icone", "trash");
    const arrowMoveIcon = document.createElement("i");
    arrowMoveIcon.classList.add(
      "fa-solid",
      "fa-arrows-up-down-left-right",
      "icone",
      "arrow"
    );
    const figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = "éditer";
    figureElement.setAttribute("data-id", article[i].id);
    //DOM pour rattacher les éléments au html
    document.querySelector(".modale-gallery").appendChild(figureElement);
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);
    figureElement.appendChild(trashIcon);
    figureElement.appendChild(arrowMoveIcon);
  }
}

//Fonction pour interchanger de modale
const addPhotoButton = document.getElementById("bouton-ajouter");
addPhotoButton.addEventListener("click", function () {
  switchModaleView(true);
});
const backModaleArrow = document.getElementById("arrow");
backModaleArrow.addEventListener("click", function () {
  switchModaleView(false);
  removeImg();
});

function switchModaleView(isListeView) {
  const firstModale = document.getElementById("first-modale");
  const secondModale = document.getElementById("second-modale");
  if (isListeView) {
    secondModale.style.display = "flex";
    firstModale.style.display = "none";
    backModaleArrow.style.visibility = "visible";
  } else {
    secondModale.style.display = "none";
    firstModale.style.display = "flex";
    backModaleArrow.style.visibility = "hidden";
  }
}

//Partie pour ajouter une image dans la galerie
const newImage = document.getElementById("bouton-search");
const newImagePreview = document.getElementById("image-preview");
const newObjetImage = document.getElementById("objet");
const newTitleImage = document.getElementById("title-image");
const validButton = document.getElementById("bouton-valider");
//Fonction pour selectionner l'image
newImage.addEventListener("change", function () {
  const selectedFile = newImage.files[0];
  if (selectedFile) {
    const imgUrl = URL.createObjectURL(selectedFile);
    const img = document.createElement("img");
    img.src = imgUrl;
    newImagePreview.innerHTML = "";
    newImagePreview.appendChild(img);
    //supprime les autres éléments pour qu'il n'y ait que l'image
    const sendImage = document.getElementsByClassName("send-image");
    Array.from(sendImage).forEach((e) => {
      e.style.display = "none";
    });
    updateButtonColor();
  }
});

//Fonction du changement de couleur du bouton valider quand image et titre sont présents
function updateButtonColor() {
  if (newTitleImage.value != "" && newImagePreview.firstChild) {
    validButton.style.backgroundColor = "#1D6154";
  } else {
    validButton.style.backgroundColor = "";
  }
}
newTitleImage.addEventListener("input", updateButtonColor);

//Fonction pour "réinitialiser" image + titre + alertes quand on quitte/change la modale
function removeImg() {
  newTitleImage.value = "";
  const sendImage = document.getElementsByClassName("send-image");
  const img = newImagePreview.querySelector("img");
  Array.from(sendImage).forEach((e) => {
    e.style.display = "block";
  });
  if (img) {
    newImagePreview.removeChild(img);
  }
  const addImageError = document.getElementById("add-image-error");
  addImageError.style.display = "none";
}

validButton.addEventListener("click", (e) => {
  e.preventDefault();
  const addImageError = document.getElementById("add-image-error");
  addImageError.style.display = "flex";
  addImageError.style.color = "red";
  // Vérifie si le champ du titre est vide
  if (newTitleImage.value === "") {
    addImageError.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Titre manquant`;
    return;
  }
  //Vérifie si le champ image est vide
  if (!newImagePreview.firstChild) {
    addImageError.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Image manquante`;
    return;
  }
  //Vérifie la taille de l'image
  const maxSize = 4 * 1024 * 1024; // 4 Mo en bytes
  const selectedFile = newImage.files[0];
  if (selectedFile.size > maxSize) {
    addImageError.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Taille image supérieur à 4Mo`;
    return;
  }
  updateButtonColor();

  //Création de formData pour envoyer les données de la nouvelle image
  const formData = new FormData();
  formData.append("image", newImage.files[0]);
  formData.append("title", newTitleImage.value);
  formData.append("category", newObjetImage.value);

  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
    .then(response=>response.json())
    .then((data) => {
      const addImageOk = document.getElementById("add-image-error");
      addImageOk.innerHTML = `<i class="fa-solid fa-circle-check"></i> Image ajoutée avec succès !`;
      addImageOk.style.color = "green";
      createCard(data)
    })
    .catch((error) => {
      console.error("Erreur", error);
      addImageError.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Erreur lors de l'ajout de l'image`;
    });
});

//Partie pour supprimer une image de la galerie (au click de la poubelle)

const gallery = document.querySelector(".modale-gallery");
gallery.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash")) {
    const figure = e.target.closest("figure");
    const dataId = figure.getAttribute("data-id");
    confirmDelete(figure, dataId);
  }
});

//Fonctions pour confirmer/annuler la suppression d'une photo
function confirmDelete(figure, dataId) {
  const confirmDelete = document.getElementById("third-modale");
  confirmDelete.style.display = "flex";
  const confirmNo = document.getElementById("confirm-no");
  confirmNo.addEventListener("click", confirmNoClick);
  const confirmYes = document.getElementById("confirm-yes");
  confirmYes.addEventListener("click", confirmYesClick);

  function confirmNoClick() {
    confirmNo.removeEventListener("click", confirmNoClick);
    confirmYes.removeEventListener("click", confirmYesClick);
    confirmDelete.style.display = "none";
  }
  function confirmYesClick() {
    confirmNo.removeEventListener("click", confirmNoClick);
    confirmYes.removeEventListener("click", confirmYesClick);
    confirmDelete.style.display = "none";
    deleteImage(dataId);
    figure.remove();
  }
}

function deleteImage(id) {
  fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  }).then((response) => {
    if (response.ok) {
      dynamicCard();
    } else {
      alert("Erreur lors de la suppression de l'image");
    }
  });
}

//Fonction qui met à jour la galerie de manière dynamique à chaque ajout/suppression d'image
function dynamicCard() {
  fetch(`http://localhost:5678/api/works`).then((response) => {
    if (response.ok) {
      document.querySelector(".gallery").innerHTML = "";
      document.querySelector(".modale-gallery").innerHTML = "";
      fetchCard();
    }
  });
}