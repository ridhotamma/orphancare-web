import React, { ReactNode, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';

export type TabItem = {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
};

type TabLayoutProps = {
  tabs: TabItem[];
  defaultTab?: string;
  urlParamName?: string;
};

const TabLayout: React.FC<TabLayoutProps> = ({ tabs, defaultTab, urlParamName = 'tab' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const defaultValue = defaultTab || tabs[0]?.id;
  const currentTab = searchParams.get(urlParamName) || defaultValue;

  useEffect(() => {
    if (!searchParams.get(urlParamName)) {
      const params = new URLSearchParams(searchParams);
      params.set(urlParamName, defaultValue);
      router.push(`?${params.toString()}`);
    }
  }, [defaultValue, router, searchParams, urlParamName]);

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(urlParamName, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className='w-full min-h-screen'>
      <Tabs value={currentTab} onValueChange={handleTabChange} className='w-full'>
        <TabsList className='w-full flex rounded-lg p-1'>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className='data-[state=active]:bg-white data-[state=active]:text-gray-900 w-full rounded-md'
            >
              {tab.icon && <span className='mr-2'>{tab.icon}</span>}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className='mt-6'>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TabLayout;