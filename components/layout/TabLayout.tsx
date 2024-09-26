import React, { ReactNode } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type TabItem = {
  label: string;
  content: ReactNode;
  icon?: ReactNode;
};

type TabLayoutProps = {
  tabs: TabItem[];
  defaultTab?: string;
};

const TabLayout: React.FC<TabLayoutProps> = ({ tabs, defaultTab }) => {
  const defaultValue = defaultTab || tabs[0]?.label;

  return (
    <div className='w-full min-h-screen'>
      <Tabs defaultValue={defaultValue} className='w-full'>
        <TabsList className='w-full flex rounded-lg p-1'>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.label}
              value={tab.label}
              className='data-[state=active]:bg-white data-[state=active]:text-gray-900 w-full rounded-md'
            >
              {tab.icon && <span className='mr-2'>{tab.icon}</span>}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.label} value={tab.label} className='mt-6'>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TabLayout;
