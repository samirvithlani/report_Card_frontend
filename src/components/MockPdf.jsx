import React, { useRef, useState } from 'react';
import { Download, Award, Mail, Phone, GraduationCap, Users, Star, TrendingUp } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock data for demonstration purposes.
const mockStudentData = {
  studentDetails: {
    firstName: "Vedangi",
    lastName: "Patel",
    mobile: "9426103180",
    email: "vedangipatel463@gmail.com",
    college: "GrowMore",
    batch: "Club",
    finalScore: 90,
  },
  marksData: [
    { subject: 'Discipline', marks: 5, outOf: 5, rating: 5 },
    { subject: 'Regular Sessions', marks: 5, outOf: 5, rating: 5 },
    { subject: 'Communication in Sessions', marks: 3, outOf: 5, rating: 3 },
    { subject: 'Test Performance', marks: 5, outOf: 5, rating: 5 },
  ],
  conductData: [
    { title: "Test Performance", score: "5/5 (A)", icon: TrendingUp, color: "from-green-400 to-green-600" },
    { title: "Discipline", score: "5/5 (A)", icon: Award, color: "from-blue-400 to-blue-600" },
    { title: "Regular Sessions", score: "5/5 (A)", icon: Users, color: "from-purple-400 to-purple-600" },
  ],
  totalMarks: 18,
  totalOutOf: 20,
};

// Mock student image URL.
const mockStudentImage = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face";

export default function App() {
  const [studentData] = useState(mockStudentData);
  const [isGenerating, setIsGenerating] = useState(false);
  // Attach a reference to the main container div.
  const pageRef = useRef(null); 

  // Calculate percentage for progress rings
  const getPercentage = (marks, outOf) => (marks / outOf) * 100;
  const overallPercentage = (studentData.totalMarks / studentData.totalOutOf) * 100;

  // Generate circular progress SVG
  const CircularProgress = ({ percentage, size = 60, strokeWidth = 6, color = "blue" }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`text-${color}-500 transition-all duration-1000 ease-out`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-gray-700">{Math.round(percentage)}%</span>
        </div>
      </div>
    );
  };

  // Star rating component
  const StarRating = ({ rating, maxRating = 5 }) => {
    return (
      <div className="flex space-x-1">
        {[...Array(maxRating)].map((_, index) => (
          <Star
            key={index}
            size={16}
            className={`${
              index < rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            } transition-colors duration-300`}
          />
        ))}
      </div>
    );
  };

  // NEW: Corrected function to capture the React UI and save it as a PDF
  const handlePrint = async () => {
    const element = pageRef.current;
    if (!element) return;

    setIsGenerating(true);

    const canvas = await html2canvas(element, {
      scale: 2, // Increase scale for better image quality
      logging: false,
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    
    // Calculate the width and height to fit on the PDF page
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // If the content is taller than a single page, we need to handle multi-page PDFs.
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();
    const contentHeight = pdfHeight;
    const topMargin = 5;

    if (contentHeight > pageHeight) {
      const pages = Math.ceil(contentHeight / (pageHeight - topMargin));
      let y = 0;

      for (let i = 0; i < pages; i++) {
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = pageHeight / (contentHeight / canvas.height);
        const pageCtx = pageCanvas.getContext('2d');
        
        pageCtx.drawImage(
          canvas,
          0,
          y,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          pageCanvas.width,
          pageCanvas.height
        );
        const pageImgData = pageCanvas.toDataURL('image/jpeg', 1.0);
        
        if (i > 0) {
          pdf.addPage();
        }
        pdf.addImage(pageImgData, 'JPEG', 0, topMargin, pdfWidth, pageHeight);
        y += pageCanvas.height;
      }
    } else {
      // Add the single image to the PDF
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    }

    // Save the PDF
    const fileName = `${studentData.studentDetails.firstName}_${studentData.studentDetails.lastName}_Report.pdf`;
    pdf.save(fileName);

    setIsGenerating(false);
  };


  const student = studentData.studentDetails;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4"
      ref={pageRef} // Attach the ref here
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Student Performance Report
          </h1>
          <p className="text-gray-600">Academic Excellence Dashboard</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            
            {/* Left Section - Student Details */}
            <div className="lg:col-span-2 p-8 lg:p-12">
              {/* Student Profile */}
              <div className="mb-8">
                <div className="flex items-center space-x-6 mb-8">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gradient-to-r from-indigo-400 to-purple-400 shadow-xl group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={mockStudentImage} 
                        alt="Student Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                      <Award size={16} className="text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                      {student.firstName} {student.lastName}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Phone size={18} className="text-indigo-500" />
                        <span>{student.mobile}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Mail size={18} className="text-indigo-500" />
                        <span className="truncate">{student.email}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <GraduationCap size={18} className="text-indigo-500" />
                        <span>{student.college}</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-600">
                        <Users size={18} className="text-indigo-500" />
                        <span>Batch: {student.batch}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marks Table */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="mr-3 text-indigo-500" />
                  Performance Breakdown
                </h3>
                
                <div className="grid gap-4">
                  {studentData.marksData.map((item, index) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-indigo-200">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-2">{item.subject}</h4>
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl font-bold text-indigo-600">{item.marks}/{item.outOf}</span>
                            <StarRating rating={item.rating} />
                          </div>
                        </div>
                        <div className="ml-6">
                          <CircularProgress 
                            percentage={getPercentage(item.marks, item.outOf)} 
                            color="indigo"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Overall Score */}
                <div className="mt-6 p-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold opacity-90">Total Score</h4>
                      <p className="text-3xl font-bold">{studentData.totalMarks}/{studentData.totalOutOf}</p>
                    </div>
                    <div>
                      <CircularProgress 
                        percentage={overallPercentage} 
                        size={80}
                        color="white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section - Summary & Actions */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 p-8 lg:p-12 text-white relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
              
              {/* Final Score */}
              <div className="mb-8 text-center relative">
                <h3 className="text-xl font-bold mb-4 opacity-90">Final Grade</h3>
                <div className="relative inline-block">
                  <div className="text-6xl font-extrabold mb-2 bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {student.finalScore}%
                  </div>
                  <div className="absolute -inset-4 bg-white/10 rounded-full blur-xl"></div>
                </div>
                <p className="text-lg opacity-80 mt-2">Excellent Performance</p>
              </div>

              {/* Activities & Conduct */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Award className="mr-2" size={20} />
                  Achievements
                </h3>
                <div className="space-y-4">
                  {studentData.conductData.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={index} className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${item.color}`}>
                            <IconComponent size={20} className="text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm opacity-80">{item.score}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Download Button */}
              <div className="text-center">
                <button
                  onClick={handlePrint}
                  disabled={isGenerating}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-2xl border border-white/30 flex items-center space-x-3 mx-auto"
                >
                  <Download size={20} className={isGenerating ? "animate-bounce" : ""} />
                  <span>{isGenerating ? "Generating..." : "Download Report"}</span>
                </button>
              </div>

              {/* Signature Area */}
              <div className="mt-8 pt-8 border-t border-white/20 text-center">
                <p className="text-sm opacity-60 mb-2">Authorized by</p>
                <div className="h-12 flex items-center justify-center">
                  <div className="w-24 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-semibold">Signature</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl text-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold">Generating your report...</p>
          </div>
        </div>
      )}
    </div>
  );
}