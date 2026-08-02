"use client";

import Link from "@tiptap/extension-link";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { blocksToHtml } from "@/lib/rich-text";

/**
 * The editor writes into a hidden input so the surrounding form keeps working
 * exactly as it did with a textarea: same server action, same FormData key.
 * The value is a JSON array of top-level blocks — splitting happens here, where
 * a real DOM parser is available, rather than by pattern-matching on the server.
 */
function splitIntoBlocks(html: string) {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  return Array.from(parsed.body.children)
    .filter((element) => element.textContent?.trim() || element.querySelector("img"))
    .map((element) => element.outerHTML);
}

function countWords(editor: Editor) {
  const text = editor.getText({ blockSeparator: " " }).trim();
  return text ? text.split(/\s+/).length : 0;
}

type ToolbarButtonProps = {
  label: string;
  icon: typeof Bold;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function ToolbarButton({ label, icon: Icon, active, disabled, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      // Buttons inside a form default to submitting; they must also not steal
      // focus from the selection they are about to act on.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`admin-editor-tool${active ? " is-active" : ""}`}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}

export function RichTextEditor({
  name,
  initialBlocks,
  required = false,
  placeholder = "Yazmaya buradan başlayın…",
  requiredMessage = "Bu alan boş bırakılamaz.",
}: {
  name: string;
  initialBlocks: string[];
  required?: boolean;
  placeholder?: string;
  requiredMessage?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [words, setWords] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [linkDraft, setLinkDraft] = useState<string | null>(null);
  // Toolbar highlighting depends on cursor position, which React cannot see;
  // bumping this on every editor transaction keeps the buttons in sync.
  const [, setTick] = useState(0);

  const sync = useCallback((editor: Editor) => {
    if (inputRef.current) {
      const blocks = splitIntoBlocks(editor.getHTML());
      inputRef.current.value = JSON.stringify(blocks);
    }
    setWords(countWords(editor));
    setError(null);
  }, []);

  const editor = useEditor({
    // Next renders this on the server first; deferring the first paint avoids a
    // hydration mismatch between the server HTML and the mounted editor.
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // Deliberately narrow: an NGO editor needs prose, not code blocks or
        // rules, and every extra control is one more thing to explain.
        codeBlock: false,
        code: false,
        horizontalRule: false,
        link: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
    ],
    content: blocksToHtml(initialBlocks),
    editorProps: {
      attributes: {
        class: "admin-editor-surface",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor: instance }) => sync(instance),
    onSelectionUpdate: () => setTick((value) => value + 1),
  });

  // Seed the hidden input with the existing content, so saving a form without
  // touching the body does not wipe it.
  useEffect(() => {
    if (editor) sync(editor);
  }, [editor, sync]);

  // A hidden input cannot carry `required` — browsers refuse to submit and
  // cannot focus the field to explain why. Guard the form directly instead and
  // surface a message the editor can actually point at.
  useEffect(() => {
    if (!required || !editor) return;
    const form = wrapperRef.current?.closest("form");
    if (!form) return;
    const validate = (event: SubmitEvent) => {
      if (!editor.getText().trim()) {
        event.preventDefault();
        setError(requiredMessage);
        wrapperRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        editor.commands.focus();
      }
    };
    form.addEventListener("submit", validate);
    return () => form.removeEventListener("submit", validate);
  }, [editor, required, requiredMessage]);

  const applyLink = useCallback(() => {
    if (!editor) return;
    const value = (linkDraft ?? "").trim();
    if (!value) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      const href = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(value) ? value : `https://${value}`;
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
    }
    setLinkDraft(null);
  }, [editor, linkDraft]);

  if (!editor) {
    return <div className="admin-editor-shell" aria-busy="true"><div className="admin-skeleton h-48 w-full" /></div>;
  }

  return (
    <div ref={wrapperRef} className={`admin-editor-shell${error ? " has-error" : ""}`}>
      <div className="admin-editor-toolbar" role="toolbar" aria-label="Metin biçimlendirme">
        <div className="admin-editor-tool-group">
          <ToolbarButton
            label="Kalın (Ctrl+B)"
            icon={Bold}
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          />
          <ToolbarButton
            label="İtalik (Ctrl+I)"
            icon={Italic}
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          />
        </div>

        <div className="admin-editor-tool-group">
          <ToolbarButton
            label="Başlık"
            icon={Heading2}
            active={editor.isActive("heading", { level: 2 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          />
          <ToolbarButton
            label="Alt başlık"
            icon={Heading3}
            active={editor.isActive("heading", { level: 3 })}
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          />
        </div>

        <div className="admin-editor-tool-group">
          <ToolbarButton
            label="Madde işaretli liste"
            icon={List}
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          />
          <ToolbarButton
            label="Numaralı liste"
            icon={ListOrdered}
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          />
          <ToolbarButton
            label="Alıntı"
            icon={Quote}
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          />
        </div>

        <div className="admin-editor-tool-group">
          <ToolbarButton
            label="Bağlantı ekle"
            icon={Link2}
            active={editor.isActive("link")}
            onClick={() => setLinkDraft(editor.getAttributes("link").href ?? "")}
          />
          <ToolbarButton
            label="Bağlantıyı kaldır"
            icon={Link2Off}
            disabled={!editor.isActive("link")}
            onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
          />
        </div>

        <div className="admin-editor-tool-group admin-editor-tool-group-end">
          <ToolbarButton
            label="Geri al (Ctrl+Z)"
            icon={Undo2}
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolbarButton
            label="Yinele (Ctrl+Y)"
            icon={Redo2}
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </div>
      </div>

      {linkDraft !== null && (
        <div className="admin-editor-link-bar">
          <label className="admin-editor-link-label" htmlFor={`${name}-link`}>
            Bağlantı adresi
          </label>
          <input
            id={`${name}-link`}
            className="admin-input"
            value={linkDraft}
            autoFocus
            placeholder="https://ornek.com"
            onChange={(event) => setLinkDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyLink();
              }
              if (event.key === "Escape") {
                event.preventDefault();
                setLinkDraft(null);
              }
            }}
          />
          <button type="button" className="admin-button admin-button-secondary" onClick={applyLink}>
            Uygula
          </button>
          <button type="button" className="admin-button admin-button-quiet" onClick={() => setLinkDraft(null)}>
            Vazgeç
          </button>
        </div>
      )}

      <EditorContent editor={editor} />

      <div className="admin-editor-footer">
        <span>{words} kelime</span>
        {error ? (
          <span className="admin-editor-error" role="alert">
            {error}
          </span>
        ) : (
          <span className="admin-editor-tip">
            Metni seçip yukarıdaki düğmelerle biçimlendirin.
          </span>
        )}
      </div>

      <input ref={inputRef} type="hidden" name={name} defaultValue="[]" />
    </div>
  );
}
