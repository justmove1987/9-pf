import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/react";

export interface ImageBlockOptions {
  src: string;
  alt?: string;
  width?: string;
  float?: "none" | "left" | "right";
}

const ImageBlockComponent: React.FC<NodeViewProps> = ({ node }) => {
  const { src, alt, width = "100%", float = "none" } = node.attrs as ImageBlockOptions;

  return (
    <NodeViewWrapper className="image-block">
      <img
        src={src}
        alt={alt || ""}
        style={{
          width,
          float,
          margin: float !== "none" ? "0 1rem 1rem 0" : "1rem 0",
        }}
        className="rounded shadow-sm"
      />
    </NodeViewWrapper>
  );
};

export const ImageBlock = Node.create({
  name: "imageBlock",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      src: { default: "" },
      alt: { default: null },
      width: { default: "100%" },
      float: { default: "none" },
    };
  },

  parseHTML() {
    return [{ tag: "img" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageBlockComponent);
  },

  addCommands() {
    return {
      setImageBlock:
        (options: ImageBlockOptions) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },

      updateImageBlock:
        (options: Partial<ImageBlockOptions>) =>
        ({ commands }) => {
          return commands.updateAttributes(this.name, options);
        },
    };
  },
});
