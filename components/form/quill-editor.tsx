import dynamic from "next/dynamic";
import { LegacyRef, useCallback, useEffect, useRef } from "react";
import { Control, useController } from "react-hook-form";
import ReactQuill, { ReactQuillProps } from "react-quill";

export interface QuillFieldProps {
  name: string;
  control: Control<any>;
  showError: boolean;
}

interface ReactQuillWrapperProps extends ReactQuillProps {
  forwardedRef: LegacyRef<ReactQuill>;
}
const ReactQuillWrapper = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");

    const Component = ({ forwardedRef, ...props }: ReactQuillWrapperProps) => {
      return <RQ ref={forwardedRef} {...props} />;
    };
    return Component;
  },
  {
    ssr: false,
  }
);

export function QuillField({
  name,
  control,
  showError = true,
}: QuillFieldProps) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const editorRef = useRef(null);
  const cloudinaryWidgetRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dwkj5j3pn",
        uploadPreset: "zbni3jap",
        multiple: false,
        clientAllowedFormats: ["image"],
        maxImageFileSize: 2000000,
      },
      // @ts-ignore
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          const quill = editorRef.current;
          // @ts-ignore
          const range = quill?.getEditorSelection?.();
          if (quill && range) {
            quill
              // @ts-ignore
              .getEditor()
              ?.insertEmbed?.(range.index, "image", result.info?.secure_url);
          }
        }
      }
    );
    cloudinaryWidgetRef.current = widget;
  }, []);

  const imageHandler = useCallback(() => {
    //@ts-ignore
    if (cloudinaryWidgetRef.current) cloudinaryWidgetRef.current.open?.();
    console.log("click");
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6] }, { font: [] }],
        [{ color: [] }, { background: [] }],
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

      handlers: {
        image: imageHandler,
      },
    },

    // clipboard: {
    //   matchVisual: false,
    // },
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
    "background",
    "color",
  ];
  return (
    <div className={`${error && "ql-error"}`}>
      <ReactQuillWrapper
        value={value}
        onChange={(content) => {
          onChange(content);
        }}
        modules={modules}
        formats={formats}
        onBlur={onBlur}
        theme="snow"
        forwardedRef={editorRef}
      />
      {showError && (
        <div className="h-5 text-red1">{error && error.message}</div>
      )}
    </div>
  );
}
