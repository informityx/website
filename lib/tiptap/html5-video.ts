import { Node, mergeAttributes } from "@tiptap/core"

/** Direct file URL (.mp4, .webm, .ogg) as HTML5 &lt;video&gt;. */
export const Html5Video = Node.create({
  name: "html5Video",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: "video[src]" }]
  },

  renderHTML({ HTMLAttributes }) {
    if (!HTMLAttributes.src) {
      return ["div", { class: "text-sm text-gray-500" }, "Missing video URL"]
    }
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: true,
        class: "w-full max-w-full rounded-lg my-4",
        playsInline: true,
      }),
    ]
  },
})
