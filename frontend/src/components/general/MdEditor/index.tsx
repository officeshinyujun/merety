'use client'

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import Link from "@tiptap/extension-link";
import { Markdown } from "tiptap-markdown";
import s from './style.module.scss';
import { VStack } from "../VStack";
import { HStack } from "../HStack";
import Button from "../Button";
import { useEffect } from "react";
import cn from 'classnames';

interface Props {
  isEdit?: boolean;
  contents?: string;
  className?: string;
}

export default function MdEditor ({ isEdit = true, contents, className }: Props) {
    const [text, setText] = useState("Hello World!");
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.extend({ inclusive: false }).configure({
        openOnClick: false,
      }),
      Markdown,
    ],
    content: contents || text,
    immediatelyRender: false,
    editable: isEdit,
    editorProps: {
      attributes: {
        class: s.editor
      },
    },
    onUpdate({ editor }) {
      setText(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEdit);
    }
  }, [isEdit, editor]);

  if (!editor) {
    return null;
  }

    return (
        <VStack className={cn(s.container, className)}>
            {isEdit && (
                <HStack className={s.toolbar}>
                    <Button 
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        disabled={!editor.can().chain().focus().toggleBold().run()}
                        className={`${s.toolbarButton} ${editor.isActive('bold') ? s.isActive : ''}`}
                    >
                        B
                    </Button>
                    <Button 
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        disabled={!editor.can().chain().focus().toggleItalic().run()}
                        className={`${s.toolbarButton} ${editor.isActive('italic') ? s.isActive : ''}`}
                    >
                        I
                    </Button>
                    <Button 
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        disabled={!editor.can().chain().focus().toggleStrike().run()}
                        className={`${s.toolbarButton} ${editor.isActive('strike') ? s.isActive : ''}`}
                    >
                        S
                    </Button>
                    <Button 
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        disabled={!editor.can().chain().focus().toggleCodeBlock().run()}
                        className={`${s.toolbarButton} ${editor.isActive('codeBlock') ? s.isActive : ''}`}
                    >
                        Code
                    </Button>
                    <Button 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`${s.toolbarButton} ${editor.isActive('heading', { level: 1 }) ? s.isActive : ''}`}
                    >
                        H1
                    </Button>
                    <Button 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`${s.toolbarButton} ${editor.isActive('heading', { level: 2 }) ? s.isActive : ''}`}
                    >
                        H2
                    </Button>
                    <Button 
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`${s.toolbarButton} ${editor.isActive('heading', { level: 3 }) ? s.isActive : ''}`}
                    >
                        H3
                    </Button>
                    <Button 
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`${s.toolbarButton} ${editor.isActive('bulletList') ? s.isActive : ''}`}
                    >
                        Bullet
                    </Button>
                    <Button 
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`${s.toolbarButton} ${editor.isActive('orderedList') ? s.isActive : ''}`}
                    >
                        Number
                    </Button>
                    <Button 
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`${s.toolbarButton} ${editor.isActive('blockquote') ? s.isActive : ''}`}
                    >
                        Quote
                    </Button>
                </HStack>
            )}
            <EditorContent editor={editor} className={s.editorContent} />
        </VStack>
    )
}
