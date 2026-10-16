import React, { useState, useMemo, useCallback } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Plus,
  Trash2,
  Edit2,
  Search,
  X as CloseIcon,
} from 'lucide-react';
import {
  CognitiveTelemetry,
  ResourceItem,
  UserAccountSettings,
  CompanionState,
  ConnectedApp,
} from '../types';
import { FrostedPanel } from './FrostedPanel';
import { HubWelcome } from './HubWelcome';
import { Card } from './Card';
import { ActionButton } from './ActionButton';
import { EditCourseModal } from './EditCourseModal';
import { EditAssignmentModal } from './EditAssignmentModal';
import { useStudentData } from '../hooks/useStudentData';

interface StudentHubViewProps {
  telemetry: CognitiveTelemetry;
  connectedApps: ConnectedApp[];
  resources: ResourceItem[];
  companion?: CompanionState;
  onOpenResource: (resource: ResourceItem) => void;
  onCreateResourceClick: () => void;
  onOpenLibrary: () => void;
  onOpenWorkspace: () => void;
  onOpenFishing?: () => void;
  onOpenProfile?: () => void;
  onShowToast: (msg: string) => void;
  settings?: UserAccountSettings;
}

export const StudentHubView = React.memo(function StudentHubViewComponent({
  telemetry,
  resources,
  companion,
  onOpenResource,
  onCreateResourceClick,
  onOpenLibrary,
  onOpenWorkspace,
  onOpenFishing,
  onShowToast,
  settings,
}: StudentHubViewProps) {
  const isDark = settings?.theme === 'dark';

  // Welcome visibility
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);

  // Panel frost state
  const [frozenPanels, setFrozenPanels] = useState({
    courses: false,
    assignments: false,
    metrics: false,
  });

  // Modal states
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);

  // Search & filter states
  const [courseSearch, setCourseSearch] = useState('');
  const [assignmentSearch, setAssignmentSearch] = useState('');
  const [assignmentFilter, setAssignmentFilter] = useState<'all' | 'overdue' | 'due-soon' | 'pending'>('all');

  // Stats modal state
  const [showStatsDetail, setShowStatsDetail] = useState<'minutes' | 'streak' | 'health' | null>(null);

  // Student data management
  const {
    data,
    isLoaded,
    addCourse,
    updateCourse,
    removeCourse,
    addAssignment,
    updateAssignment,
    removeAssignment,
    sortedAssignments,
  } = useStudentData();

  // Memoized courses filtered by search
  const filteredCourses = useMemo(() => {
    return data.courses.filter((course) =>
      course.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
      (course.code && course.code.toLowerCase().includes(courseSearch.toLowerCase()))
    );
  }, [data.courses, courseSearch]);

  // Memoized assignments with filtering
  const filteredAssignments = useMemo(() => {
    let filtered = sortedAssignments.filter((assignment) =>
      assignment.title.toLowerCase().includes(assignmentSearch.toLowerCase()) ||
      assignment.courseName.toLowerCase().includes(assignmentSearch.toLowerCase())
    );

    if (assignmentFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter((assignment) => {
        const dueDate = new Date(assignment.dueDate);
        const diffMs = dueDate.getTime() - now.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (assignmentFilter === 'overdue') return diffDays < 0;
        if (assignmentFilter === 'due-soon') return diffDays >= 0 && diffDays < 2;
        if (assignmentFilter === 'pending') return diffDays >= 2;
        return true;
      });
    }

    return filtered.slice(0, 5); // Show top 5
  }, [sortedAssignments, assignmentSearch, assignmentFilter]);

  // Helper to determine assignment status
  const getAssignmentStatus = useCallback((dueDate: string): 'pending' | 'due-soon' | 'overdue' => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffMs = due.getTime() - now.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays < 0) return 'overdue';
    if (diffDays < 2) return 'due-soon';
    return 'pending';
  }, []);

  // Format date for display
  const formatDate = useCallback((isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  // Handle course edit
  const handleEditCourse = (course: any) => {
    setEditingCourse(course);
    setIsEditCourseModalOpen(true);
  };

  // Handle assignment edit
  const handleEditAssignment = (assignment: any) => {
    setEditingAssignment(assignment);
    setIsEditAssignmentModalOpen(true);
  };

  // Handle course save (add or update)
  const handleSaveCourse = (courseData: any) => {
    if (editingCourse) {
      updateCourse(editingCourse.id, courseData);
      onShowToast(`Course "${courseData.name}" updated successfully`);
      setEditingCourse(null);
    } else {
      addCourse(courseData);
      onShowToast(`Course "${courseData.name}" added successfully`);
    }
  };

  // Handle assignment save (add or update)
  const handleSaveAssignment = (assignmentData: any) => {
    if (editingAssignment) {
      updateAssignment(editingAssignment.id, assignmentData);
      onShowToast(`Assignment "${assignmentData.title}" updated successfully`);
      setEditingAssignment(null);
    } else {
      addAssignment(assignmentData);
      onShowToast(`Assignment "${assignmentData.title}" added successfully`);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto space-y-3.5 animate-fade-in pb-20 font-sans">
      {/* Welcome - Conditionally rendered */}
      {isWelcomeVisible && (
        <HubWelcome
          username={settings?.username || 'Student'}
          telemetry={telemetry}
          settings={settings}
          isFirstVisit={false}
          onDismiss={() => setIsWelcomeVisible(false)}
        />
      )}

      {/* Course Progress */}
      <FrostedPanel
        id="panel-student-courses"
        title={`Enrolled Courses (${filteredCourses.length}/${data.courses.length})`}
        icon={<BookOpen className="w-4 h-4 text-white" />}
        badge="Academic"
        isFrosted={frozenPanels.courses}
        onToggleFrost={() => setFrozenPanels((p) => ({ ...p, courses: !p.courses }))}
        isDark={isDark}
        headerActions={
          <button
            onClick={() => {
              setEditingCourse(null);
              setIsEditCourseModalOpen(true);
            }}
            className="p-1 hover:bg-neutral-800 rounded transition-colors"
            aria-label="Add course"
            title="Add Course"
          >
            <Plus className="w-4 h-4 text-neutral-400 hover:text-white" />
          </button>
        }
      >
        {/* Search Input */}
        {data.courses.length > 0 && (
          <div className="mb-3 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search courses..."
              value={courseSearch}
              onChange={(e) => setCourseSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded border font-mono text-sm transition-colors focus:outline-none focus:border-white ${
                isDark
                  ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500'
                  : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
              }`}
            />
            {courseSearch && (
              <button
                onClick={() => setCourseSearch('')}
                className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {filteredCourses.length === 0 ? (
          <div
            className={`p-4 rounded border text-center ${
              isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
            }`}
          >
            <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {data.courses.length === 0
                ? 'No enrolled courses yet. '
                : 'No courses match your search. '}
              <button
                onClick={() => {
                  setEditingCourse(null);
                  setIsEditCourseModalOpen(true);
                }}
                className="text-white hover:underline font-bold"
              >
                Click + to add one
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} isDark={isDark} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                        {course.name}
                      </h3>
                      <span className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {course.progress}%
                      </span>
                    </div>

                    {course.code && (
                      <p className={`text-xs font-mono mb-2 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                        {course.code}
                      </p>
                    )}

                    {/* Progress bar */}
                    <div
                      className={`w-full h-2 rounded-full overflow-hidden ${
                        isDark ? 'bg-neutral-800' : 'bg-neutral-300'
                      }`}
                    >
                      <div
                        className={`h-full transition-all ${isDark ? 'bg-white' : 'bg-neutral-900'}`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>

                    {/* Assignments info */}
                    {course.totalAssignments > 0 && (
                      <p className={`text-xs mt-2 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                        {course.totalAssignments} assignment(s)
                      </p>
                    )}
                  </div>

                  <div className="ml-2 flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditCourse(course)}
                      className="p-2 hover:bg-blue-950/30 rounded transition-colors"
                      title="Edit Course"
                    >
                      <Edit2 className="w-4 h-4 text-blue-400 hover:text-blue-300" />
                    </button>
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="p-2 hover:bg-red-950/30 rounded transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </FrostedPanel>

      {/* Upcoming Assignments */}
      <FrostedPanel
        id="panel-student-assignments"
        title={`Upcoming Assignments (${filteredAssignments.length}/${data.assignments.length})`}
        icon={<Clock className="w-4 h-4 text-white" />}
        badge="Priority"
        isFrosted={frozenPanels.assignments}
        onToggleFrost={() => setFrozenPanels((p) => ({ ...p, assignments: !p.assignments }))}
        isDark={isDark}
        headerActions={
          <button
            onClick={() => {
              setEditingAssignment(null);
              setIsEditAssignmentModalOpen(true);
            }}
            className="p-1 hover:bg-neutral-800 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Add Assignment"
            disabled={data.courses.length === 0}
          >
            <Plus className="w-4 h-4 text-neutral-400 hover:text-white" />
          </button>
        }
      >
        {/* Search & Filter */}
        {data.assignments.length > 0 && (
          <div className="mb-3 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search assignments..."
                value={assignmentSearch}
                onChange={(e) => setAssignmentSearch(e.target.value)}
                className={`w-full pl-9 pr-3 py-2 rounded border font-mono text-sm transition-colors focus:outline-none focus:border-white ${
                  isDark
                    ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500'
                    : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
                }`}
              />
              {assignmentSearch && (
                <button
                  onClick={() => setAssignmentSearch('')}
                  className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300"
                >
                  <CloseIcon className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'overdue', 'due-soon', 'pending'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAssignmentFilter(filter)}
                  className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                    assignmentFilter === filter
                      ? isDark
                        ? 'bg-white text-black'
                        : 'bg-neutral-900 text-white'
                      : isDark
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300'
                  }`}
                >
                  {filter === 'all'
                    ? 'All'
                    : filter === 'overdue'
                    ? 'Overdue'
                    : filter === 'due-soon'
                    ? 'Due Soon'
                    : 'Pending'}
                </button>
              ))}
            </div>
          </div>
        )}

        {data.assignments.length === 0 ? (
          <div
            className={`p-4 rounded border text-center ${
              isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
            }`}
          >
            <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              No assignments yet.{' '}
              {data.courses.length > 0 ? (
                <button
                  onClick={() => {
                    setEditingAssignment(null);
                    setIsEditAssignmentModalOpen(true);
                  }}
                  className="text-white hover:underline font-bold"
                >
                  Click + to add one
                </button>
              ) : (
                'Add a course first.'
              )}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAssignments.map((assignment) => {
              const status = getAssignmentStatus(assignment.dueDate);
              const isUrgent = status === 'due-soon' || status === 'overdue';
              const isOverdue = status === 'overdue';

              return (
                <Card
                  key={assignment.id}
                  isDark={isDark}
                  className={`p-3 flex items-start gap-3 ${
                    isOverdue
                      ? isDark
                        ? 'ring-1 ring-red-700/50 bg-red-950/20'
                        : 'ring-1 ring-red-300 bg-red-100/20'
                      : isUrgent
                      ? isDark
                        ? 'ring-1 ring-amber-700/50 bg-amber-950/20'
                        : 'ring-1 ring-amber-300 bg-amber-100/20'
                      : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {isOverdue ? (
                      <AlertCircle className={`w-4 h-4 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                    ) : isUrgent ? (
                      <AlertCircle className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                    ) : (
                      <CheckCircle2 className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                      {assignment.title}
                    </h4>
                    <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {assignment.courseName} • Due {formatDate(assignment.dueDate)}
                    </p>
                  </div>

                  <div className="ml-2 flex gap-1 flex-shrink-0">
                    <button
                      onClick={() => handleEditAssignment(assignment)}
                      className="p-2 hover:bg-blue-950/30 rounded transition-colors"
                      title="Edit Assignment"
                    >
                      <Edit2 className="w-4 h-4 text-blue-400 hover:text-blue-300" />
                    </button>
                    <button
                      onClick={() => removeAssignment(assignment.id)}
                      className="p-2 hover:bg-red-950/30 rounded transition-colors"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-4 h-4 text-red-400 hover:text-red-300" />
                    </button>
                  </div>
                </Card>
              );
            })}
            {data.assignments.length > filteredAssignments.length && (
              <p className={`text-xs text-center py-2 font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                +{data.assignments.length - filteredAssignments.length} more assignment(s)
              </p>
            )}
          </div>
        )}
      </FrostedPanel>

      {/* Study Metrics - Now Interactive */}
      <FrostedPanel
        id="panel-student-metrics"
        title="Study Metrics & Recommendations"
        icon={<TrendingUp className="w-4 h-4 text-white" />}
        badge="Insights"
        isFrosted={frozenPanels.metrics}
        onToggleFrost={() => setFrozenPanels((p) => ({ ...p, metrics: !p.metrics }))}
        isDark={isDark}
      >
        <div className="grid grid-cols-3 gap-2">
          {/* Minutes Studied - Clickable */}
          <button
            onClick={() => setShowStatsDetail(showStatsDetail === 'minutes' ? null : 'minutes')}
            className="transition-all cursor-pointer hover:scale-105"
            title="Click to view details"
          >
            <Card isDark={isDark} className="p-3 rounded text-center h-full">
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {telemetry.sessionMinutes}
              </p>
              <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Minutes Studied
              </p>
              {showStatsDetail === 'minutes' && (
                <p className={`text-xs mt-2 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                  Great consistency!
                </p>
              )}
            </Card>
          </button>

          {/* Day Streak - Clickable */}
          <button
            onClick={() => setShowStatsDetail(showStatsDetail === 'streak' ? null : 'streak')}
            className="transition-all cursor-pointer hover:scale-105"
            title="Click to view details"
          >
            <Card isDark={isDark} className="p-3 rounded text-center h-full">
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {telemetry.streakDays}
              </p>
              <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Day Streak
              </p>
              {showStatsDetail === 'streak' && (
                <p className={`text-xs mt-2 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                  Keep it up!
                </p>
              )}
            </Card>
          </button>

          {/* Cognitive Health - Clickable */}
          <button
            onClick={() => setShowStatsDetail(showStatsDetail === 'health' ? null : 'health')}
            className="transition-all cursor-pointer hover:scale-105"
            title="Click to view details"
          >
            <Card isDark={isDark} className="p-3 rounded text-center h-full">
              <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                {Math.round(telemetry.cognitiveVital)}%
              </p>
              <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Cognitive Health
              </p>
              {showStatsDetail === 'health' && (
                <p className={`text-xs mt-2 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
                  Feeling sharp!
                </p>
              )}
            </Card>
          </button>
        </div>
      </FrostedPanel>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ActionButton
          variant="primary"
          onClick={onOpenWorkspace}
          isDark={isDark}
        >
          Start Study Session
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={onOpenLibrary}
          isDark={isDark}
        >
          View Notes
        </ActionButton>
        <ActionButton
          variant="secondary"
          onClick={onCreateResourceClick}
          isDark={isDark}
        >
          New Resource
        </ActionButton>
        {onOpenFishing && (
          <ActionButton
            variant="secondary"
            onClick={onOpenFishing}
            isDark={isDark}
          >
            Catch Fish
          </ActionButton>
        )}
      </div>

      {/* Modals */}
      <EditCourseModal
        isOpen={isEditCourseModalOpen}
        onClose={() => {
          setIsEditCourseModalOpen(false);
          setEditingCourse(null);
        }}
        onSave={handleSaveCourse}
        course={editingCourse}
        isDark={isDark}
      />

      <EditAssignmentModal
        isOpen={isEditAssignmentModalOpen}
        onClose={() => {
          setIsEditAssignmentModalOpen(false);
          setEditingAssignment(null);
        }}
        onSave={handleSaveAssignment}
        courses={data.courses}
        assignment={editingAssignment}
        isDark={isDark}
      />
    </div>
  );
});

export default StudentHubView;
