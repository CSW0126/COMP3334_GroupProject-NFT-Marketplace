import classNames from "classnames";
import { useField } from "formik";
import { TextareaHTMLAttributes } from "react";

type TextAreaProps = {
  name: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = (props: TextAreaProps) => {
  const [, { error, value }, { setValue }] = useField(props.name);

  return (
    <textarea
      className={classNames("flex-grow resize-none rounded border px-2 py-1 dark:bg-black dark:text-white mb-2 mt-2", {
        "border-black dark:border-white": !error,
        "border-red-500": error,
      })}
      placeholder="description"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
};

export default TextArea;
