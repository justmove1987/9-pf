// front/mi-app/src/extensions/ImageBlock.tsx
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/core";

export interface ImageBlockOptions {
  src: string;
  alt?: string;
  width?: string;
  float?: "none" | "left" | "right";
}

const ImageBlockComponent: React.FC<NodeViewProps> = ({ node }) => {
  const { src, alt, width = "100%", float = "none" } =
    node.attrs as ImageBlockOptions;

  return (
    <NodeViewWrapper
      style={{
        display: "block",
        clear: float === "none" ? "both" : undefined,
      }}
    >
      <img
        src={src}
        alt={alt || ""}
        style={{
          width,
          maxWidth: "100%",
          height: "auto",
          float: float, // 👈 això permet alinear a left o right
          margin:
            float === "left"
              ? "0 1rem 1rem 0"
              : float === "right"
              ? "0 0 1rem 1rem"
              : "1rem auto",
          display: float === "none" ? "block" : "inline-block",
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
    return ReactNodeViewRenderer(ImageBlockComponent); // 👈 correcte
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
