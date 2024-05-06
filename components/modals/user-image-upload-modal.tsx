import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { useDropzone } from "react-dropzone";
import { Transition, Dialog } from "@headlessui/react";
// hooks
import { UserCircle2 } from "lucide-react";



import { FileService } from "@/services/file.service";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { MAX_FILE_SIZE } from "@/constants/common";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { User } from "@prisma/client";
// services

// ui
// icons
// constants

type Props = {
  handleDelete?: () => void;
  isOpen: boolean;
  isRemoving: boolean;
  onClose: () => void;
  onSuccess: (url: string) => void;
  value: string | null;
  currentUserUpdate: any;
  currentUser: User | undefined
};

// services
// const fileService = new FileService();

export const UserImageUploadModal: React.FC<Props> = observer((props) => {
  const { value, onSuccess, isOpen, onClose, isRemoving, handleDelete, currentUser, currentUserUpdate } = props;
  // states
  const [image, setImage] = useState<File[] | null>(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  // store hooks

  const { startUpload } = useUploadThing("imageUploader")
  const onDrop = (acceptedFiles: File[]) => setImage(acceptedFiles);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".svg", ".webp"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const handleClose = () => {
    setImage(null);
    setIsImageUploading(false);
    onClose();
  };

  const handleSubmit = async () => {

    if (!image) return
    setIsImageUploading(true);

    const imgRes = await startUpload(image);
    if (imgRes) {
      onSuccess(imgRes[0].url)
      await currentUserUpdate({
        ...currentUser,
        user: {
          ...currentUser,
          avatar: imgRes[0].url
        },
      });
      setImage(null);
    }


    // if (!image) return;



    // const formData = new FormData();
    // formData.append("asset", image);
    // formData.append("attributes", JSON.stringify({}));
    // console.log(image)
    // const imgRes = await startUpload(image);
    // console.log(imgRes)
    // fileService
    //   .uploadUserFile(formData)
    //   .then((res: any) => {
    //     const imageUrl = res.asset;

    //     onSuccess(imageUrl);
    //     setImage(null);

    //     // if (value) fileService.deleteUserFile(value);
    //   })
    //   .catch((err: any) =>
    //     toast.error("Ah, não! algo deu errado.", {
    //       description: err?.error ?? "Houve um problema com a sua requisição.",
    //     })
    //   )
    //   .finally(() => setIsImageUploading(false));
  };


  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-30" onClose={handleClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-custom-backdrop transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-30 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-custom-background-100 px-5 py-8 text-left shadow-custom-shadow-md transition-all sm:w-full sm:max-w-xl sm:p-6">
                <div className="space-y-5">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-custom-text-100">
                    Upload Image
                  </Dialog.Title>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <div
                        {...getRootProps()}
                        className={`relative grid h-80 w-80 cursor-pointer place-items-center rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-custom-primary focus:ring-offset-2 ${(image === null && isDragActive) || !value
                          ? "border-2 border-dashed border-custom-border-200 hover:bg-custom-background-90"
                          : ""
                          }`}
                      >
                        {image !== null || (value && value !== "") ? (
                          <>
                            <button
                              type="button"
                              className="absolute right-0 top-0 z-40 -translate-y-1/2 translate-x-1/2 rounded bg-custom-background-90 px-2 py-0.5 text-xs font-medium text-custom-text-200"
                            >
                              Edit
                            </button>
                            <img
                              src={image ? URL.createObjectURL(image[0]) : value ? value : ""}
                              alt="image"
                              className="absolute left-0 top-0 h-full w-full rounded-md object-cover"
                            />
                          </>
                        ) : (
                          <div>
                            <UserCircle2 className="mx-auto h-16 w-16 text-custom-text-200" />
                            <span className="mt-2 block text-sm font-medium text-custom-text-200">
                              {isDragActive ? "Drop image here to upload" : "Drag & drop image here"}
                            </span>
                          </div>
                        )}

                        <input {...getInputProps()} type="text" />
                      </div>
                    </div>
                    {fileRejections.length > 0 && (
                      <p className="text-sm text-red-500">
                        {fileRejections[0].errors[0].code === "file-too-large"
                          ? "The image size cannot exceed 5 MB."
                          : "Please upload a file in a valid format."}
                      </p>
                    )}
                  </div>
                </div>
                <p className="my-4 text-sm text-custom-text-200">
                  File formats supported- .jpeg, .jpg, .png, .webp, .svg
                </p>
                <div className="flex items-center justify-between">
                  {handleDelete && (
                    <Button size="sm" className="bg-red-500 text-white" onClick={handleDelete} disabled={!value} loading={isRemoving}>
                      Remover
                    </Button>
                  )}
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant={"outline"} onClick={handleClose}>
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmit}
                      disabled={!image}
                      loading={isImageUploading}
                      className="text-white"
                    >
                      Enviar e salvar
                    </Button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
});
