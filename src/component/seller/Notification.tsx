import { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import { closeDialog } from "@/store/dialogSlice";
import { projectName } from "@/util/config";
import { uploadFile } from "@/store/adminSlice";
import { sendNotificationToSeller } from "@/store/sellerSlice";

interface Props {
    sendAllNotification: (formData: FormData, type: string) => void;
}

const Notification: any = ({ }) => {
    const dispatch = useDispatch();
    const { dialogueData } = useSelector((state: any) => state.dialogue);
    const [title, setTitle] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [imagePath, setImagePath] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);

    const [error, setError] = useState<{
        title: string;
        message: string;
        type: string;
        image: string;
    }>({
        title: "",
        message: "",
        type: "",
        image: "",
    });

    useEffect(() => {
        return () => {
            setTitle("");
            setImagePath("");
            setMessage("");
            setType("");
            setImage(null);
            setError({
                title: "",
                message: "",
                type: "",
                image: "",
            });
        };
    }, []);

    const handleSubmit = (row : any) => {
        if (!title || !message) {
            const newError: { [key: string]: string } = {};
            if (!title) newError.title = "Title is required!";
            if (!message) newError.message = "Message is required!";
           

            setError((prev) => ({ ...prev, ...newError }));
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("message", message);
        formData.append("image", image);

        const payload : any = {
            title,
            message,
            image,
            sellerId : dialogueData?._id
        }

        dispatch(sendNotificationToSeller(payload));
        dispatch(closeDialog());
    };

    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setImage(selectedFile);
            setImagePath(URL.createObjectURL(selectedFile));
            setError((prevErrors) => ({ ...prevErrors, image: "" }));
        }
    };

    const showImg = (url: string) => {
        window.open(url, "_blank");
    };

    let folderStructure: string = `${projectName}/admin/notificationImage`;
    
      const handleFileUpload = async (event: any) => {
        // Get the uploaded file from the event
        const file = event.target.files[0];
        const formData = new FormData();
    
        formData.append("folderStructure", folderStructure);
        formData.append("keyName", file.name);
        formData.append("content", file);
    
        // Create a payload for your dispatch
        const payloadformData = {
          data: formData,
        };
    
        if (formData) {
          const response = await dispatch(
            uploadFile(payloadformData)
          ).unwrap();
    
          if (response?.data?.status) {
            
            if (response.data.url) {
              setImage(response.data.url);
              setImagePath(response.data.url);
            }
          }
        }
      };

    return (
        <div className="mainDialogue fade-in">
            <div className="Dialogue">
                <div className="dialogueHeader">
                    <div className="headerTitle fw-bold">Notification</div>
                </div>
                <div className="dialogueMain bg-white mx-4 new_notification_box" style={{ overflow: "auto" }}>
                    <div className="mt-2">
                        <Input
                            label="Title"
                            id="title"
                            type="text"
                            value={title}
                            errorMessage={error.title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setError((prev) => ({
                                    ...prev,
                                    title: e.target.value ? "" : "Title is required!",
                                }));
                            }}
                        />
                        <Input
                            label="Description"
                            id="message"
                            type="text"
                            value={message}
                            errorMessage={error.message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                                setError((prev) => ({
                                    ...prev,
                                    message: e.target.value ? "" : "Message is required!",
                                }));
                            }}
                        />
                        {/* <Input
                            label="Image (Optional)"
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                        /> */}
                        {error.image && <p className="errorMessage">{error.image}</p>}
                        {imagePath && (
                            <div className="image-start">
                                <img
                                    src={imagePath}
                                    alt="Uploaded Preview"
                                    width={80}
                                    height={80}
                                    className="m-0 cursor rounded p-1"
                                    onClick={() => showImg(imagePath)}
                                    style={{ boxShadow: "0px 5px 10px 0px rgba(0, 0, 0, 0.5)" }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="dialogueFooter">
                        <div className="dialogueBtn d-flex justify-content-end gap-2">
                            <Button
                                onClick={(row) => handleSubmit(row)}
                                btnName={"Submit"}
                                type={"button"}
                                newClass={"submit-btn"}
                                style={{
                                    borderRadius: "0.5rem",
                                    width: "80px",
                                    marginLeft: "10px",
                                }}
                            />
                            <Button
                                onClick={() => dispatch(closeDialog())}
                                btnName={"Close"}
                                newClass={"close-model-btn"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default connect(null, {})(Notification);
