import dynamic from "next/dynamic";
import { Control, useController } from "react-hook-form";

export interface QuillFieldProps {
  name: string;
  control: Control<any>;
}
const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
];
export function QuillField({ name, control }: QuillFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  return (
    <div className={`${error && "ql-error"}`}>
      <QuillNoSSRWrapper
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        onBlur={onBlur}
        theme="snow"
      />
      <div className="h-5 text-red1">{error && error.message}</div>
    </div>
  );
}
