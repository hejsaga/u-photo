import { useState } from "react";
import { useParams } from "react-router-dom";
import { doc, collection, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, deleteObject } from "firebase/storage";
import useGetAllAlbums from "../hooks/useGetAllAlbums";

const useDeleteImages = () => {
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isMutating, setIsMutating] = useState(null);
  const { data } = useGetAllAlbums();

  const mutate = async (imagesToDelete, album) => {
    setError(null);
    setIsError(false);
    setIsMutating(true);

    try {
      // since there is no simple method to remove objects from arrays in firebase,
      // we will select the images to keep by filtering out the ones to remove,
      // and overwrite the image array with the new selection.

      // copy of images from db
      let originalArray = album.images;

      // filter out the image references to keep
      let newArray = originalArray.filter(
        (item) => !imagesToDelete.includes(item)
      );

      const collectionRef = collection(db, "albums");

      const ref = doc(collectionRef, id);

      // overwrite what is currently in database with the image references to keep
      await updateDoc(ref, {
        images: newArray,
      });
    } catch (e) {
      setError(e.message);
      setIsError(true);
    } finally {
      setIsMutating(false);

      // when the image reference is deleted,
      // check if it was the last reference to that image
      // and if the image therefore can be removed from storage

      let allImages = [];

      // iterate through all albums
      data.map((album) => {
        // push all image references from every album into one list
        album.images.forEach((arrayObject) => {
          allImages.push(arrayObject);
        });
      });

      imagesToDelete.forEach(async (object) => {
        // find if any object to delete is found in the list with all image references
        // ...which they all obviously should be at least once
        let matches = allImages.filter(
          (anyObject) => object.uuid === anyObject.uuid
        );

        // if we get more than one match, do nothing
        if (matches?.length > 1) {
          return;
        } else {
          // if only one reference is found, ✨ the last object reference ✨, remove the image from storage
          await deleteObject(ref(storage, object.path));
        }
      });
    }
  };

  return {
    error,
    isError,
    isMutating,
    mutate,
  };
};

export default useDeleteImages;
