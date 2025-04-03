import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { Label } from "../ui/label";
import { XIcon, UploadCloud, FileIcon } from "lucide-react";

function ProductImageUpload() {
  const [imageFile, setImageFile] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files?.[0];
    console.log(selectedFile);
    if (selectedFile) setImageFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) setImageFile(droppedFile);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  async function uploadImageToCloudinary() {
    if (!imageFile) return;
    
    setImageLoading(true);
    
    const data = new FormData();
    data.append("my_file", imageFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data
      );

      console.log(response, "response");

      if (response?.data?.success) {
        setUploadedImageUrl(response.data.result.url);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setImageLoading(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {!imageFile ? (
          <>
            <UploadCloud className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag and Drop or Click to upload an image</span>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <FileIcon className="w-8 h-8 text-primary mr-2" />
              <p className="text-sm font-medium">{imageFile.name}</p>
            </div>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground p-2 rounded-full"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4" />
              <span className="sr-only">Remove File</span>
            </button>
          </div>
        )}
      </div>

      <input
        id="image-upload"
        type="file"
        className="hidden"
        ref={inputRef}
        onChange={handleImageFileChange}
      />

      {imageLoading && <p className="text-center mt-2">Uploading...</p>}

      {uploadedImageUrl && (
        <div className="mt-4">
          <p className="text-sm font-semibold">Uploaded Image:</p>
          <img src={uploadedImageUrl} alt="Uploaded Preview" className="mt-2 w-full rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
}

export default ProductImageUpload;
