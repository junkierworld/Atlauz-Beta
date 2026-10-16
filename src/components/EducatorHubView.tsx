import React, { useState, useMemo } from 'react';
import {
  Users,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Award,
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
import { useEducatorData } from '../hooks/useEducatorData';

interface EducatorHubViewProps {
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

export const EducatorHubView = React.memo(function EducatorHubViewComponent({
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
}: EducatorHubViewProps) {
  const isDark = settings?.theme === 'dark';

  // UI state
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);
  const [frozenPanels, setFrozenPanels] = useState({
    classes: false,
    analytics: false,
    materials: false,
  });
  const [classSearch, setClassSearch] = useState('');
  const [editingClass, setEditingClass] = useState<any>(null);
  const [showAddClass, setShowAddClass] = useState(false);

  // Educator data
  const { data, addClass, updateClass, removeClass, sortedClasses, analytics } = useEducatorData();

  // Filter classes
  const filteredClasses = useMemo(() => {
    return sortedClasses.filter(
      (cls) =>
        cls.name.toLowerCase().includes(classSearch.toLowerCase()) ||
        cls.code.toLowerCase().includes(classSearch.toLowerCase())
    );
  }, [sortedClasses, classSearch]);

  const handleSaveClass = (classData: any) => {
    if (editingClass) {
      updateClass(editingClass.id, classData);
      onShowToast(`Class "${classData.name}" updated`);
      setEditingClass(null);
    } else {
      addClass(classData);
      onShowToast(`Class "${classData.name}" added`);
    }
    setShowAddClass(false);
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto space-y-3.5 animate-fade-in pb-20 font-sans">
      {isWelcomeVisible && (
        <HubWelcome
          username={settings?.username || 'Educator'}
          telemetry={telemetry}
          settings={settings}
          isFirstVisit={false}
          onDismiss={() => setIsWelcomeVisible(false)}
        />
      )}

      {/* Class Sections Overview */}
      <FrostedPanel
        id="panel-educator-classes"
        title={`Class Sections (${filteredClasses.length}/${data.classes.length})`}
        icon={<BookOpen className="w-4 h-4 text-white" />}
        badge="Teaching"
        isFrosted={frozenPanels.classes}
        onToggleFrost={() => setFrozenPanels((p) => ({ ...p, classes: !p.classes }))}
        isDark={isDark}
        headerActions={
          <button
            onClick={() => {
              setEditingClass(null);
              setShowAddClass(true);
            }}
            className="p-1 hover:bg-neutral-800 rounded transition-colors"
            title="Add Class"
          >
            <Plus className="w-4 h-4 text-neutral-400 hover:text-white" />
          </button>
        }
      >
        {/* Search */}
        {data.classes.length > 0 && (
          <div className="mb-3 relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              placeholder="Search classes..."
              value={classSearch}
              onChange={(e) => setClassSearch(e.target.value)}
              className={`w-full pl-9 pr-3 py-2 rounded border font-mono text-sm transition-colors focus:outline-none focus:border-white ${
                isDark
                  ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500'
                  : 'bg-neutral-50 border-neutral-300 text-neutral-900 placeholder-neutral-400'
              }`}
            />
            {classSearch && (
              <button
                onClick={() => setClassSearch('')}
                className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {filteredClasses.length === 0 ? (
          <div className={`p-4 rounded border text-center ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'}`}>
            <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {data.classes.length === 0 ? 'No classes yet. ' : 'No matching classes. '}
              <button
                onClick={() => {
                  setEditingClass(null);
                  setShowAddClass(true);
                }}
                className="text-white hover:underline font-bold"
              >
                Click + to add one
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClasses.map((section) => (
              <Card key={section.id} isDark={isDark} className="p-4 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>{section.name}</h3>
                      <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{section.students} students</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-mono font-bold ${section.engagement >= 80 ? (isDark ? 'bg-green-950/30 text-green-400' : 'bg-green-100 text-green-700') : (isDark ? 'bg-yellow-950/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700')}`}>
                      {section.engagement}% Engagement
                    </span>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className={`p-2 rounded text-center text-xs ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white border border-neutral-300'}`}>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{section.averageGrade}</p>
                      <p className={`font-mono text-[10px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Avg Grade</p>
                    </div>

                    <div className={`p-2 rounded text-center text-xs ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white border border-neutral-300'}`}>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{section.pendingSubmissions}</p>
                      <p className={`font-mono text-[10px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Pending</p>
                    </div>

                    <div className={`p-2 rounded text-center text-xs ${isDark ? 'bg-neutral-900 border border-neutral-800' : 'bg-white border border-neutral-300'}`}>
                      <p className={`font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{section.code}</p>
                      <p className={`font-mono text-[10px] ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Code</p>
                    </div>
                  </div>
                </div>

                <div className="ml-2 flex gap-1 flex-shrink-0">
                  <button onClick={() => { setEditingClass(section); setShowAddClass(true); }} className="p-2 hover:bg-blue-950/30 rounded transition-colors" title="Edit Class">
                    <Edit2 className="w-4 h-4 text-blue-400" />
                  </button>
                  <button onClick={() => removeClass(section.id)} className="p-2 hover:bg-red-950/30 rounded transition-colors" title="Delete Class">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </FrostedPanel>

      {/* Student Analytics */}
      <FrostedPanel
        id="panel-educator-analytics"
        title="Overall Analytics"
        icon={<TrendingUp className="w-4 h-4 text-white" />}
        badge="Metrics"
        isFrosted={frozenPanels.analytics}
        onToggleFrost={() => setFrozenPanels((p) => ({ ...p, analytics: !p.analytics }))}
        isDark={isDark}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <Card onClick={() => {}} isDark={isDark} className="p-3 text-center cursor-pointer hover:scale-105">
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{analytics.totalStudents}</p>
            <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Total Students</p>
          </Card>

          <Card onClick={() => {}} isDark={isDark} className="p-3 text-center cursor-pointer hover:scale-105">
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{analytics.averageEngagement}%</p>
            <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Avg Engagement</p>
          </Card>

          <Card onClick={() => {}} isDark={isDark} className="p-3 text-center cursor-pointer hover:scale-105">
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{analytics.averageGrade}</p>
            <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Avg Grade</p>
          </Card>

          <Card onClick={() => {}} isDark={isDark} className="p-3 text-center cursor-pointer hover:scale-105 col-span-2 sm:col-span-1">
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>{analytics.submitRate}%</p>
            <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Submit Rate</p>
          </Card>

          <Card onClick={() => {}} isDark={isDark} className={`p-3 text-center cursor-pointer hover:scale-105 ${analytics.pendingAssignments > 0 ? (isDark ? 'bg-orange-950/30 border-orange-700/50 hover:border-orange-600' : 'bg-orange-100 border-orange-300 hover:border-orange-400') : ''}`}>
            <p className={`text-2xl font-bold ${analytics.pendingAssignments > 0 ? (isDark ? 'text-orange-400' : 'text-orange-700') : (isDark ? 'text-white' : 'text-neutral-900')}`}>
              {analytics.pendingAssignments}
            </p>
            <p className={`text-xs font-mono ${analytics.pendingAssignments > 0 ? (isDark ? 'text-orange-400/70' : 'text-orange-700/70') : (isDark ? 'text-neutral-400' : 'text-neutral-600')}`}>
              Pending Grade
            </p>
          </Card>
        </div>
      </FrostedPanel>

      {/* Course Materials */}
      <FrostedPanel
        id="panel-educator-materials"
        title={`Course Materials (${resources.length})`}
        icon={<Award className="w-4 h-4 text-white" />}
        badge="Resources"
        isFrosted={frozenPanels.materials}
        onToggleFrost={() => setFrozenPanels((p) => ({ ...p, materials: !p.materials }))}
        isDark={isDark}
      >
        {resources.length === 0 ? (
          <p className={`text-xs py-4 text-center ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`}>
            No materials yet. Create lesson plans, slides, or course materials.
          </p>
        ) : (
          <div className="space-y-2">
            {resources.slice(0, 5).map((resource) => (
              <Card key={resource.id} onClick={() => onOpenResource(resource)} isDark={isDark} className="p-3 text-left">
                <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-neutral-900'}`}>{resource.title}</h4>
                <p className={`text-xs font-mono ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{resource.type} • {resource.badge}</p>
              </Card>
            ))}
          </div>
        )}
      </FrostedPanel>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ActionButton onClick={onCreateResourceClick} variant="primary" isDark={isDark}>
          Create Material
        </ActionButton>
        <ActionButton onClick={onOpenLibrary} isDark={isDark}>
          View Library
        </ActionButton>
        <ActionButton onClick={onOpenWorkspace} isDark={isDark} icon={<Users className="w-3 h-3" />}>
          Manage
        </ActionButton>
        {onOpenFishing && (
          <ActionButton onClick={onOpenFishing} isDark={isDark}>
            Insights
          </ActionButton>
        )}
      </div>
    </div>
  );
});

export default EducatorHubView;
