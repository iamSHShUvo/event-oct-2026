(() => {
  const photos = window.EVENT_PHOTOS;
  const stageLabels = {
    shopping: "কেনাকাটা",
    prep: "প্রস্তুতি ও রান্না",
    packing: "প্যাকিং",
    transport: "পরিবহন",
    distribution: "বিতরণ",
    serving: "পরিবেশন",
    eating: "খাবার গ্রহণ",
    dua: "কিছু স্মৃতি এবং সকলের জন্য দোয়া",
    group: "দলীয় মুহূর্ত",
  };
  const locationLabels = {
    wasil: "ওয়াসিল উদ্দিন আহমদনগর মাদ্রাসা",
    ayesha: "মা আয়েশা সিদ্দিকা মহিলা মাদ্রাসা ও এতিমখানা",
    astha: "আস্থা নিবাস বৃদ্ধাশ্রম",
    general: "সামগ্রিক আয়োজন",
  };

  if (!Array.isArray(photos)) {
    throw new Error("gallery-data.js did not provide the EVENT_PHOTOS array.");
  }

  photos.sort((a, b) => a.display_order - b.display_order);

  const photoUrl = (photo) =>
    `assets/images/${encodeURIComponent(photo.filename)}`;
  const photoDescription = (photo) =>
    `${stageLabels[photo.stage] || photo.stage} · ${
      locationLabels[photo.location] || photo.location
    }`;

  function createPhotoCard(photo, index) {
    const card = document.createElement("figure");
    card.className = "photo-card";

    const button = document.createElement("button");
    button.className = "photo-trigger";
    button.type = "button";
    button.setAttribute("aria-label", `ছবি বড় করে দেখুন: ${photoDescription(photo)}`);

    const image = document.createElement("img");
    image.src = photoUrl(photo);
    image.alt = "১৭ অক্টোবর ২০২৬-এর আয়োজনের ছবি";
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
      const error = document.createElement("span");
      error.className = "image-error-message";
      error.textContent = "ছবিটি লোড হয়নি।";
      button.replaceChildren(error);
      console.error("Image file could not be loaded:", photo.filename);
    });

    button.addEventListener("click", () => openLightbox(index));
    button.appendChild(image);
    card.appendChild(button);
    return card;
  }

  function renderPhotos(target, matchingPhotos) {
    const grid = document.getElementById(target);
    if (!grid) {
      throw new Error(`Required photo grid is missing: #${target}`);
    }
    matchingPhotos.forEach((photo) => {
      grid.appendChild(createPhotoCard(photo, photos.indexOf(photo)));
    });
  }

  function renderVideo(target, filename, label) {
    const grid = document.getElementById(target);
    if (!grid) {
      throw new Error(`Required video grid is missing: #${target}`);
    }

    const card = document.createElement("div");
    card.className = "video-tile";
    const video = document.createElement("video");
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.setAttribute("aria-label", label);

    const source = document.createElement("source");
    source.src = `assets/videos/${encodeURIComponent(filename)}`;
    source.type = "video/mp4";
    video.appendChild(source);
    card.appendChild(video);
    video.addEventListener("error", () => {
      console.error("Video file could not be loaded:", filename);
    });
    grid.appendChild(card);
  }

  function setupLightbox() {
    const dialog = document.getElementById("lightbox");
    const image = document.getElementById("lightbox-img");
    let currentIndex = 0;

    function showPhoto() {
      const photo = photos[currentIndex];
      image.src = photoUrl(photo);
      image.alt = "১৭ অক্টোবর ২০২৬-এর আয়োজনের ছবি";
    }

    function openLightbox(index) {
      currentIndex = index;
      showPhoto();
      dialog.showModal();
    }

    function movePhoto(direction) {
      currentIndex = (currentIndex + direction + photos.length) % photos.length;
      showPhoto();
    }

    document
      .querySelector(".lightbox-close")
      .addEventListener("click", () => dialog.close());
    document
      .querySelector(".lightbox-prev")
      .addEventListener("click", () => movePhoto(-1));
    document
      .querySelector(".lightbox-next")
      .addEventListener("click", () => movePhoto(1));
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        movePhoto(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        movePhoto(1);
      }
    });

    return openLightbox;
  }

  const openLightbox = setupLightbox();

  document.querySelectorAll("[data-story-stages]").forEach((section) => {
    const stages = section.dataset.storyStages.split(",");
    const matchingPhotos = photos.filter((photo) => stages.includes(photo.stage));
    const grid = section.id === "dua"
      ? document.getElementById("stage-dua-photos")
      : section.querySelector(".photo-grid");
    if (!grid) {
      throw new Error(`Story section has no photo grid: #${section.id}`);
    }
    matchingPhotos.forEach((photo) => {
      grid.appendChild(createPhotoCard(photo, photos.indexOf(photo)));
    });
  });

  renderPhotos(
    "location-grid-wasil",
    photos.filter((photo) => photo.location === "wasil"),
  );
  renderPhotos(
    "location-grid-astha",
    photos.filter((photo) => photo.location === "astha"),
  );
  renderVideo(
    "location-grid-ayesha",
    "ma ayesha siddika madrasha.mp4",
    "মা আয়েশা সিদ্দিকা মহিলা মাদ্রাসা ও এতিমখানার আয়োজন",
  );
  renderVideo(
    "stage-dua-video",
    "doa video at wasil uddin madrasha.mp4",
    "ওয়াসিল উদ্দিন আহমদনগর মাদ্রাসা — কিছু স্মৃতি এবং সকলের জন্য দোয়া",
  );
})();
