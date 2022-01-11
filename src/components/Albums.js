import React, { useState } from "react";
import useGetAllAlbums from "../hooks/useGetAllAlbums";
import CreateAlbum from "./CreateAlbum";
import AlbumItem from "./AlbumItem";
import { BsFolderPlus, BsFolderSymlink } from "react-icons/bs";
import { MoonLoader } from "react-spinners";

const Albums = () => {
  const baseURL = window.location.href;
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState();
  const [reviewLink, setReviewLink] = useState();
  const { data, isLoading } = useGetAllAlbums();

  const handleClose = () => setShowCreateNew(false);
  const handleShow = () => setShowCreateNew(true);

  const handleShareAlbum = () => {
    // baseURL on window is http://localhost:3000/ (on local host)
    setReviewLink(`${baseURL}review/${selectedAlbum}`);
  };

  return (
    <>
      {isLoading ? (
        <div id="spinner">
          <MoonLoader color={"#888"} size={50} />
        </div>
      ) : (
        <>
          <h1>Your albums</h1>
          <div className="album-actions mt-4 mb-2">
            <button onClick={handleShow}>
              <BsFolderPlus className="album-icon" title="Create new album" />
            </button>

            <button
              onClick={() => handleShareAlbum()}
              disabled={!selectedAlbum?.length}
            >
              <BsFolderSymlink className="album-icon" title="Share album" />
            </button>
          </div>

          {reviewLink && (
            <p style={{ overflowWrap: "break-word" }}>
              Link for sharing: {reviewLink}
            </p>
          )}

          <div className="album-grid">
            <AlbumItem
              data={data}
              isLoading={isLoading}
              selectedAlbum={selectedAlbum}
              setSelectedAlbum={setSelectedAlbum}
            />
          </div>

          <CreateAlbum
            show={showCreateNew}
            handleClose={handleClose}
            handleShow={handleShow}
            images={[]}
            title={"Create album"}
          />
        </>
      )}
    </>
  );
};

export default Albums;
