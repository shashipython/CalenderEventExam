import { Award, Download, RotateCcw, Calendar, Trophy } from 'lucide-react';
import type { Student, ExamResult } from '../App';
import jsPDF from 'jspdf';
import logoUrl from '../assets/stackorbyte-logo.png';

interface CertificateProps {
  student: Student;
  result: ExamResult;
  onStartNew: () => void;
}

const getWatermarkLogo = (opacity = 0.12, blur = 1.8) =>
  new Promise<string>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('Unable to prepare certificate logo'));
        return;
      }

      context.globalAlpha = opacity;
      context.filter = `blur(${blur}px)`;
      context.drawImage(image, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = () => reject(new Error('Unable to load certificate logo'));
    image.src = logoUrl;
  });

export function Certificate({ student, result, onStartNew }: CertificateProps) {
  const completedDate = new Date(result.completedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const grade = result.percentage >= 90 ? 'A+' :
    result.percentage >= 80 ? 'A' :
    result.percentage >= 70 ? 'B' : 'C';
  const certificateId = `CERT-${student.id}-${new Date(result.completedAt).getTime()}`;

  const handleDownload = async () => {
    try {
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const centerX = pageWidth / 2;
      const safeText = (value: string, maxWidth: number, maxLines = 2) => {
        const lines = pdf.splitTextToSize(value, maxWidth);
        return Array.isArray(lines) ? lines.slice(0, maxLines) : [value];
      };
      const downloadName = `${student.name || 'student'}-certificate.pdf`
        .replace(/[\\/:*?"<>|]/g, '-')
        .replace(/\s+/g, ' ');

      pdf.setFillColor('#ffffff');
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');

      const logoDataUrl = await getWatermarkLogo();
      pdf.addImage(logoDataUrl, 'PNG', centerX - 58, 54, 116, 116);

      pdf.setDrawColor('#1e3a8a');
      pdf.setLineWidth(2);
      pdf.rect(9, 9, pageWidth - 18, pageHeight - 18);
      pdf.setLineWidth(0.8);
      pdf.rect(13, 13, pageWidth - 26, pageHeight - 26);

      pdf.setDrawColor('#2563eb');
      pdf.setLineWidth(1);
      pdf.line(88, 28, 128, 28);
      pdf.line(169, 28, 209, 28);

      pdf.setTextColor('#2563eb');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(28);
      pdf.text('Certificate of Achievement', centerX, 40, { align: 'center' });

      pdf.setTextColor('#4b5563');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.text('Summer Camp Examination Portal', centerX, 50, { align: 'center' });

      pdf.setTextColor('#374151');
      pdf.setFontSize(11);
      pdf.text('This is to certify that', centerX, 66, { align: 'center' });

      pdf.setTextColor('#1e3a8a');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(student.name.length > 32 ? 22 : 26);
      const studentNameLines = safeText(student.name, 150);
      const nameY = studentNameLines.length > 1 ? 76 : 82;
      pdf.text(studentNameLines, centerX, nameY, { align: 'center' });
      pdf.setDrawColor('#bfdbfe');
      pdf.line(82, studentNameLines.length > 1 ? 93 : 89, 215, studentNameLines.length > 1 ? 93 : 89);

      pdf.setTextColor('#374151');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(12);
      pdf.text(
        `has successfully completed the ${student.category === 'primary' ? 'Primary School' : 'High School'} examination`,
        centerX,
        103,
        { align: 'center' }
      );
      pdf.text(
        'and demonstrated excellence in comprehension and analytical skills',
        centerX,
        112,
        { align: 'center' }
      );

      const detailCards = [
        { label: 'Score', value: `${result.score}/${result.totalQuestions}`, x: 45, color: '#1e3a8a' },
        { label: 'Percentage', value: `${result.percentage.toFixed(1)}%`, x: 119.5, color: '#581c87' },
        { label: 'Grade', value: grade, x: 194, color: '#1e3a8a' },
      ];

      detailCards.forEach((card) => {
        pdf.setFillColor(card.label === 'Percentage' ? '#faf5ff' : '#eff6ff');
        pdf.roundedRect(card.x, 122, 58, 22, 3, 3, 'F');
        pdf.setTextColor('#4b5563');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8.5);
        pdf.text(card.label, card.x + 29, 130, { align: 'center' });
        pdf.setTextColor(card.color);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(15);
        pdf.text(card.value, card.x + 29, 139, { align: 'center' });
      });

      pdf.setFillColor('#f9fafb');
      pdf.roundedRect(30, 151, 237, 25, 3, 3, 'F');
      pdf.setFontSize(8);

      pdf.setTextColor('#4b5563');
      pdf.setFont('helvetica', 'normal');
      pdf.text('School', 38, 158);
      pdf.text('Grade/Class', 160, 158);
      pdf.text('Student ID', 38, 169);
      pdf.text('Date of Completion', 160, 169);

      pdf.setTextColor('#111827');
      pdf.setFont('helvetica', 'bold');
      pdf.text(safeText(student.schoolName, 105), 38, 162);
      pdf.text(safeText(student.grade, 86, 1), 160, 162);
      pdf.text(safeText(student.id, 105, 1), 38, 173);
      pdf.text(safeText(completedDate, 86, 1), 160, 173);

      pdf.setDrawColor('#1f2937');
      pdf.line(55, 186, 118, 186);
      pdf.line(179, 186, 242, 186);
      pdf.setTextColor('#111827');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(9);
      pdf.text('Examination Coordinator', 86.5, 191, { align: 'center' });
      pdf.text('Program Director', 210.5, 191, { align: 'center' });

      pdf.setTextColor('#4b5563');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.text('Summer Camp Portal', 86.5, 195, { align: 'center' });
      pdf.text('Educational Committee', 210.5, 195, { align: 'center' });

      pdf.setTextColor('#6b7280');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.text(`Certificate ID: ${certificateId}`, centerX, 199, { align: 'center' });

      pdf.save(downloadName);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8 print:hidden">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            <Download className="w-5 h-5" />
            Download Certificate
          </button>
          <button
            onClick={onStartNew}
            className="flex items-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
            Start New
          </button>
        </div>

        {/* Certificate */}
        <div id="certificate"
        className="overflow-hidden bg-white rounded-2xl shadow-2xl p-12 border-8 border-double border-blue-900"
        style={{ position: 'relative' }}>
          <img
            src={logoUrl}
            alt=""
            aria-hidden="true"
            className="pointer-events-none"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: '360px',
              maxWidth: '70%',
              opacity: 0.12,
              filter: 'blur(3px)',
              transform: 'translate(-50%, -50%)',
              zIndex: 0,
            }}
          />
          {/* Header Decoration */}
          <div className="relative z-10 text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
              <Award className="w-16 h-16 text-blue-600" />
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-2">Certificate of Achievement</h1>
            <p className="text-xl text-gray-600">Summer Camp Examination Portal</p>
          </div>

          {/* Certificate Body */}
          <div className="relative z-10 space-y-8">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4">This is to certify that</p>
              <h2 className="text-4xl font-bold text-blue-900 mb-4 border-b-2 border-blue-200 pb-2 inline-block px-8">
                {student.name}
              </h2>
            </div>

            <p className="text-center text-lg text-gray-700 leading-relaxed">
              has successfully completed the <strong>{student.category === 'primary' ? 'Primary School' : 'High School'}</strong> examination
              <br />
              and demonstrated excellence in comprehension and analytical skills
            </p>

            {/* Achievement Details */}
            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Score</p>
                <p className="text-2xl font-bold text-blue-900">
                  {result.score}/{result.totalQuestions}
                </p>
              </div>

              <div className="text-center bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6">
                <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Percentage</p>
                <p className="text-2xl font-bold text-purple-900">
                  {result.percentage.toFixed(1)}%
                </p>
              </div>

              <div className="text-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Grade</p>
                <p className="text-2xl font-bold text-blue-900">
                  {grade}
                </p>
              </div>
            </div>

            {/* Student Details */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">School</p>
                  <p className="font-semibold text-gray-900">{student.schoolName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grade/Class</p>
                  <p className="font-semibold text-gray-900">{student.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Student ID</p>
                  <p className="font-semibold text-gray-900">{student.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date of Completion</p>
                  <p className="font-semibold text-gray-900">{completedDate}</p>
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="grid md:grid-cols-2 gap-12 mt-12 pt-8 border-t-2 border-gray-200">
              <div className="text-center">
                <div className="border-t-2 border-gray-800 pt-2 inline-block px-8">
                  <p className="font-semibold text-gray-900">Examination Coordinator</p>
                  <p className="text-sm text-gray-600">Summer Camp Portal</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t-2 border-gray-800 pt-2 inline-block px-8">
                  <p className="font-semibold text-gray-900">Program Director</p>
                  <p className="text-sm text-gray-600">Educational Committee</p>
                </div>
              </div>
            </div>

            {/* Certificate ID */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                Certificate ID: {certificateId}
              </p>
            </div>
          </div>

          {/* Bottom Decoration */}
          <div className="relative z-10 flex items-center justify-center mt-8">
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent" />
          </div>
        </div>

        {/* Print Instructions */}
        <div className="text-center mt-6 text-gray-600 print:hidden">
          <p className="text-sm">
            Click "Download Certificate" to save or print this certificate for your records.
          </p>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
