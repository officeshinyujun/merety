'use client'

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import Link from "@tiptap/extension-link";
import ImageResize from "tiptap-extension-resize-image";
import { Markdown } from "tiptap-markdown";
import s from './style.module.scss';
import { VStack } from "../VStack";
import { HStack } from "../HStack";
import Button from "../Button";
import { useEffect, useRef } from "react";
import cn from 'classnames';
import apiClient from "@/api/client";
import toast from "react-hot-toast";

interface Props {
    isEdit?: boolean;
    contents?: string;
    className?: string;
    onChange?: (content: string) => void;
}

export default function MdEditor({ isEdit = true, contents = '', className, onChange }: Props) {
    const [text, setText] = useState("");
    const [uploading, setUploading] = useState(false);

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const response = await apiClient.post('/api/upload/markdown-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data.url;
        } catch (error) {
            console.error('Image upload failed:', error);
            toast.error('이미지 업로드에 실패했습니다.');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.extend({ inclusive: false }).configure({
                openOnClick: false,
            }),
            ImageResize.configure({
                inline: false,
            }),
            Markdown,
        ],
        content: contents,
        immediatelyRender: false,
        editable: isEdit,
        editorProps: {
            attributes: {
                class: s.editor
            },
            handlePaste: (view, event) => {
                const items = event.clipboardData?.items;
                if (!items) return false;

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];

                    if (item.type.indexOf('image') !== -1) {
                        event.preventDefault();
                        const file = item.getAsFile();

                        if (file) {
                            uploadImage(file).then((url) => {
                                if (url && editor) {
                                    editor.chain().focus().setImage({ src: url }).run();
                                }
                            });
                        }

                        return true;
                    }
                }

                return false;
            },
        },
        onUpdate({ editor }) {
            //@ts-ignore
            const markdown = editor.storage.markdown.getMarkdown();
            setText(markdown);
            onChange?.(markdown);
        }
    });

    useEffect(() => {
        if (editor && contents !== undefined && editor.getHTML() !== contents) {
            // Only update if content is significantly different to avoid cursor jumps or infinite loops
            // For simple view/edit switching, this is fine.
            if (!editor.isFocused) {
                editor.commands.setContent(contents);
            }
        }
    }, [contents, editor]);

    useEffect(() => {
        if (editor) {
            editor.setEditable(isEdit);
        }
    }, [isEdit, editor]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageResult = (url: string | null) => {
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    const handleImageBtnClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        const url = await uploadImage(file);
        handleImageResult(url);
        
        // Reset input so same file can be selected again if needed
        e.target.value = '';
    }

    if (!editor) {
        return null;
    }

    return (
        <VStack className={cn(s.container, className)}>
            <input 
                type="file" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleFileChange} 
            />
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
                    <Button
                        onClick={handleImageBtnClick}
                        className={s.toolbarButton}
                        disabled={uploading}
                    >
                        {uploading ? '...' : 'Img'}
                    </Button>
                </HStack>
            )}
            <EditorContent editor={editor} className={s.editorContent} />
        </VStack>
    )
}
