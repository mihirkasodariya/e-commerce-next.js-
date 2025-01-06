import ClipLoader from "react-spinners/ClipLoader";

export default function Loader() {
  return (
    <div className="absolute inset-0 bg-[#0000066] bg-opacity-50 backdrop-blur-sm back flex justify-center items-center z-50">
      <ClipLoader color="#0000FF" loading={true} size={50} />
    </div>
  );
}

