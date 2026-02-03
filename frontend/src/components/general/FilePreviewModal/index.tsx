'use client';

import { X, Download, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { HStack } from '../HStack';
import { VStack } from '../VStack';
import ModalContainer from '../ModalContainer';
import s from './style.module.scss';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FilePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    fileUrl: string;
    fileName: string;
    isLink?: boolean;
}

export default function FilePreviewModal({ isOpen, onClose, fileUrl, fileName, isLink }: FilePreviewModalProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);

    if (!isOpen) return null;

    const isImage = !isLink && /\.(jpg|jpeg|png|gif|webp)$/i.test(fileUrl);
    const isPDF = !isLink && /\.pdf$/i.test(fileUrl);
    
    const fullUrl = fileUrl;

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setPageNumber(1);
    }

    const goToPrevPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages || prev));

    return (
        <ModalContainer>
            <VStack className={s.modal} gap={24} align="center">
                <HStack fullWidth justify="between" align="center">
                    <h2 className={s.title}>{fileName}</h2>
                    <button className={s.closeButton} onClick={onClose}>
                        <X size={24} />
                    </button>
                </HStack>

                <div className={s.previewContent}>
                    {isImage ? (
                        <div className={s.imageWrapper}>
                             <img src={fullUrl} alt={fileName} className={s.previewImage} />
                        </div>
                    ) : isPDF ? (
                        <VStack align="center" gap={12} className={s.pdfWrapper}>
                            <Document
                                file={fullUrl}
                                onLoadSuccess={onDocumentLoadSuccess}
                                loading={
                                    <VStack align="center" justify="center" gap={12}>
                                        <div className={s.loader}></div>
                                        <p>PDF를 불러오는 중...</p>
                                    </VStack>
                                }
                                error={
                                    <p>PDF를 불러오는데 실패했습니다.</p>
                                }
                            >
                                <Page 
                                    pageNumber={pageNumber} 
                                    width={700}
                                    renderAnnotationLayer={false}
                                    renderTextLayer={false}
                                />
                            </Document>
                            
                            {numPages && numPages > 1 && (
                                <HStack align="center" justify="center" gap={16} className={s.pdfControls}>
                                    <button onClick={goToPrevPage} disabled={pageNumber <= 1} className={s.pageButton}>
                                        <ChevronLeft size={20} />
                                    </button>
                                    <p className={s.pageInfo}>
                                        {pageNumber} / {numPages}
                                    </p>
                                    <button onClick={goToNextPage} disabled={pageNumber >= numPages} className={s.pageButton}>
                                        <ChevronRight size={20} />
                                    </button>
                                </HStack>
                            )}
                        </VStack>
                    ) : (
                        <VStack align="center" justify="center" gap={16} className={s.otherFile}>
                            <FileText size={64} color="#959595" />
                            <p>이 파일은 미리보기를 지원하지 않습니다.</p>
                        </VStack>
                    )
                    }
                </div>

                <HStack fullWidth justify="end">
                    <a href={fullUrl} download={!isLink ? fileName : undefined} target="_blank" rel="noopener noreferrer" className={s.downloadButton}>
                        <Download size={18} />
                        {isLink ? '이동하기' : '다운로드'}
                    </a>
                </HStack>
            </VStack>
        </ModalContainer>
    );
}
