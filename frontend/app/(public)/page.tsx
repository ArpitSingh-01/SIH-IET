'use client';

import { useState } from 'react';
import { LogoLoader } from '@/components/public/logo-loader';
import { HeroSection } from '@/components/public/hero-section';
import { AnnouncementSection, AnnouncementSkeleton } from '@/components/public/announcement-section';
import { ScheduleSection, ScheduleSkeleton } from '@/components/public/schedule-section';
import { TimelineSection, TimelineSkeleton } from '@/components/public/timeline-section';
import { ContactsSection, ContactsSkeleton } from '@/components/public/contacts-section';
import { AboutSection } from '@/components/public/about-section';
import { WhatsappSection } from '@/components/public/whatsapp-section';
import { FormsTab, FormsSkeleton } from '@/components/public/forms-tab';
import { NoticesTab, NoticesSkeleton } from '@/components/public/notices-tab';
import { ResourcesTab, ResourcesSkeleton } from '@/components/public/resources-tab';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useSchedule } from '@/hooks/useSchedule';
import { useTimeline } from '@/hooks/useTimeline';
import { useContacts } from '@/hooks/useContacts';
import { useSettings } from '@/hooks/useSettings';
import { useGoogleForms } from '@/hooks/useGoogleForms';
import { useDocuments } from '@/hooks/useDocuments';

type TabType = 'updates' | 'timeline' | 'forms' | 'notices' | 'resources';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>('updates');

  const announcements = useAnnouncements();
  const schedule = useSchedule();
  const timeline = useTimeline();
  const contacts = useContacts();
  const settings = useSettings();
  const forms = useGoogleForms();
  const notices = useDocuments('notice');
  const resources = useDocuments('resource');

  // Get the latest announcement (any type) for hero section — pinned first
  const allAnnouncements = [...announcements.data, ...schedule.data];
  const latestAnnouncement = allAnnouncements.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  })[0] || null;

  const tabs = [
    { id: 'updates', label: 'Updates' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'forms', label: 'Forms' },
    { id: 'notices', label: 'Notices' },
    { id: 'resources', label: 'Resources' },
  ] as const;

  const scrollToContact = () => {
    document.getElementById('contact-footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <LogoLoader />

      {/* 1. Hero — always renders */}
      <HeroSection
        latestAnnouncement={announcements.loading ? null : latestAnnouncement}
        whatsappEnabled={settings.whatsappEnabled}
        whatsappLink={settings.whatsappLink}
      />

      {/* 2. Navigation Tab Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto whitespace-nowrap scrollbar-none py-1.5 gap-2">
            <div className="flex gap-1.5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[40px] cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={scrollToContact}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 min-h-[40px] cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Body Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Updates Tab */}
        {activeTab === 'updates' && (
          <div className="space-y-6">
            {announcements.loading ? (
              <AnnouncementSkeleton />
            ) : (
              <AnnouncementSection announcements={announcements.data} />
            )}

            {schedule.loading ? (
              <ScheduleSkeleton />
            ) : (
              <ScheduleSection scheduleEntries={schedule.data} />
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          timeline.loading ? <TimelineSkeleton /> : <TimelineSection entries={timeline.data} />
        )}

        {/* Forms Tab */}
        {activeTab === 'forms' && (
          forms.loading ? <FormsSkeleton /> : <FormsTab forms={forms.data} />
        )}

        {/* Notices Tab */}
        {activeTab === 'notices' && (
          notices.loading ? <NoticesSkeleton /> : <NoticesTab notices={notices.data} />
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          resources.loading ? <ResourcesSkeleton /> : <ResourcesTab resources={resources.data} />
        )}
      </div>

      {/* 4. Secondary home sections (e.g. contacts / about SIH / whatsapp alerts) */}
      <div className="border-t border-slate-200">
        {/* WhatsApp Notification Card Bar */}
        {!settings.loading && (
          <WhatsappSection
            enabled={settings.whatsappEnabled}
            link={settings.whatsappLink}
          />
        )}

        {/* About SIH Description Details */}
        {!settings.loading && (
          <AboutSection content={settings.aboutContent} />
        )}

        {/* SPOC Contact Directory list */}
        {contacts.loading ? (
          <ContactsSkeleton />
        ) : (
          <ContactsSection contacts={contacts.data} />
        )}
      </div>
    </>
  );
}
