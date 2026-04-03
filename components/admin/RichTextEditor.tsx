"use client"

import { useEffect, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Youtube, { isValidYoutubeUrl } from "@tiptap/extension-youtube"
import { Html5Video } from "@/lib/tiptap/html5-video"
import ImagePicker from "./ImagePicker"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  label?: string
  /** Visible min height of the editing area */
  minHeightClass?: string
}

const toolbarBtn =
  "px-2 py-1 text-sm rounded border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"

export default function RichTextEditor({
  value,
  onChange,
  label,
  minHeightClass = "min-h-[140px]",
}: RichTextEditorProps) {
  const [imageModalOpen, setImageModalOpen] = useState(false)
  const [imageDraftUrl, setImageDraftUrl] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-700 underline" },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto my-4",
        },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: {
          class: "w-full max-w-full rounded-lg",
        },
      }),
      Html5Video,
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none px-3 py-2 ${minHeightClass}`,
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const next = value || ""
    if (next !== current) {
      editor.commands.setContent(next, { emitUpdate: false })
    }
  }, [value, editor])

  const insertImageFromUrl = (url: string) => {
    const u = url.trim()
    if (!editor || !u) return
    editor.chain().focus().setImage({ src: u, alt: "" }).run()
    setImageModalOpen(false)
    setImageDraftUrl("")
  }

  const insertVideo = () => {
    if (!editor) return
    const raw = window.prompt(
      "YouTube watch or youtu.be link, or a direct .mp4 / .webm / .ogg URL",
      "https://"
    )
    if (raw == null) return
    const url = raw.trim()
    if (!url) return

    if (isValidYoutubeUrl(url)) {
      editor.chain().focus().setYoutubeVideo({ src: url }).run()
      return
    }

    if (/\.(mp4|webm|ogg)(\?|#|$)/i.test(url)) {
      editor.chain().focus().insertContent({ type: "html5Video", attrs: { src: url } }).run()
      return
    }

    window.alert(
      "Unsupported URL. Use a YouTube link or a direct file URL ending in .mp4, .webm, or .ogg."
    )
  }

  if (!editor) {
    return (
      <div className="border border-gray-300 rounded-lg bg-gray-50 animate-pulse h-32" aria-hidden />
    )
  }

  const setLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined
    const url = window.prompt("Link URL", previous || "https://")
    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  return (
    <div className="space-y-1">
      {label && (
        <span className="block text-xs font-medium text-gray-600">{label}</span>
      )}
      <div className="border border-gray-300 rounded-lg overflow-hidden bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            className={toolbarBtn}
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            Bold
          </button>
          <button
            type="button"
            className={toolbarBtn}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            Italic
          </button>
          <button
            type="button"
            className={toolbarBtn}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </button>
          <button
            type="button"
            className={toolbarBtn}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          >
            H3
          </button>
          <button
            type="button"
            className={toolbarBtn}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            List
          </button>
          <button
            type="button"
            className={toolbarBtn}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </button>
          <button type="button" className={toolbarBtn} onClick={setLink}>
            Link
          </button>
          <button
            type="button"
            className={toolbarBtn}
            onClick={() => {
              setImageDraftUrl("")
              setImageModalOpen(true)
            }}
          >
            Image
          </button>
          <button type="button" className={toolbarBtn} onClick={insertVideo}>
            Video
          </button>
          <button
            type="button"
            className={toolbarBtn}
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          >
            Clear
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>

      {imageModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setImageModalOpen(false)}
          role="presentation"
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-4"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-labelledby="rte-image-title"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 id="rte-image-title" className="font-semibold text-gray-900">
                Insert image
              </h3>
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
                aria-label="Close"
              >
                &times;
              </button>
            </div>
            <ImagePicker
              value={imageDraftUrl}
              onChange={setImageDraftUrl}
              onUrlReady={(url) => insertImageFromUrl(url)}
              label=""
              prefix="media"
              overlayZIndex={110}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setImageModalOpen(false)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => insertImageFromUrl(imageDraftUrl)}
                className="px-3 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Insert from URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
