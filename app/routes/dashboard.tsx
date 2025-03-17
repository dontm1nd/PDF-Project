import { useState } from "react";
import { jsPDF } from "jspdf";
import { LoaderFunction, redirect } from "@remix-run/node";
import { getUserFromSession } from "~/utils/session";
import { useLoaderData, Form } from "@remix-run/react";


export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUserFromSession(request);
    if (!user) return redirect("/login"); // Falls nicht eingeloggt, zurück zur Login-Seite
    return { user };
  };


export default function ImageToPdfConverter() {
    const [images, setImages] = useState<string[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        handleFiles(Array.from(event.target.files));
    };

    const handleFiles = (files: File[]) => {
        const imagePreviews = files.map((file) => URL.createObjectURL(file));
        setImages((prev) => [...prev, ...imagePreviews]);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (!event.dataTransfer.files) return;
        handleFiles(Array.from(event.dataTransfer.files));
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const convertToPdf = () => {
        const pdf = new jsPDF();
        images.forEach((img, index) => {
            if (index > 0) pdf.addPage();
            pdf.addImage(img, "JPEG", 10, 10, 180, 160);
        });
        pdf.save("converted.pdf");
    };

    return (
        <div className="min-h-screen items-center justify-center bg-gradient-animated">
            <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl flex flex-col min-h-screen items-center justify-center">
                <div className="md:flex w-full p-3">
                    <div
                        className="relative h-60 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out w-full"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    >
                        <input
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFileChange}
                        />
                        <div className="absolute flex flex-col items-center cursor-pointer">
                            <img alt="File Icon" className="mb-3 w-1/2" src="/img/jpg.png" />
                            <span className="block text-gray-500 font-semibold">Drag & drop your files here</span>
                            <span className="block text-gray-400 font-normal mt-1">or click to upload</span>
                        </div>
                    </div>
                </div>
                <div className="w-full p-3 grid grid-cols-3 gap-2">
                    {images.map((src, index) => (
                        <img key={index} src={src} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg shadow-md" />
                    ))}
                </div>
                <button 
                    onClick={convertToPdf}
                    className="w-40 h-16 text-gray-500 font-semibold bg-gray-50 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow hover:cursor-pointer mt-4"
                >
                    Convert to PDF
                </button>
            </div>


            {/* Logout-Formular */}
            <Form method="post" action="/logout">
            <button
                type="submit"
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
                Logout
            </button>
            </Form>
        </div>
    );
}
