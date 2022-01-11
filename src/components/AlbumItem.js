import React, { useState } from "react";
import { firebaseTimestampToString } from "../helpers/convertTimeStamp";
import { Link } from "react-router-dom";
import { BsFolderFill } from "react-icons/bs";
import { Card } from "react-bootstrap";
import styles from "./css/Album.module.css";
import { MoonLoader } from "react-spinners";

const AlbumItem = ({ data, isLoading, selectedAlbum, setSelectedAlbum }) => {
  const [disableCheckbox, setDisableCheckbox] = useState(false);

  const onChangeAlbum = (e) => {
    if (e.target.checked) {
      // check if selected album is already set
      if (selectedAlbum === e.target.id) {
        return;
      } else {
        // if not, set it and disable all other checkboxes
        setSelectedAlbum(e.target.id);
        setDisableCheckbox(true);
      }
    }

    // if checkbox is unchecked, reset
    if (!e.target.checked) {
      setSelectedAlbum(null);
      setDisableCheckbox(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <div id="spinner">
          <MoonLoader color={"#888"} size={50} />
        </div>
      ) : (
        <>
          {data?.length ? (
            <>
              {data.map((album, i) => {
                return (
                  <Card key={i} className="d-flex justify-content-center">
                    <div className={styles.checkbox}>
                      <input
                        id={album.id}
                        className="custom-checkbox"
                        type="checkbox"
                        disabled={disableCheckbox && selectedAlbum !== album.id}
                        onChange={(e) => onChangeAlbum(e)}
                      />
                    </div>
                    <Card.Body
                      as={Link}
                      to={`/album/${album.id}`}
                      className="d-flex text-center justify-content-center text-decoration-none"
                    >
                      <div className="album-item">
                        <BsFolderFill className="album" />

                        <Card.Title>{album.name}</Card.Title>
                        <Card.Text>
                          {firebaseTimestampToString(album.created)}
                        </Card.Text>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </>
          ) : (
            <p>No albums to show.</p>
          )}
        </>
      )}
    </>
  );
};

export default AlbumItem;
