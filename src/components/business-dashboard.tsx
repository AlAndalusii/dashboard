import { EditableField } from './ui/editable-field';
import { BusinessData, DifficultyLevel, Task } from '@/lib/types';
import { useState } from 'react';

interface BusinessDashboardProps {
  data: BusinessData;
  onUpdate: (data: BusinessData) => void;
}

export function BusinessDashboard({ data, onUpdate }: BusinessDashboardProps) {
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDifficulty, setNewTaskDifficulty] = useState<DifficultyLevel>('medium');
  const [activeSection, setActiveSection] = useState<'bestFlightAlerts' | 'webTailors'>('bestFlightAlerts');

  const handleMetricUpdate = (
    business: 'bestFlightAlerts' | 'webTailors',
    field: string,
    value: string | number
  ) => {
    const numberFields = ['emailsSent', 'subscribers', 'targetSubscribers', 'clients', 'targetClients', 'revenue', 'websitesCreated'];
    const finalValue = numberFields.includes(field) ? Number(value) : value;
    
    onUpdate({
      ...data,
      [business]: {
        ...data[business],
        [field]: finalValue,
      },
    });
  };

  const handleTaskToggle = (business: 'bestFlightAlerts' | 'webTailors', taskId: string) => {
    onUpdate({
      ...data,
      [business]: {
        ...data[business],
        tasks: data[business].tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        ),
      },
    });
  };

  const handleAddTask = (business: 'bestFlightAlerts' | 'webTailors') => {
    if (!newTaskName.trim()) return;
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: newTaskName,
      completed: false,
      difficulty: newTaskDifficulty,
    };
    
    onUpdate({
      ...data,
      [business]: {
        ...data[business],
        tasks: [...data[business].tasks, newTask],
      },
    });
    
    setNewTaskName('');
  };

  const handleDeleteTask = (business: 'bestFlightAlerts' | 'webTailors', taskId: string) => {
    onUpdate({
      ...data,
      [business]: {
        ...data[business],
        tasks: data[business].tasks.filter((task) => task.id !== taskId),
      },
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeSection === 'bestFlightAlerts' 
              ? 'bg-white/10 text-white' 
              : 'bg-transparent text-white/50'
          }`}
          onClick={() => setActiveSection('bestFlightAlerts')}
        >
          BestFlightAlerts
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeSection === 'webTailors' 
              ? 'bg-white/10 text-white' 
              : 'bg-transparent text-white/50'
          }`}
          onClick={() => setActiveSection('webTailors')}
        >
          TheWebTailors
        </button>
      </div>

      {activeSection === 'bestFlightAlerts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="container-inner">
            <h3 className="text-xl font-bold mb-4">BestFlightAlerts Newsletter</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-sm text-white/70 mb-1">Emails Sent</h4>
                <EditableField
                  type="number"
                  value={data.bestFlightAlerts.emailsSent.toString()}
                  onChange={(value) => handleMetricUpdate('bestFlightAlerts', 'emailsSent', value)}
                  className="text-xl font-bold"
                />
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-sm text-white/70 mb-1">Current Subscribers</h4>
                <EditableField
                  type="number"
                  value={data.bestFlightAlerts.subscribers.toString()}
                  onChange={(value) => handleMetricUpdate('bestFlightAlerts', 'subscribers', value)}
                  className="text-xl font-bold"
                />
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg md:col-span-2">
                <h4 className="text-sm text-white/70 mb-1">Target Subscribers</h4>
                <EditableField
                  type="number"
                  value={data.bestFlightAlerts.targetSubscribers.toString()}
                  onChange={(value) => handleMetricUpdate('bestFlightAlerts', 'targetSubscribers', value)}
                  className="text-xl font-bold"
                />
              </div>
            </div>
          </div>
          
          <div className="container-inner">
            <h3 className="text-xl font-bold mb-4">Monthly Tasks</h3>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {data.bestFlightAlerts.tasks.map((task) => (
                <div key={task.id} className="task-item flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskToggle('bestFlightAlerts', task.id)}
                      className="h-5 w-5 rounded border-white/20 bg-black/20"
                    />
                    <span className={task.completed ? 'line-through text-white/50' : ''}>
                      {task.name}
                    </span>
                    {task.difficulty && (
                      <span className={`text-xs px-2 py-0.5 rounded-full tag-${task.difficulty}`}>
                        {task.difficulty}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteTask('bestFlightAlerts', task.id)}
                    className="text-white/50 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Add new task..."
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2"
              />
              <select
                value={newTaskDifficulty}
                onChange={(e) => setNewTaskDifficulty(e.target.value as DifficultyLevel)}
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button
                onClick={() => handleAddTask('bestFlightAlerts')}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'webTailors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="container-inner">
            <h3 className="text-xl font-bold mb-4">TheWebTailors</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-sm text-white/70 mb-1">Clients this month</h4>
                <EditableField
                  type="number"
                  value={data.webTailors.clients.toString()}
                  onChange={(value) => handleMetricUpdate('webTailors', 'clients', value)}
                  className="text-xl font-bold"
                />
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-sm text-white/70 mb-1">Target Clients</h4>
                <EditableField
                  type="number"
                  value={data.webTailors.targetClients.toString()}
                  onChange={(value) => handleMetricUpdate('webTailors', 'targetClients', value)}
                  className="text-xl font-bold"
                />
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-sm text-white/70 mb-1">Revenue</h4>
                <EditableField
                  type="number"
                  value={data.webTailors.revenue.toString()}
                  onChange={(value) => handleMetricUpdate('webTailors', 'revenue', value)}
                  className="text-xl font-bold"
                />
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-sm text-white/70 mb-1">Websites Created</h4>
                <EditableField
                  type="number"
                  value={data.webTailors.websitesCreated.toString()}
                  onChange={(value) => handleMetricUpdate('webTailors', 'websitesCreated', value)}
                  className="text-xl font-bold"
                />
              </div>
            </div>
          </div>
          
          <div className="container-inner">
            <h3 className="text-xl font-bold mb-4">Monthly Tasks</h3>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {data.webTailors.tasks.map((task) => (
                <div key={task.id} className="task-item flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskToggle('webTailors', task.id)}
                      className="h-5 w-5 rounded border-white/20 bg-black/20"
                    />
                    <span className={task.completed ? 'line-through text-white/50' : ''}>
                      {task.name}
                    </span>
                    {task.difficulty && (
                      <span className={`text-xs px-2 py-0.5 rounded-full tag-${task.difficulty}`}>
                        {task.difficulty}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteTask('webTailors', task.id)}
                    className="text-white/50 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Add new task..."
                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-3 py-2"
              />
              <select
                value={newTaskDifficulty}
                onChange={(e) => setNewTaskDifficulty(e.target.value as DifficultyLevel)}
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
              <button
                onClick={() => handleAddTask('webTailors')}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 