import MainCArchivesCard from "@/components/study/Archives/MainCard";
import { Archive, ArchiveCategory } from "@/types/archive";
import { ReactNode } from "react";
import { File, Link, Code, PanelRight, Ellipsis, Download, Eye } from "lucide-react";

interface ChartChild {
    title?: string;
    text?: string;
    image?: string;
    icon?: ReactNode[];
}

interface ChartSectionData {
    width: string;
    height: string;
    title: string;
    children: ChartChild[];
}

interface ColumnConfig {
    key: keyof Archive | 'main' | 'actions'; // Added 'actions'
    label: string;
    width: string;
}

const getCategoryIcon = (category: ArchiveCategory) => {
    const props = { size: 20, strokeWidth: 1.5, color: "#fdfdfe" };
    switch (category) {
        case ArchiveCategory.DOC: return <File {...props} />;
        case ArchiveCategory.LINK: return <Link {...props} />;
        case ArchiveCategory.CODE: return <Code {...props} />;
        case ArchiveCategory.SLIDE: return <PanelRight {...props} />;
        default: return <Ellipsis {...props} />;
    }
};

export const convertArchivesToChartData = (
    archives: Archive[],
    columns: ColumnConfig[]
): ChartSectionData[] => {
    return columns.map((col) => ({
        width: col.width,
        height: "100%",
        title: col.label,
        children: archives.map((archive) => {
            if (col.key === 'actions') {
                const icons = [];
                // Always add download/preview icons for demo, or based on type
                // In a real app, you'd check if download_url or preview_url exists
                icons.push(<Download size={20} color="#959595" strokeWidth={1.5} style={{cursor: 'pointer'}} />);
                icons.push(<Eye size={20} color="#959595" strokeWidth={1.5} style={{cursor: 'pointer'}} />);
                
                return {
                    icon: icons
                };
            }

            if (col.key === 'title') {
                return {
                    icon: [getCategoryIcon(archive.category)],
                    text: archive.title
                };
            }

            if (col.key === 'main') {
                // Special rendering for the main column (Icon + Title)
                // We map archive.category to MainCArchivesCard's type prop
                return {
                    icon: [
                        <MainCArchivesCard 
                            key={archive.id} 
                            type={archive.category as any} 
                            title={archive.title} 
                        />
                    ]
                };
            }

            if (col.key === 'created_at') {
                const dateStr = typeof archive.created_at === 'string' 
                    ? archive.created_at.split('T')[0] 
                    : String(archive.created_at);
                return { text: dateStr };
            }
            
             if (col.key === 'uploader_id') {
                 return { text: archive.uploader_id };
            }

            return { text: String(archive[col.key as keyof Archive] || '') };
        })
    }));
};
