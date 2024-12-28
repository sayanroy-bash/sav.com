import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const ItemType = "PHOTO"; // Type identifier for DnD

function Photos() {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    setFiltered(currentPage);
  }, [currentPage]);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/photos")
      .then((res) => {
        setPhotos(res.data);
        setCurrentPage(res.data.slice(0, itemsPerPage));
      })
      .catch((err) => console.log(err));
  }, []);

  function handleChange(e) {
    e.preventDefault();
    setFiltered(
      photos.filter((photo) =>
        photo.title.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  }

  function logout() {
    localStorage.removeItem("auth");
    navigate("/");
  }

  function goToPage(page) {
    setCurrentPageNumber(page);
    const start = (page - 1) * itemsPerPage;
    setCurrentPage(photos.slice(start, start + itemsPerPage));
  }

  // Generate pagination buttons
  function renderPagination() {
    const totalPages = Math.ceil(photos.length / itemsPerPage);
    const pages = [];

    // Always show the first page
    if (currentPageNumber > 3) {
      pages.push(
        <button key={1} onClick={() => goToPage(1)}>
          1
        </button>
      );
      if (currentPageNumber > 4) pages.push(<span key="start-ellipsis">...</span>);
    }

    // Show adjacent pages and current page
    for (
      let i = Math.max(1, currentPageNumber - 2);
      i <= Math.min(totalPages, currentPageNumber + 2);
      i++
    ) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={i === currentPageNumber ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    // Always show the last page
    if (currentPageNumber < totalPages - 2) {
      if (currentPageNumber < totalPages - 3)
        pages.push(<span key="end-ellipsis">...</span>);
      pages.push(
        <button key={totalPages} onClick={() => goToPage(totalPages)}>
          {totalPages}
        </button>
      );
    }

    return pages;
  }

  // Handle reordering of items
  const movePhoto = (dragIndex, hoverIndex) => {
    const updatedPhotos = [...filtered];
    const [draggedPhoto] = updatedPhotos.splice(dragIndex, 1);
    updatedPhotos.splice(hoverIndex, 0, draggedPhoto);
    setFiltered(updatedPhotos);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <input
        type="search"
        id="search"
        placeholder="Search"
        onChange={(event) => handleChange(event)}
      />
      <button onClick={logout}>Logout</button>
      <div id="gallery">
        {filtered.map((photo, index) => (
          <DraggablePhoto
            key={photo.id}
            index={index}
            photo={photo}
            movePhoto={movePhoto}
          />
        ))}
      </div>
      <div id="pages">
        {
            renderPagination()
        }
      </div>
    </DndProvider>
  );
}

function DraggablePhoto({ photo, index, movePhoto }) {
  const ref = React.useRef(null);

  // Implement Drag
  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
  });

  // Implement Drop
  const [, drop] = useDrop({
    accept: ItemType,
    hover: (item) => {
      if (item.index !== index) {
        movePhoto(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ marginBottom: "10px", border: "1px solid #ccc", padding: "10px" }}>
      <img src={photo.thumbnailUrl} alt={photo.title} loading="lazy" />
      <p>{photo.title}</p>
    </div>
  );
}

export default Photos;
