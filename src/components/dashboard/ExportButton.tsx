'use client';

import { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Job {
    id: string;
    name: string;
    status: string;
    total_files: number;
    processed_files: number;
    failed_files: number;
    credits_cost: number;
    accessibility_score: number;
    created_at: string;
}

export default function ExportButton() {
    const [loading, setLoading] = useState(false);

    const handleExportCSV = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/reports/export');
            if (!response.ok) throw new Error('Failed to export CSV');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `job-history-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Export errored:', error);
            alert('Failed to export CSV');
        } finally {
            setLoading(false);
        }
    };

    const handleExportPDF = async () => {
        setLoading(true);
        try {
            // Fetch all data for PDF
            // Using a high limit to get all history for the report, or better yet, a dedicated endpoint without pagination
            // For now, re-using history endpoint with large limit as a simple solution
            const response = await fetch('/api/reports/history?limit=1000');
            const data = await response.json();

            if (data.error) throw new Error(data.error);

            const doc = new jsPDF();

            doc.setFontSize(18);
            doc.text('Job Processing History', 14, 22);
            doc.setFontSize(11);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

            const tableData = data.jobs.map((job: Job) => [
                job.name,
                job.status,
                `${job.processed_files}/${job.total_files}`,
                job.credits_cost,
                `${job.accessibility_score || 0}%`,
                new Date(job.created_at).toLocaleDateString()
            ]);

            autoTable(doc, {
                head: [['Job Name', 'Status', 'Files', 'Credits', 'Score', 'Date']],
                body: tableData,
                startY: 40,
                theme: 'grid',
                headStyles: { fillColor: [79, 70, 229] } // Indigo-600
            });

            doc.save(`job-history-${new Date().toISOString().split('T')[0]}.pdf`);

        } catch (error) {
            console.error('PDF Export errored:', error);
            alert('Failed to export PDF');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={handleExportCSV}
                className="btn btn-sm btn-outline"
                disabled={loading}
            >
                {loading ? '...' : 'Export CSV'}
            </button>
            <button
                onClick={handleExportPDF}
                className="btn btn-sm btn-outline"
                disabled={loading}
            >
                {loading ? '...' : 'Export PDF'}
            </button>
        </div>
    );
}
