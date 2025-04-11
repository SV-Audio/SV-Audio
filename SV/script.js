const audiobooks = [
    {
      title: "Die Abenteuer des Apollo: Band 1",
      cover: "covers/550x550.jpg",
      files: [
        "audio/Aufzeichnung (110).mp3",
        "audio/Aufzeichnung (111).mp3",
        "audio/Aufzeichnung (112).mp3",
        "audio/Aufzeichnung (110).mp",
        "audio/Aufzeichnung (110).mp",
        "audio/Aufzeichnung (110).mp",
        "audio/Aufzeichnung (110).mp",
        "audio/Aufzeichnung (110).mp",
        "audio/Aufzeichnung (110).mp",
        "audio/Aufzeichnung (110).mp"
      ]
    },
    {
      title: "Weitere Hörbücher folgen...",
      cover: "covers/prinz.jpg",
      files: [
        "audio/prinz.mp3"
      ]
    },
    {
      title: "Weitere Hörbücher folgen...",
      cover: "covers/alice.jpg",
      files: [
        "audio/alice1.mp3",
        "audio/alice2.mp3",
        "audio/alice3.mp3"
      ]
    }
  ];
  
  const bookList = document.getElementById("book-list");
  const search = document.getElementById("search");
  const audio = document.getElementById("audio");
  const currentTitle = document.getElementById("current-title");
  const coverImg = document.getElementById("cover-img");
  const playlistDiv = document.getElementById("playlist");
  
  let currentBook = null;
  let currentChapterIndex = 0;
  
  function renderList(filter = "") {
    bookList.innerHTML = "";
    audiobooks
      .filter(book => book.title.toLowerCase().includes(filter.toLowerCase()))
      .forEach(book => {
        const li = document.createElement("li");
        const img = document.createElement("img");
        img.src = book.cover;
        img.alt = "Cover";
  
        const titleSpan = document.createElement("span");
        titleSpan.textContent = book.title;
  
        li.appendChild(img);
        li.appendChild(titleSpan);
        li.addEventListener("click", () => playBook(book));
        bookList.appendChild(li);
      });
  }
  
  function playBook(book) {
    currentBook = book;
    currentChapterIndex = 0;
    playChapter(currentChapterIndex);
    coverImg.src = book.cover;
    currentTitle.textContent = "📖 " + book.title;
    renderPlaylist(book);
  }
  
  function playChapter(index) {
    audio.src = currentBook.files[index];
    audio.play();
    updateActiveChapter();
  }
  
  function renderPlaylist(book) {
    playlistDiv.innerHTML = "";
  
    book.files.forEach((file, idx) => {
      const div = document.createElement("div");
      div.classList.add("chapter");
      div.dataset.index = idx;
      div.innerHTML = `<span>Kapitel: ${idx + 1}</span><span>Lädt...</span>`;
  
      const tempAudio = new Audio(file);
      tempAudio.addEventListener("loadedmetadata", () => {
        const mins = Math.floor(tempAudio.duration / 60);
        const secs = Math.floor(tempAudio.duration % 60)
          .toString()
          .padStart(2, "0");
        div.children[1].textContent = `${mins}:${secs}`;
      });
  
      div.addEventListener("click", () => {
        currentChapterIndex = idx;
        playChapter(currentChapterIndex);
      });
  
      playlistDiv.appendChild(div);
    });
  
    updateActiveChapter();
  }
  
  function updateActiveChapter() {
    const chapters = document.querySelectorAll(".chapter");
    chapters.forEach((c, i) => {
      c.classList.toggle("active", i === currentChapterIndex);
    });
  }
  
  audio.addEventListener("ended", () => {
    if (currentBook && currentChapterIndex < currentBook.files.length - 1) {
      currentChapterIndex++;
      playChapter(currentChapterIndex);
    }
  });
  
  search.addEventListener("input", () => {
    renderList(search.value);
  });
  
  renderList();
  