import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StudentCourse } from '../types';

interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<StudentCourse, 'id' | 'createdAt' | 'updatedAt'>) => void;
  course?: StudentCourse; // If provided, edit mode; otherwise add mode
  isDark?: boolean;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  onSave,
  course,
  isDark = true,
}) => {
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [progress, setProgress] = useState(0);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [error, setError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (course && isOpen) {
      setCourseName(course.name);
      setCourseCode(course.code || '');
      setProgress(course.progress);
      setTotalAssignments(course.totalAssignments);
      setError('');
    } else if (isOpen) {
      // Reset for add mode
      setCourseName('');
      setCourseCode('');
      setProgress(0);
      setTotalAssignments(0);
      setError('');
    }
  }, [course, isOpen]);

  const handleSave = () => {
    setError('');
    
    if (!courseName.trim()) {
      setError('Course name is required');
      return;
    }

    if (progress < 0 || progress > 100) {
      setError('Progress must be between 0 and 100');
      return;
    }

    if (totalAssignments < 0) {
      setError('Total assignments cannot be negative');
      return;
    }

    onSave({
      name: courseName.trim(),
      code: courseCode.trim() || undefined,
      progress: Math.round(progress),
      totalAssignments,
    });

    // Reset form
    setCourseName('');
    setCourseCode('');
    setProgress(0);
    setTotalAssignments(0);
    onClose();
  };

  if (!isOpen) return null;

  const isEditMode = !!course;
  const title = isEditMode ? 'Edit Course' : 'Add New Course';
  const buttonText = isEditMode ? 'Update Course' : 'Add Course';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div
          className={`bg-neutral-900 rounded-lg border border-neutral-800 shadow-2xl max-w-md w-full mx-auto ${
            isDark ? 'bg-neutral-900' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div
            className={`flex items-center justify-between p-6 border-b ${
              isDark ? 'border-neutral-800' : 'border-neutral-200'
            }`}
          >
            <h2 className={`text-lg font-bold font-mono ${isDark ? 'text-white' : 'text-neutral-900'}`}>
              {title}
            </h2>
            <button
              onClick={onClose}
              className={`p-1 rounded transition-colors ${
                isDark ? 'hover:bg-neutral-800 text-neutral-400' : 'hover:bg-neutral-100 text-neutral-600'
              }`}
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className={`p-6 space-y-4 ${isDark ? 'bg-neutral-900' : 'bg-white'}`}>
            {/* Course Name */}
            <div>
              <label
                htmlFor="courseName"
                className={`block text-xs font-bold font-mono mb-2 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Course Name *
              </label>
              <input
                id="courseName"
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g., Introduction to Computer Science"
                className={`w-full px-3 py-2 rounded border font-mono text-sm transition-colors focus:outline-none focus:border-white ${
                  isDark
                    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                }`}
              />
            </div>

            {/* Course Code */}
            <div>
              <label
                htmlFor="courseCode"
                className={`block text-xs font-bold font-mono mb-2 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Course Code (Optional)
              </label>
              <input
                id="courseCode"
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="e.g., CS-101"
                className={`w-full px-3 py-2 rounded border font-mono text-sm transition-colors focus:outline-none focus:border-white ${
                  isDark
                    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                }`}
              />
            </div>

            {/* Progress */}
            <div>
              <label
                htmlFor="progress"
                className={`block text-xs font-bold font-mono mb-2 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Progress: {progress}%
              </label>
              <input
                id="progress"
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className={`w-full h-2 rounded-full appearance-none cursor-pointer ${
                  isDark ? 'bg-neutral-800' : 'bg-neutral-200'
                }`}
              />
            </div>

            {/* Total Assignments */}
            <div>
              <label
                htmlFor="totalAssignments"
                className={`block text-xs font-bold font-mono mb-2 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Total Assignments
              </label>
              <input
                id="totalAssignments"
                type="number"
                min="0"
                value={totalAssignments}
                onChange={(e) => setTotalAssignments(Math.max(0, parseInt(e.target.value) || 0))}
                placeholder="0"
                className={`w-full px-3 py-2 rounded border font-mono text-sm transition-colors focus:outline-none focus:border-white ${
                  isDark
                    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                }`}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-950/30 border border-red-700/50 rounded text-sm text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className={`flex items-center justify-end gap-3 p-6 border-t ${
              isDark ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
            }`}
          >
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded font-mono font-bold text-xs transition-all ${
                isDark
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded font-mono font-bold text-xs transition-all ${
                isDark
                  ? 'bg-white hover:bg-neutral-200 text-black'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white'
              }`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>

      {/* Inline styles for modal animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-content {
          animation: fadeIn 0.2s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .modal-content {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default EditCourseModal;
