'use client';

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { useState, useCallback } from 'react';
import s from './PdfEmbed.module.scss';
import cn from 'classnames';

// PDF Embed Component with Resize
function PdfEmbedComponent({ node, updateAttributes, selected, editor }: NodeViewProps) {
    const src = node.attrs.src as string;
    const width = (node.attrs.width as number) || 600;
    const height = (node.attrs.height as number) || 400;
    const fileName = (node.attrs.fileName as string) || 'PDF 문서';

    const [isResizing, setIsResizing] = useState(false);

    const handleMouseDown = useCallback((e: React.MouseEvent, direction: string) => {
        if (!editor.isEditable) return;

        e.preventDefault();
        setIsResizing(true);

        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = width;
        const startHeight = height;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            let newWidth = startWidth;
            let newHeight = startHeight;

            if (direction.includes('e')) {
                newWidth = Math.max(200, startWidth + (moveEvent.clientX - startX));
            }
            if (direction.includes('s')) {
                newHeight = Math.max(150, startHeight + (moveEvent.clientY - startY));
            }

            updateAttributes({ width: newWidth, height: newHeight });
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [editor.isEditable, width, height, updateAttributes]);

    return (
        <NodeViewWrapper
            className={s.wrapper}
            style={{ width: `${width}px` }}
        >
            <div className={cn(s.container, { [s.selected]: selected })}>
                {/* PDF Header */}
                <div className={s.header}>
                    <svg className={s.pdfIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14,2 14,8 20,8" />
                        <text x="7" y="17" fontSize="6" fill="currentColor" stroke="none" fontWeight="bold">PDF</text>
                    </svg>
                    <span className={s.fileName}>
                        {fileName}
                    </span>
                    <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={s.openLink}
                        contentEditable={false}
                    >
                        새 탭에서 열기 ↗
                    </a>
                </div>

                {/* PDF iframe */}
                <iframe
                    src={`${src}#toolbar=0&navpanes=0`}
                    className={s.iframe}
                    style={{ height: `${height}px` }}
                    title={fileName || 'PDF Preview'}
                />
            </div>

            {/* Resize handles (only when editable and selected) */}
            {editor.isEditable && selected && (
                <>
                    <div
                        onMouseDown={(e) => handleMouseDown(e, 'e')}
                        className={cn(s.resizeHandle, s.right)}
                    />
                    <div
                        onMouseDown={(e) => handleMouseDown(e, 's')}
                        className={cn(s.resizeHandle, s.bottom)}
                    />
                    <div
                        onMouseDown={(e) => handleMouseDown(e, 'se')}
                        className={cn(s.resizeHandle, s.corner)}
                    />
                </>
            )}
        </NodeViewWrapper>
    );
}

// TipTap Extension
declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        pdfEmbed: {
            setPdfEmbed: (options: { src: string; fileName?: string; width?: number; height?: number }) => ReturnType;
        };
    }
}

export const PdfEmbed = Node.create({
    name: 'pdfEmbed',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            fileName: {
                default: 'PDF 문서',
            },
            width: {
                default: 600,
            },
            height: {
                default: 400,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-pdf-embed]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-pdf-embed': '' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(PdfEmbedComponent);
    },

    addCommands() {
        return {
            setPdfEmbed:
                (options) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        });
                    },
        };
    },
});

export default PdfEmbed;
