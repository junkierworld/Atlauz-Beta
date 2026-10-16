import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { StudentAssignment, StudentCourse } from '../types';

interface EditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: Omit<StudentAssignment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  courses: StudentCourse[];
  assignment?: StudentAssignment; // If provided, edit mode; otherwise add mode
  isDark?: boolean;
}

export const EditAssignmentModal: React.FC<EditAssignmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  courses,
  assignment,
  isDark = true,
}) => {
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [error, setError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (assignment && isOpen) {
      setTitle(assignment.title);
      setCourseId(assignment.courseId);
      setDueDate(new Date(assignment.dueDate).toISOString().split('T')[0]);
      setPriority(assignment.priority || 'medium');
      setError('');
    } else if (isOpen) {
      setTitle('');
      setCourseId('');
      setDueDate('');
      setPriority('medium');
      setError('');
    }
  }, [assignment, isOpen]);

  const handleSave = () => {
    setError('');

    if (!title.trim()) {
      setError('Assignment title is required');
      return;
    }

    if (!courseId) {
      setError('Please select a course');
      return;
    }

    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    const selectedCourse = courses.find((c) => c.id === courseId);
    if (!selectedCourse) {
      setError('Invalid course selected');
      return;
    }

    onSave({
      title: title.trim(),
      courseId,
      courseName: selectedCourse.name,
      dueDate: new Date(dueDate).toISOString(),
      status: 'pending',
      priority,
    });

    // Reset form
    setTitle('');
    setCourseId('');
    setDueDate('');
    setPriority('medium');
    onClose();
  };

  if (!isOpen) return null;

  const isEditMode = !!assignment;
  const title_text = isEditMode ? 'Edit Assignment' : 'Add New Assignment';
  const buttonText = isEditMode ? 'Update Assignment' : 'Add Assignment';

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
              {title_text}
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
            {/* Assignment Title */}
            <div>
              <label
                htmlFor="assignmentTitle"
                className={`block text-xs font-bold font-mono mb-2 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Assignment Title *
              </label>
              <input
                id="assignmentTitle"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Midterm Essay"
                className={`w-full px-3 py-2 rounded border font-mono text-sm transition-colors focus:outline-none focus:border-white ${
                  isDark
                    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                }`}
              />
            </div>

            {/* Course Selection */}
            <div>
              <label
                htmlFor="courseSelect"
                className={`block text-xs font-bold font-mono mb-2 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Course *
              </label>
              {courses.length === 0 ? (
                <div className="p-3 bg-amber-950/30 border border-amber-700/50 rounded text-xs text-amber-400">
                  No courses yet. Add a course first.
                </div>
              ) : (
                <select
                  id="courseSelect"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className={`w-full px-3 py-2 rounded border font-mono text-sm transition-colors focus:outline-none focus:border-white ${
                    isDark
                      ? 'bg-neutral-800 border-neutral-700 text-white'
                      : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                  }`}
                >
                  <option value="">Select a course...</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name} {course.code ? `(${course.code})` : ''}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label
                htmlFor="dueDate"
                className={`block text-xs font-bold font-mono mb-2 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Due Date *
              </label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={`w-full px-3 py-2 rounded border font-mono text-sm transition-colors focus:outline-none focus:border-white ${
                  isDark
                    ? 'bg-neutral-800 border-neutral-700 text-white'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                }`}
              />
            </div>

            {/* Priority */}
            <div>
              <label
                htmlFor="priority"
                className={`block text-xs font-bold font-mono mb-2 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-600'
                }`}
              >
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className={`w-full px-3 py-2 rounded border font-mono text-sm transition-colors focus:outline-none focus:border-white ${
                  isDark
                    ? 'bg-neutral-800 border-neutral-700 text-white'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900'
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
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
              disabled={courses.length === 0}
              className={`px-4 py-2 rounded font-mono font-bold text-xs transition-all ${
                isDark
                  ? 'bg-white hover:bg-neutral-200 text-black disabled:opacity-50 disabled:cursor-not-allowed'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-white disabled:opacity-50 disabled:cursor-not-allowed'
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

export default EditAssignmentModal;
