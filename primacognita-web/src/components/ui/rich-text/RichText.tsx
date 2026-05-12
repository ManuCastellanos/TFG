import type { HTMLAttributes, ElementType } from "react";

type RichTextProps = HTMLAttributes<HTMLElement> & {
  html: string;
  as?: ElementType;
};

export const RichText = ({ html, as: Tag = "div", className, ...rest }: RichTextProps) => (
  <Tag
    className={className}
    dangerouslySetInnerHTML={{ __html: html }}
    {...rest}
  />
);
