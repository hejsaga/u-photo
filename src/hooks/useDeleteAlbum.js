import { useState } from "react";
import useGetAllAlbums from "../hooks/useGetAllAlbums";
import { doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const useDeleteAlbum = (id) => {
  const { data } = useGetAllAlbums();
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(null);
  const navigate = useNavigate();

  const mutate = async (album) => {
    setError(null);
    setIsError(false);
    try {
      let imagesToDelete = album.images;
      let allImages = [];

      // iterate through all albums
      data.map((album) => {
        // push all image references from every album into one list
        album.images.forEach((arrayObject) => {
          allImages.push(arrayObject);
        });
      });

      // delete the album
      await deleteDoc(doc(db, "albums", id));

      // find if any object to delete is found in the list with all image references
      imagesToDelete.forEach(async (object) => {
        let matches = allImages.filter(
          (anyObject) => object.uuid === anyObject.uuid
        );

        // if we get more than one match, do not delete from storage
        if (matches?.length > 1) {
          return;
        } else {
          // if only one reference is found, ✨ the last object reference ✨, remove the image from storage
          await deleteObject(ref(storage, object.path));
        }
      });
    } catch (e) {
      setError(e.message);
      setIsError(true);
    } finally {
      navigate("/");
    }
  };

  return { error, isError, mutate };
};

export default useDeleteAlbum;
