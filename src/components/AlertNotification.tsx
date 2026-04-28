import { useEffect, useState } from 'react';
import { ArrowLeft, Bell, AlertTriangle, Megaphone, ChevronDown, ChevronUp } from 'lucide-react';

export interface AlertNotificationProps {
  onBack: () => void;
  userId: string;
}

interface NotificationItem {
  id: number;
  grade: string;
  notification_date: string;
  description: string;
}

interface NotificationResponse {
  message: string;
  count: number;
  data: NotificationItem[];
}

type SectionType = 'notifications' | 'alerts' | 'announcements';

const API_URL = 'https://o8yxvbako1.execute-api.us-east-1.amazonaws.com/default/event_get_student_notification';

function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const fetchNotifications = async () => {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: parseInt(userId, 10) }),
        });

        const result: NotificationResponse = await response.json().catch(() => ({
          message: 'Invalid response',
          count: 0,
          data: [],
        }));

        if (!cancelled) {
          if (response.ok && Array.isArray(result.data)) {
            setNotifications(result.data);
          } else {
            setError(result.message || 'Failed to fetch notifications');
            setNotifications([]);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Network error');
          setNotifications([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchNotifications();
    return () => { cancelled = true; };
  }, [userId]);

  return { notifications, loading, error };
}

function groupByGrade(items: NotificationItem[]): Record<string, NotificationItem[]> {
  return items.reduce((acc, item) => {
    const grade = item.grade || 'General';
    if (!acc[grade]) acc[grade] = [];
    acc[grade].push(item);
    return acc;
  }, {} as Record<string, NotificationItem[]>);
}

function NotificationTable({ items }: { items: NotificationItem[] }) {
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const toggleExpand = (id: number) => {
    setExpandedIds((prev: Set<number>) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const MAX_LENGTH = 100;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-blue-50 text-left">
            <th className="px-4 py-3 font-semibold text-blue-900 w-40">Notification Date</th>
            <th className="px-4 py-3 font-semibold text-blue-900">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => {
            const isExpanded = expandedIds.has(item.id);
            const isLong = item.description.length > MAX_LENGTH;
            const displayText = isExpanded || !isLong
              ? item.description
              : item.description.slice(0, MAX_LENGTH) + '...';

            return (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                  {item.notification_date}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  <p className="leading-relaxed">{displayText}</p>
                  {isLong && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(item.id)}
                      className="mt-1 inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium focus:outline-none"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-3.5 w-3.5" />
                          Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3.5 w-3.5" />
                          More
                        </>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function AlertNotification({ onBack, userId }: AlertNotificationProps) {
  const [activeSection, setActiveSection] = useState<SectionType>('notifications');
  const { notifications, loading, error } = useNotifications(userId);
  const grouped = groupByGrade(notifications);
  const grades = Object.keys(grouped).sort();

  const sectionConfig: { key: SectionType; label: string; icon: React.ReactNode }[] = [
    { key: 'notifications', label: 'Notifications', icon: <Bell className="h-5 w-5" /> },
    { key: 'alerts', label: 'Alerts', icon: <AlertTriangle className="h-5 w-5" /> },
    { key: 'announcements', label: 'Announcements', icon: <Megaphone className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="mx-auto max-w-5xl">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg transition-all hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Bell className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Alert and Notification</h1>
          <p className="text-lg text-gray-600">
            Stay updated with exam reminders, event schedules, and important school announcements.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {sectionConfig.map((section) => {
            const isActive = activeSection === section.key;
            return (
              <button
                key={section.key}
                type="button"
                onClick={() => setActiveSection(section.key)}
                className={[
                  'inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all shadow-sm',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md scale-105'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50',
                ].join(' ')}
              >
                {section.icon}
                {section.label}
              </button>
            );
          })}
        </div>

        {/* Section Content */}
        <div className="space-y-6">
          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              {loading && (
                <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
                  <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
                  <p className="text-gray-600 font-medium">Loading notifications...</p>
                </div>
              )}

              {error && !loading && (
                <div className="rounded-2xl bg-white p-8 shadow-xl text-center border border-red-100">
                  <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-red-500" />
                  <p className="text-red-600 font-medium">{error}</p>
                  <p className="text-sm text-gray-500 mt-1">Please try again later.</p>
                </div>
              )}

              {!loading && !error && notifications.length === 0 && (
                <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
                  <Bell className="mx-auto mb-3 h-10 w-10 text-gray-400" />
                  <p className="text-gray-700 font-medium">No notifications found</p>
                  <p className="text-sm text-gray-500 mt-1">Check back later for updates.</p>
                </div>
              )}

              {!loading && !error && grades.map((grade) => (
                <div
                  key={grade}
                  className="rounded-2xl bg-white p-6 shadow-xl border border-blue-100"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Bell className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Grade {grade}
                    </h2>
                    <span className="ml-auto inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {grouped[grade].length} notification{grouped[grade].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <NotificationTable items={grouped[grade]} />
                </div>
              ))}
            </div>
          )}

          {/* Alerts Section */}
          {activeSection === 'alerts' && (
            <div className="rounded-2xl bg-white p-8 shadow-xl border border-orange-100 text-center">
              <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Alerts</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Important alerts and urgent notices will appear here. Currently there are no active alerts.
              </p>
            </div>
          )}

          {/* Announcements Section */}
          {activeSection === 'announcements' && (
            <div className="rounded-2xl bg-white p-8 shadow-xl border border-green-100 text-center">
              <Megaphone className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Announcements</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                School-wide announcements and general notices will appear here. Stay tuned for updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

