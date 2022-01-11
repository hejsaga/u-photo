import React, { useState, useRef } from "react";
import { firebaseTimestampToString } from "../helpers/convertTimeStamp";
import { useParams } from "react-router-dom";
import CreateAlbum from "../components/CreateAlbum";
import ImageDropZone from "../components/ImageDropZone";
import ImageItem from "../components/ImageItem";
import useGetAlbum from "../hooks/useGetAlbum";
import useEditAlbum from "../hooks/useEditAlbum";
import useDeleteImage from "../hooks/useDeleteImages";
import useDeleteAlbum from "../hooks/useDeleteAlbum";
import { SRLWrapper } from "simple-react-lightbox";
import { Form } from "react-bootstrap";
import { AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import { BiDuplicate } from "react-icons/bi";
import { BsFolderSymlink } from "react-icons/bs";
import { FiEdit, FiSave } from "react-icons/fi";
import "../components/css/dropzone.scss";

const AlbumPage = () => {
  const { id } = useParams();
  const newAlbumTitle = useRef();
  const [showDropZone, setShowDropZone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditTitle, setShowEditTitle] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [reviewLink, setReviewLink] = useState();
  const { mutate, isMutating } = useDeleteAlbum(id);
  const deleteImage = useDeleteImage(selectedImages);
  const albumTitle = useEditAlbum(id);
  const album = useGetAlbum(id);

  const closeCreateAlbumModal = () => setShowModal(false);
  const showCreateAlbumModal = () => setShowModal(true);
  const toggleDropZone = () => setShowDropZone(!showDropZone);

  const handleSelectedImages = (image, e) => {
    if (e.target.checked) {
      // check if image exist in list of images to keep
      if (selectedImages.includes(image)) {
        return;
      } else {
        // if not, add it to array
        setSelectedImages([...selectedImages, image]);
      }
    } else {
      // if checkbox is unchecked, remove image from array
      setSelectedImages(selectedImages.filter((i) => i !== image));
    }
  };

  const handleDeleteImages = () => {
    const confirm = window.confirm(
      "Do you want to delete your selected images? They will be removed from this album forever."
    );
    if (confirm === true) {
      deleteImage.mutate(selectedImages, album);

      // Todo:
      // When you delete images the future element on that index will inherit the ::after class,
      // meaning it appears visually that those images are selected, even if they are not.
      // For the purpose of this assignment it does not matter, but is very bad indeed.
      setSelectedImages([]);
    }
  };

  const handleDeleteAlbum = () => {
    const confirm = window.confirm(
      "Do you really want to delete this album? This action is super destructive."
    );
    if (confirm === true) {
      mutate(album);
    }
  };

  const renameAlbum = (e) => {
    e.preventDefault();

    if (!newAlbumTitle.current.value.length) {
      return;
    }

    albumTitle.mutate(newAlbumTitle.current.value);

    newAlbumTitle.current.value = "";
    setShowEditTitle(false);
  };

  const handleShareAlbum = () => {
    // create a base url from protocol and host, since pathname includes album/:id
    let baseURL = window.location.protocol + "//" + window.location.host + "/";
    setReviewLink(`${baseURL}review/${id}`);
  };

  return (
    <>
      {album && (
        <>
          <div className="album-header">
            <h1>{album.name}</h1>
            <div className="album-actions">
              <button onClick={() => setShowEditTitle(!showEditTitle)}>
                <FiEdit className="album-icon" title="Edit album title" />
              </button>
              <button onClick={() => handleDeleteAlbum()}>
                <AiOutlineDelete
                  className="album-icon delete"
                  title="Delete album"
                />
              </button>
              <button onClick={() => handleShareAlbum()}>
                <BsFolderSymlink
                  className="album-icon share"
                  title="Share album"
                />
              </button>
            </div>
          </div>

          {showEditTitle && (
            <div className="new-album-title">
              <Form onSubmit={(e) => renameAlbum(e)}>
                <input
                  ref={newAlbumTitle}
                  placeholder="New album title"
                ></input>
                <button type="submit">
                  <FiSave />
                </button>
              </Form>
            </div>
          )}

          <p>{firebaseTimestampToString(album.created)}</p>

          {reviewLink && (
            <p style={{ overflowWrap: "break-word" }}>
              Share your album: <a href={reviewLink}>{reviewLink}</a>
            </p>
          )}
        </>
      )}

      <div className="image-and-actions-wrapper">
        <div className="album-actions">
          <button onClick={() => toggleDropZone()}>
            <AiOutlineCloudUpload
              className="album-icon"
              title="Upload images"
            />
          </button>
          <button
            onClick={() => showCreateAlbumModal()}
            disabled={!selectedImages.length}
          >
            <BiDuplicate
              className="album-icon"
              title="Create album from selected"
            />
          </button>
          <button
            onClick={() => handleDeleteImages()}
            disabled={!selectedImages.length}
          >
            <AiOutlineDelete className="album-icon" title="Delete images" />
          </button>
        </div>

        {showDropZone && (
          <div className="d-flex flex-column">
            <div className="align-self-end close-dropzone-button">
              <button onClick={() => setShowDropZone(false)}>Close</button>
            </div>
            <ImageDropZone albumId={id} />
          </div>
        )}

        {!isMutating && (
          <div className="mt-5">
            {album?.images.length < 1 ? (
              <p>No images.</p>
            ) : (
              <SRLWrapper>
                <div className="album-image-grid">
                  {album?.images &&
                    album?.images.map((image, i) => {
                      return (
                        <ImageItem
                          key={i}
                          image={image}
                          handleSelectedImages={handleSelectedImages}
                        />
                      );
                    })}
                </div>
              </SRLWrapper>
            )}
          </div>
        )}
      </div>

      <CreateAlbum
        show={showModal}
        handleClose={closeCreateAlbumModal}
        handleShow={showCreateAlbumModal}
        images={selectedImages}
        title="Create new album from selected"
      />
    </>
  );
};

export default AlbumPage;
