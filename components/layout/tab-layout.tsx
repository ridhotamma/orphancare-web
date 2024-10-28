import React, { ReactNode, useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';
import { Menu, X } from 'lucide-react';

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

const TabLayout: React.FC<TabLayoutProps> = ({
  tabs,
  defaultTab,
  urlParamName = 'tab',
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    setIsMenuOpen(false);
  };

  return (
    <div className='w-full min-h-screen'>
      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className='w-full'
      >
        {/* Mobile menu button */}
        <div className='lg:hidden mb-4'>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className='flex items-center px-3 py-2 border rounded text-gray-500 border-gray-500 hover:text-gray-900 dark:hover:text-gray-400 hover:border-gray-900 dark:hover:border-gray-400'
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            <span className='ml-2'>Menu</span>
          </button>
        </div>

        {/* Desktop tabs */}
        <TabsList className='hidden lg:flex w-full rounded-lg p-1'>
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

        {/* Mobile collapsible menu */}
        <div className={`lg:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className='flex flex-col space-y-2'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center px-4 py-2 rounded-md ${
                  currentTab === tab.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-100 hover:bg-gray-200'
                }`}
              >
                {tab.icon && <span className='mr-2'>{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

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
